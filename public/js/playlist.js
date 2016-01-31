/*ololord global object*/

var lord = lord || {};

/*Variables*/

lord.currentTracks = {};

/*Functions*/

lord.allowTrackDrop = function(e) {
    e.preventDefault();
}

lord.trackDrag = function(e) {
    e.dataTransfer.setData("text", $(e.target).closest(".track")[0].id);
}

lord.trackDrop = function(e) {
    e.preventDefault();
    var data = e.dataTransfer.getData("text");
    var parent = lord.id("player-audio-list");
    var draggedTrack = lord.id(data);
    var replacedTrack = $(e.target).closest(".track")[0];
    if (!draggedTrack || !replacedTrack)
        return;
    var draggedBoardName = lord.data("boardName", draggedTrack);
    var draggedFileName = lord.data("fileName", draggedTrack);
    var replacedBoardName = lord.data("boardName", replacedTrack);
    var replacedFileName = lord.data("fileName", replacedTrack);
    var draggedIndex;
    var replacedIndex;
    var trackList = lord.getLocalObject("playlist/trackList", []);
    for (var i = 0; i < trackList.length; ++i) {
        var track = trackList[i];
        if (draggedBoardName == track.boardName && draggedFileName == track.fileName) {
            draggedIndex = i;
            if (replacedIndex >= 0)
                break;
        }
        if (replacedBoardName == track.boardName && replacedFileName == track.fileName) {
            replacedIndex = i;
            if (draggedIndex >= 0)
                break;
        }
    }
    if (draggedIndex >= 0 && replacedIndex >= 0)
        trackList[draggedIndex] = trackList.splice(replacedIndex, 1, trackList[draggedIndex])[0];
    lord.setLocalObject("playlist/trackList", trackList);
    parent.insertBefore(draggedTrack, replacedTrack);
};

    /**
     * @deprecated
     */
lord.addTrack = function(key, track) {
    var model = merge.recursive(track, lord.model(["base", "tr"], true));
    var node = lord.template("playlistItem", model);
    lord.id("player-audio-list").appendChild(node);
    lord.currentTracks[key] = track;
    var audio = lord.queryOne("audio", node);
    audio.addEventListener("play", function() {
        lord.forIn(lord.currentTracks, function(_, k) {
            if (k == key)
                return;
            var div = lord.id("track/" + k);
            var prev = lord.queryOne("audio", div);
            if (!prev.paused) {
                audio.volume = prev.volume;
                prev.pause();
            }
        });
    }, false);
    audio.addEventListener("ended", function() {
        var nextDiv = audio.parentNode.nextSibling;
        if (!nextDiv)
            return;
        var nextAudio = lord.queryOne("audio", nextDiv);
        nextAudio.volume = audio.volume;
        nextAudio.play();
    }, false);
};

lord.removeFromPlaylist = function(a) {
    var boardName = lord.data("boardName", a, true);
    var fileName = lord.data("fileName", a, true);
    var key = lord.data("sitePathPrefix") + boardName + "/src/" + fileName;
    var trackList = lord.getLocalObject("playlist/trackList", []);
    for (var i = 0; i < trackList.length; ++i) {
        var track = trackList[i];
        if (boardName == track.boardName && fileName == track.fileName) {
            trackList.splice(i, 1);
            break;
        }
    }
    lord.setLocalObject("playlist/trackList", trackList);
    var node = lord.id("track/" + key);
    if (node)
        lord.id("player-audio-list").removeChild(node);
    if (lord.currentTracks.hasOwnProperty(key))
        delete lord.currentTracks[key];
    Player.initAudioList();
};

