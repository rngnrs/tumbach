var tumb = tumb || {};
tumb.ajaxProcessors = [];
tumb.set = {
	tileColor: function(style){
		var hex = {
			"burichan": "c4c2ee",
			"futaba": "f0e0d6",
			"neutron": "2c2c2c",
			"photon": "ddd",
			"tumbach": "99d9ea"
		};
		return (typeof hex[style] != "undefined") ?
			lord.queryAll("[name=theme-color],[name=msapplication-TileColor]").forEach(function(meta){
				meta.content = "#"+hex[style];
			}) : false;
	}
};
tumb.toggle = {
	frame: function(toggle) {
		var hc = tumb.go.sb.hasClass('open');
		if(toggle == undefined)
			setTimeout(function () {
				tumb.go.wr.addClass("transition");
				tumb.go.sb.addClass("transition");
				tumb.go.sb2.addClass("transition");
			}, 500);
		if(toggle || (lord.settings().showFrame != hc && lord.deviceType("desktop"))) {
			lord.setLocalObject("showFrame", !hc);
			if(tumb.go.width < 1024 && !lord.getLocalObject("forcedShowFrame", lord.deviceType("desktop"))) {
				tumb.go.ov.toggleClass('toggled');
				tumb.go.sb.removeClass('sidebar-stacked').addClass('sidebar-fixed-left');
				tumb.go.sb2.removeClass('open');
			} else {
				tumb.go.wr.toggleClass('toggle');
				tumb.go.sb.addClass('sidebar-stacked').removeClass('sidebar-fixed-left');
			}
			tumb.go.sb.toggleClass('open');
			return;
		}
		tumb.go.sb.removeClass('open');
		tumb.go.wr.removeClass('toggle');
		lord.setLocalObject("showFrame", false);
		return false;
	}
};
tumb.dottie = function(floatElement) {
	var floatElement = $(floatElement),
		wrap = $('.wrap'),
		pn = location.pathname+location.search+location.hash;
	if(!localStorage["scroll"] || localStorage["scrollPage"] != pn)
		localStorage["scroll"] = 0;
	localStorage["scrollPage"] = pn;
	function moveDottie() {
		if (window.scrollY > 0) {
			if(localStorage["scroll"] < $(document).scrollTop())
				localStorage["scroll"] = $(document).scrollTop();
			if (lord.settings().transparentHeader)
				floatElement.addClass("transparent");
			if (floatElement.hasClass('default') && lord.settings().stickyToolbar) {
				floatElement.removeClass("default").addClass("fixed");
				wrap.css({'padding-top':floatElement.height()+wrap.css('padding-top').replace(/[^-d.]/g, '')+'px'});
			}
		} else {
			if (lord.settings().transparentHeader)
				floatElement.removeClass("transparent");
			if (floatElement.hasClass('fixed') && lord.settings().stickyToolbar) {
				floatElement.removeClass("fixed").addClass("default");
				wrap.css({'padding-top': ''});
			}
		}
	}
	moveDottie();
	window.onscroll = function () {
		moveDottie()
	};
};
tumb.slidy = function(el) {
	if(!localStorage["scroll"])
		localStorage["scroll"] = $("header").offset().top;
	var a = $('html,body');
	$(el).bind('wheel', function (e) {
		if( e.originalEvent.detail > 0 || e.originalEvent.wheelDelta < 0 || e.originalEvent.deltaY > 0) { //scroll down
			(lord.getLocalObject('animatedEffects',true))?
				a.stop().animate({
					scrollTop: localStorage["scroll"]
				}, 500):
				window.scrollTo(0,localStorage["scroll"]);
		} else { //scroll up
			(lord.getLocalObject('animatedEffects',true))?
				a.stop().animate({
					scrollTop: 0
				}, 500):
				window.scrollTo(0,0);
		}
		e.preventDefault();
	});
};
tumb.switchStyle = function(style, fromSwitcher) {
	tumb.set.tileColor(style);
	$('#stylesheet').attr('href','/'+lord.data("sitePathPrefix")+'css/'+style+'.css');
	$('#jqui-stylesheet').attr('href', '/'+lord.data("sitePathPrefix")+'css/3rdparty/jquery-ui/'+style+'/jquery-ui.min.css');
    lord.setLocalObject("style", style);
	if(!fromSwitcher)
		$("#style-switcher").val(style);
};
tumb.length = function(obj) {
	var size = 0, key;
	for (key in obj)
		if (obj.hasOwnProperty(key))
			size++;
	return size;
};
tumb.onLoad = function(){
    $('.noselect').attr('unselectable', 'on')
        .css('user-select', 'none')
        .on('selectstart', false);
    $('#style-switcher').change(function() {
        tumb.switchStyle(this.value,true);
    });
	tumb.dottie('header');
    tumb.slidy('.kek');
    $('.kek').bind('click', function(){
		tumb.toggle.frame(true);
		return false;
    });
    $('.overlay, .list-item, #sidebar .frameLabels i').bind('click', function(){
        if (tumb.go.sb.hasClass('open') && !lord.getLocalObject("forcedShowFrame", lord.deviceType("desktop"))) {
			tumb.go.sb.removeClass('open');
			tumb.go.sb2.removeClass('open');
		}
		tumb.go.ov.removeClass('toggled');
    });
	$(document).on("click", "#tabl2", function() {
		if ($("#playerRadios").data("loaded") != true)
			lord.initRadio();
	});
	$('#sidebar2').on('mouseenter', '.track', function() {
			var $trackName = $(this).find('.trackInfo');
			if($trackName[0].scrollWidth <= $trackName[0].offsetWidth)
				return;
			$trackName.stop().addClass('no-overflow');
			$trackName.animate({
				scrollLeft: $trackName.width()
			}, $trackName.width()*15, 'linear');
		})
		.on('mouseleave', '.track', function() {
			var $trackName = $(this).find('.trackInfo');
			if($trackName[0].scrollWidth <= $trackName[0].offsetWidth)
				return;
			$trackName.stop().animate({
				scrollLeft: 0
			}, 'slow', 'linear', function() {
				$trackName.removeClass('no-overflow');
			});
		})
};
