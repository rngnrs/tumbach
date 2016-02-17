var tumb = tumb || {};
tumb.dottie = function(floatElement, upperDiv) {
	var mode = (upperDiv === undefined) ? 1 : 0,
		maxh = 650,
	    floatElement = $(floatElement),
		upperDiv = $(upperDiv),
		wrap = $('.wrap'),
		height = (mode === 1) ? 0 : $(window).height()-floatElement.height();
	if(height < maxh && mode === 0)
		height = maxh;
	else
		upperDiv.css({'height':height+'px'});
	if(!localStorage["scroll"] || localStorage["scrollPage"] != window.location) {
		localStorage["scroll"] = height;
		localStorage["scrollPage"] = window.location;
	}
	window.onscroll = function() {
		if (window.scrollY > height) {
			if(localStorage["scroll"] < $(document).scrollTop())
				localStorage["scroll"] = $(document).scrollTop();
			if (floatElement.hasClass('default')) {
				floatElement.removeClass("default").addClass("fixed");
				wrap.css({'padding-top':floatElement.height()+wrap.css('padding-top').replace(/[^-d.]/g, '')+'px'});
			}
		} else {
			if (floatElement.hasClass('fixed')) {
				floatElement.removeClass("fixed").addClass("default");
				wrap.css({'padding-top':''});
			}
		}
	};
	return (mode === 1) ? 'down-only' : 'landing';
};
tumb.slidy = function(el) {
	if(!localStorage["scroll"])
		localStorage["scroll"] = $("header").offset().top;
	$(el).bind('mousewheel', function (e) {
	  if( e.originalEvent.detail > 0 || e.originalEvent.wheelDelta < 0 ) { //scroll down
		$('body').stop().animate({
			scrollTop: localStorage["scroll"]
		}, 500);
		e.preventDefault();
	  } else { //scroll up
		$('body').stop().animate({
			scrollTop: 0
		}, 500);
		e.preventDefault();
	  }
	});
};
tumb.switchStyle = function(style) {
	$('#stylesheet').attr('href','/'+lord.data("sitePathPrefix")+'css/'+style+'.css');
	$('#jqui-stylesheet').attr('href', '/'+lord.data("sitePathPrefix")+'css/3rdparty/jquery-ui/'+style+'/jquery-ui.min.css');
    lord.setLocalObject("style", style);
};
tumb.objSize =function(obj) {
	var size = 0, key;
	for (key in obj)
		if (obj.hasOwnProperty(key))
			size++;
	return size;
};
tumb.toggleFrame = function(toggle) {
	var hc = tumb.go.sb.hasClass('open');
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
			if (tumb.go.sb2.hasClass('open'))
				tumb.go.sb2.removeClass('open');
		} else {
			tumb.go.wr.toggleClass('toggle');
			tumb.go.sb.addClass('sidebar-stacked').removeClass('sidebar-fixed-left');
		}
		tumb.go.sb.toggleClass('open');
		return hc;
	}
	return false;
};
tumb.onLoad = function(){
	tumb.go = {
		sb: $('#sidebar'),
		sb2: $('#sidebar2'),
		ov: $('.overlay'),
		wr: $('.wrap'),
		width: $(window).width()
	};
    $('.noselect').attr('unselectable', 'on')
        .css('user-select', 'none')
        .on('selectstart', false);
    $('#style-switcher').change(function() {
        tumb.switchStyle(this.value);
    });
	tumb.toggleFrame();
    tumb.dottie('header');
    tumb.slidy('.kek');
    $('.kek').bind('click', function(){
		tumb.toggleFrame(true);
		return false;
    });
    $('.overlay, .list-item').bind('click', function(){
        if (tumb.go.sb.hasClass('open') && tumb.go.width < 1024)
			tumb.go.sb.removeClass('open');
		tumb.go.sb2.removeClass('open');
		tumb.go.ov.removeClass('toggled');
    });
    $('.player-menu').bind('click', function() {
		tumb.go.sb2.toggleClass('open');
    });
};