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
		if(toggle != undefined)
			tumb.toggle.navbar(hc);
		if(!toggle)
			setTimeout(function() {
				tumb.go.wr.addClass("transition");
				tumb.go.sb.addClass("transition");
			}, 100);
		if(toggle || (lord.getLocalObject("showFrame", lord.deviceType("desktop")) != hc)) {
			if((tumb.go.width < 1024 || lord.deviceType("mobile")) && !toggle)
				return;
			else
				lord.setLocalObject("showFrame", !hc);
			if(tumb.go.width < 1024) {
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
		return false;
	},
	navbar: function(toggle) {
		var n = $(".navbar, .toolbar"),
			ls = !lord.getLocalObject("showFrame", true);
		if(lord.deviceType("mobile") || tumb.go.width < 1024)
			return n.show();
		(toggle || (toggle == undefined && ls)) ? n.slideDown() : n.slideUp();
	}
};
tumb.dottie = function(floatElement) {
	var floatElement = $(floatElement),
		wrap = $('.wrap');
	if(!localStorage["scroll"] || localStorage["scrollPage"] != window.location)
		localStorage["scroll"] = 0;
	localStorage["scrollPage"] = window.location;
	function moveDottie() {
		if (window.scrollY > 0) {
			if(localStorage["scroll"] < $(document).scrollTop())
				localStorage["scroll"] = $(document).scrollTop();
			if (lord.settings().transparentHeader)
				floatElement.addClass("transparent");
		} else
			if (lord.settings().transparentHeader)
				floatElement.removeClass("transparent");
	}
	moveDottie();
	window.onscroll = function(){
		moveDottie()
	};
};
tumb.slidy = function(el) {
	if(!localStorage["scroll"])
		localStorage["scroll"] = $("header").offset().top;
	$(el).bind('wheel', function (e) {
		if( e.originalEvent.detail > 0 || e.originalEvent.wheelDelta < 0 || e.originalEvent.deltaY > 0) { //scroll down
			$('html,body').stop().animate({
				scrollTop: localStorage["scroll"]
			}, 500);
		} else { //scroll up
			$('html,body').stop().animate({
				scrollTop: 0
			}, 500);
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
	tumb.toggle.navbar();
	tumb.dottie('header');
    tumb.slidy('.kek');
    $('.kek').bind('click', function(){
		tumb.toggle.frame(true);
		return false;
    });
    $('.overlay, .list-item, #sidebar .frameLabels i').bind('click', function(){
        if (tumb.go.sb.hasClass('open') && tumb.go.width < 1024) {
			tumb.go.sb.removeClass('open');
			tumb.go.sb2.removeClass('open');
		}
		tumb.go.ov.removeClass('toggled');
    });
	$(document).on("click", "#tabl2", function() {
		if ($("#player-radio-list").data("loaded") != true)
			lord.initRadio();
	});
};