var audio = new Audio(),
    atmpt = 0,
    hover = false,
    LO = {
        get: lord.getLocalObject,
        set: lord.setLocalObject
    },
    Player = {
        inited: false,
        init: function(noRender) {
            if(!this.inited) {
                var pph = lord.id("tplayerPlaceholder");
                var model = lord.model(["base", "tr"], true);
                if (pph)
                    pph.parentNode.replaceChild(lord.template("player", model), pph);
                this.getVolume();
                LO.set('enableAjax',true);
                this.inited = true;
	            if (noRender == false)
		            this.playAudio(tumb.objSize(lord.currentTracks)-1, false);
            }
        },
        uninit: function() {
            if(this.inited) {
                this.stop();
                var ph = lord.node("div"),
                    pph = lord.id("tplayer");
                ph.id = "tplayerPlaceholder";
                lord.removeChildren(pph);
                pph.appendChild(ph);
                $.each($('.track'), function () {
                    $(this).removeClass('playing');
                });
                LO.set('enableAjax',false);
                this.inited = false;
            }
        },
	    /*findTrack: function(track){
		    console.log(track, lord.currentTracks);
		    if(!this.inited)
		        this.init(true);
		    var keys = [],
			    obj = lord.currentTracks;
		    for(var key in obj){
			    if (track == key)
			        return this.playAudio(keys.length);
			    keys.push(key);
		    }
		    return false;
	    },*/
        initAudioList: function () {
            var ncont = '#player-audio-list',
                pl = LO.get("playlist/trackList", '');
            $(document).off('click', ncont + ' .track')
                .on('click', ncont + ' .track', function () {
                    var th = $(this);
                    if(th.hasClass('playing')){
                        audio.paused ? Player.play() : Player.pause();
                    } else {
                        Player.playAudio(th.index(ncont + ' .track'));
                        $.each($('.track'), function () {
                            $(this).removeClass('playing');
                        });
                        th.addClass('playing');
                    }
                });
            if (pl == '') {
                $(ncont).html('<div class="table-cell" id="pl-splash">Список воспроизведения пуст.</div>');
                return;
            }
            pl.forEach(function(track) {
                var key = lord.data("sitePathPrefix") + track.boardName + "/src/" + track.fileName;
                if (lord.currentTracks.hasOwnProperty(key))
                    return;
                lord.currentTracks[key] = {};
                Player.addTrack(key, track);
            });
        },
        initRadio: function () {
            var file = "/assets/radio.json",
                ncont = '#player-radio-list',
                cont = $(ncont),
                html = '';
            $.getJSON(file, function (data) {
                $.each(data, function (key, val) {
                    html += "<div class='musicindathread' data-title='" + val.title + "'><div class='player-thread-header'>" + val.title + "</div>";
                    $.each(val.quality, function (k, v) {
                        html += "<div class='track' data-url='" + v.url + "'><div class='float-l' title='"+ v.prefix +"'>" + val.title + " (" + v.prefix + ")</div><div class='float-r'>" + v.kb + "</div><div class='clr'></div></div>";
                    });
                    html += "</div>";
                });
                cont.html(html);
                $(ncont).data('loaded', true);
            });
            $(document).off('click', ncont + ' .track')
                .on('click', ncont + ' .track', function () {
                    var th = $(this);
                    if(th.hasClass('playing'))
                        return;
                    Player.playRadio(th.data('url'), $(ncont + ' .musicindathread').data('title'));
                    $.each($('.track'), function () {
                        $(this).removeClass('playing');
                    });
                    th.addClass('playing');
                });
        },
        playAudio: function (id, play) {
            if(typeof play == 'undefined')
	            var play = true;
            if(!this.inited) {
	            this.init();
	            this.initAudioList();
            }
            if(typeof id == 'undefined')
                var id = LO.get('player.audio.last.id', 0);
            var aud = $(lord.query('.track',lord.id('player-audio-list'))[id]),
                data = aud.data(),
                title = $(aud.find('.float-l')[0]).text();
	        if(typeof data == 'undefined') {
		        lord.showPopup("Аудиозапись недоступна.",{type:"critical"});
		        return false;
	        }
            $('#player-line').show();
		    audio.src = data.url;
            $('#pl-title').html('<b class="cursorPointer" title="Ответить прикрепившему музыку" onclick=lord.quickReply(lord.id("'
                +data["thread"]+'"));><u>&gt;&gt;'+data["boardName"]+'/'+data["thread"]+'</u></b><br/>'+title+'</div>');
            $("#player-ctrl-forward").addClass("zmdi-fast-forward").removeClass("zmdi-replay");
            $.each($('.track'), function () {
                $(this).removeClass('playing');
            });
            aud.addClass('playing');
            LO.set('player.audio.last', {id:id, url:data['url']});
            LO.set('player.audio.last.id', id);
            LO.set('player.mode', 'audio');
            if(play) this.play();
        },
        playRadio: function (url, title) {
            if(!this.inited)
                Player.init(true);
            $('#player-line').hide();
            audio.src = url;
            $('#pl-title').html('<b>Radio Mode</b><br/>' + title + '</div>');
            $("#player-ctrl-forward").removeClass("zmdi-fast-forward").addClass("zmdi-replay");
            LO.set('player.radio.last', {url:url, title:title});
            LO.set('player.mode','radio');
            this.play();
        },
        play: function() {
            audio.play();
            $('#plpa').removeClass('zmdi-play').addClass('zmdi-pause');
        },
        pause: function() {
            audio.pause();
            $('#plpa').removeClass('zmdi-pause').addClass('zmdi-play');
        },
        stop: function() {
            this.pseudostop();
            audio.src = '';
        },
        pseudostop: function() {
            audio.currentTime = 0;
            this.pause();
        },
        reconnect: function() {
            var text = '[Radio] Переподключение...';
            console.warn(text);
            lord.showPopup(text);
            this.pause();
            this.playRadio(LO.get('player.radio.last')['url'], LO.get('player.radio.last')['title']);
        },
        getVolume: function () {
            var vol = 0.42,
                remember = lord.settings().rememberAudioVideoVolume;
            audio.volume = remember ? LO.get("audioVideoVolume", vol) : vol;
            $('#vol-line-active').width(vol * 100 + '%');
            if(!LO.get('audioVideoVolume', false))
                LO.set("audioVideoVolume", vol);
        },
        setVolume: function (p) {
            var vol = p.vol,
                ch = p.ch,
                nul = (vol == 0),
                cb = $('#mute');
            $('#vol-line-active').width(vol * 100 + '%');
            if (vol < 0)
                vol = 0;
            else if (vol > 1)
                vol = 1;
            audio.volume = vol;
            //if (nul) cb.prop('checked', true);
            if (cb.checked != nul) cb.prop('checked', nul);
            if (lord.settings().rememberAudioVideoVolume)
                if (undefined == ch && !nul) LO.set('audioVideoVolume', Math.ceil(vol * 100) / 100);
        },
        parse: function (c) { /* -1<=c<=1 */
            var cb = $('#shuffle').prop('checked'),
                ls = LO.get('playlist/trackList'),
                l = ls.length-1; /*last_id*/
            if (cb) {
                var rnd = Math.floor(Math.random() * (l + 1)) - 1;
                while(LO.get('player.audio.last.id',0) == rnd) {
                    var rn = Math.floor(Math.random() * (l + 1)) - 1;
                    LO.set('player.audio.last.id', rn);
                }
                c = 1;
            }
            var id = LO.get('player.audio.last.id',0), /*current_id*/
                n = id + c; /*next_id*/
            if (undefined != c) {
                if (c == 0) //loop
                    this.play();
                else if (n <= -1) //lookbehind from da beginning
                    this.playAudio(l);
                else if (n <= l) //lookahead
                    this.playAudio(n);
                else { //lookbehind from da end
                    this.playAudio(0);
                    if (!cb)
                        this.pseudostop();
                }
            } else {
                this.playAudio(0);
                LO.set('player.audio.last.id', 0);
            }
            return true;
        },
        addTrack: function(key, track) {
            var spl = lord.id("pl-splash");
            if(spl) spl.parentNode.removeChild(spl);
            var model = merge.recursive(track, lord.model(["base","tr"], true));
            lord.id("player-audio-list").appendChild(lord.template("playlistItem", model));
            lord.currentTracks[key] = track;
        }
    };
