var tumb = tumb || {};
tumb.dottie = function(floatElement, upperDiv) {
	var mode = (upperDiv === undefined) ? 1 : 0;
	var maxh = 650,
	    floatElement = $(floatElement),
		upperDiv = $(upperDiv),
		wrap = $('.wrap');
	var height = (mode === 1) ? 0 : $(window).height()-$(floatElement).height();
	var init = function(){
		if(height<maxh && mode === 0) height=maxh;
		else upperDiv.css({'height':height+'px'});
	};
	init();
	if(!localStorage["scroll"])
		localStorage["scroll"] = height;
	window.onscroll = function() {
		if (window.scrollY > height) {
			if(localStorage["scroll"]<$(document).scrollTop()) localStorage["scroll"] = $(document).scrollTop();
			if (floatElement.hasClass('default')) {
				floatElement.removeClass("default").addClass("fixed");
				$(wrap).css({'padding-top':$(floatElement).height()+$(wrap).css('padding-top').replace(/[^-d.]/g, '')+'px'});
			}
		} else {
			if (floatElement.hasClass('fixed')) {
				floatElement.removeClass("fixed").addClass("default");
				$(wrap).css({'padding-top':''});
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
/** @deprecated ? */
tumb.clicky = function(el) {
	$(el).bind('click', function () {
	  if($(document).scrollTop() <= ($(window).height()/2)) {//is it the top of this page?
		$('body').stop().animate({
			scrollTop: localStorage["scroll"]
		}, 500);
		event.preventDefault();
	  } else { //oh no, it isn't.
		$('body').stop().animate({
			scrollTop: 0
		}, 500);
		event.preventDefault();
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
	for (key in obj) {
		if (obj.hasOwnProperty(key)) size++;
	}
	return size;
};
tumb.onLoad = function(){
    $('.noselect').attr('unselectable', 'on')
        .css('user-select', 'none')
        .on('selectstart', false);
    $('#style-switcher').change(function () {
        tumb.switchStyle(this.value);
    });
    tumb.dottie('header');
    tumb.slidy('.kek');
    var sb = $('#sidebar'),
        sb2 = $('#sidebar2'),
        ov = $('.overlay'),
        wr = $('.wrap'),
        width = $(window).width();
    if(width < 1024){
        wr.addClass('toggle');
        sb.removeClass('sidebar-stacked open').addClass('sidebar-fixed-left');
    } else {
        wr.removeClass('toggle');
        sb.addClass('sidebar-stacked open').removeClass('sidebar-fixed-left');
    }
    $('.kek').bind('click', function(){
        if(width < 1024){
            sb.toggleClass('open');
			ov.toggleClass('toggled');
            return false;
        }
    });
    $('.overlay, .menu .list-item').bind('click', function(){
        if (sb.hasClass('open') && width < 1024)
	        sb.removeClass('open');
        sb2.removeClass('open');
        ov.removeClass('toggled');
    });
    $('.player-menu').bind('click', function() {
        sb2.toggleClass('open');
    });
};