audio.addEventListener('ended', function(){
    Player.initAudioList();
    if(LO.get('player.mode') == 'audio') {
        if (LO.get('player.loop', false))
            Player.parse(0);
        else Player.parse(1);
    } else
        setTimeout(function(){Player.reconnect()},5000);
});
audio.addEventListener("timeupdate", function() {
    var seconds = audio.currentTime;
    var s = (parseInt(seconds%60) <10) ? '0'+parseInt(parseInt(seconds%60)) : parseInt(parseInt(seconds%60));
    var m = ((seconds/60)%60 <10) ? '0'+parseInt((seconds/60)%60) : parseInt((seconds/60)%60);
    var h = ((seconds/3600)%60 <1) ? '' : parseInt((seconds/3600)%60)+':';
    $('#pl-duration').html(h + m + ':' + s);
    if(LO.get('player.mode') == 'audio') {
        var length = audio.duration;
        var progress = (seconds/length) * 100;
        var seekableEnd = (audio.buffered.length > 0) ? ((audio.buffered.end(audio.buffered.length-1)/length) * 100) : 0;
        $('#lineloaded').css({'width':seekableEnd+'%'});
        if(!hover)$('#lineplayed').css({'width':progress+'%'});
    }
});
audio.addEventListener('error', function failed(e) {
    if(LO.get('player.mode') == 'radio') {
        switch (e.target.error.code) {
            case e.target.error.MEDIA_ERR_NETWORK:
                    if(atmpt < 4) {
                        atmpt++;
                        setTimeout(function () {
                            Player.reconnect()
                        }, 5000);
                        return;
                    }
                    Player.pause();
                    atmpt = 0;
                    lord.showPopup("Не можем проиграть, такие дела", {type:"critical"});
                    return;
                break;
        }
    }
    //lord.showPopup("Не можем загрузить аудио", {type:"critical"});
    //TODO: Обработка ошибок загрузки музыки
}, true);
$(document).ready(function(){
    setTimeout(function(){
        $('#loop').prop('checked', LO.get('player.loop', false));
        $('#shuffle').prop('checked', LO.get('player.shuffle', false));
    },2000);
}).on('click', ".rewind", function() {
    Player.parse(-1);
}).on('click', ".zmdi-fast-forward", function() {
    Player.parse(1);
}).on('click', '.zmdi-replay', function() {
    Player.reconnect();
}).on('click', ".zmdi-play", function() {
    if (audio.src == '')
        Player.parse();
    else
        Player.play();
}).on('click', ".zmdi-pause", function() {
    Player.pause();
    $(this).removeClass('btn-pause');
}).on('click', "#tabl2", function() {
    if ($('#player-radio-list').data('loaded') != true) Player.initRadio();
}).on('click', "#tabl1,.player-menu", function() {
    Player.initAudioList();
}).on('mousedown', "#vol-line, #player-line", function() {
    hover = true;
}).on('mouseup', "body", function() {
    hover = false;
}).on('mousemove', "#vol-line", function(e) {
    if (!hover) return;
    var th = $(this);
    Player.setVolume({vol: (e.pageX - th.offset().left) / th.width()});
}).on('click', "#vol-line", function(e) {
    var th = $(this);
    Player.setVolume({vol: (e.pageX - th.offset().left) / th.width()});
}).on('mousemove', "#player-line", function(e) {
    if (!hover) return;
    var th = $(this);
    $('#lineplayed').css({'width': 100 * (e.pageX - th.offset().left) / th.width() + '%'});
}).on('mouseup', "#player-line", function(e) {
    var th = $(this);
    audio.currentTime = audio.duration * (e.pageX - th.offset().left) / th.width();
}).on('change', "#shuffle", function() {
    var shuf = this.checked;
    if (LO.get('player.shuffle', false) != shuf)
        LO.set('player.shuffle', shuf);
}).on('change', "#loop", function() {
    var loop = this.checked;
    LO.set('player.loop', loop);
    $('.audio-container audio').attr('loop', loop);
}).on('click', ".stop", function() {
    Player.uninit();
}).on('change','#mute', function() {
    if(this.checked) {
        audio.muted = 1;
        Player.setVolume({vol: 0, ch: false});
    } else {
        audio.muted = 0;
        Player.setVolume({vol: LO.get('audioVideoVolume'), ch: false});
    }
});