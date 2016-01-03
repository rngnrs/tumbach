var tumb = tumb || {};
tumb.dottie = function(floatElement, upperDiv) {
	var mode = (upperDiv === undefined) ? 1 : 0;
	var name,
		maxh = 650,
	    width = [],
	    floatElement = $(floatElement),
		upperDiv = $(upperDiv),
		wrap = $('.wrap');
	var height = (mode === 1) ? 0 : $(window).height()-$(floatElement).height();
	var init = function(){
		if(height<maxh && mode === 0) height=maxh;
		else upperDiv.css({'height':height+'px'});
	};
	init();
	localStorage["scroll"] = height;
/*	$(window).bind('resize', function(){init()});
	$(floatElement).hover(function(){decrypt()},function(){if(floatElement.hasClass('fixed')){crypt()}});
	$('menu li').each(function(){
		var self = $(this);
		name = $(self).text();
		$(self).data('name', name);
	});*/

	window.onscroll = function(event) {
		if (window.scrollY > height) {
			if(localStorage["scroll"]<$(document).scrollTop()) localStorage["scroll"] = $(document).scrollTop();
			if (floatElement.hasClass('default')) {
				//$('menu li').css({'opacity':'.2'});
				floatElement.removeClass("default").addClass("fixed");
				$(wrap).css({'padding-top':$(floatElement).height()+$(wrap).css('padding-top').replace(/[^-d.]/g, '')+'px'});
				crypt();
			}
		} else {
			if (floatElement.hasClass('fixed')) {
				//$('menu li').css({'opacity':''});
				floatElement.removeClass("fixed").addClass("default");
				$(wrap).css({'padding-top':''});
				decrypt();
			}
		}
	};
	function crypt() {
		$('menu li').each(function(){
			name = $(this).data('name');
			width[name] = $(this).width();
			$(this).html("&#8226;&#8226;&#8226;");   //('• • •');
			$(this).css({'width':width[name],'opacity':'.2'});
		});
		//floatElement.css({'background':'rgba(153,217,234)'});
	}
	function decrypt() {
		$('menu li').each(function(){
			name = $(this).data('name');
			$(this).html(name);
			$(this).css({'width':'','opacity':''});
		});
		//floatElement.css({'background':'rgb(153,217,234)'});
	}
	return mode;
};
tumb.slidy = function(el) {
	localStorage["scroll"] = $("header").offset().top;
	$(el).bind('mousewheel', function ( event ) {
	  if( event.originalEvent.detail > 0 || event.originalEvent.wheelDelta < 0 ) {
		//scroll down
		$('body').stop().animate({
			scrollTop: localStorage["scroll"]
		}, 500);
		event.preventDefault();
	  } else {
		//scroll up
		$('body').stop().animate({
			scrollTop: 0
		}, 500);
		event.preventDefault();
	  }
	});
};
tumb.clicky = function(el) {
	$(el).bind('click', function () {
	  if($(document).scrollTop() <= ($(window).height()/2)) {
		//is it the top of this page?
		$('body').stop().animate({
			scrollTop: localStorage["scroll"]
		}, 500);
		event.preventDefault();
	  } else {
		// oh no, it isn't.
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
tumb.onLoad = function(){
    $.extend($.fn.disableTextSelect  = function() {
        return this
            .attr('unselectable', 'on')
            .css('user-select', 'none')
            .on('selectstart', false);
    });
    $('.noselect').disableTextSelect();
    $('#style-switcher').change(function () {
        tumb.switchStyle(this.value);
    });
    tumb.dottie('header');
    tumb.slidy('.kek');
    var sb = $('#sidebar'),
        /*sb2 = $('#sidebar2'),*/
        ov = $('.overlay'),
        wr = $('.wrap'),
        width = $(window).width();
    if(width < 1024){
        wr.addClass('toggle');
        sb.removeClass('sidebar-stacked open').addClass('sidebar-fixed-left');
    }
    else {
        wr.removeClass('toggle');
        sb.addClass('sidebar-stacked open').removeClass('sidebar-fixed-left');
    }
    $('.kek').bind('click', function(){
        if(width < 1024){
            sb.toggleClass('open');
            return false;
        }
    });
    $('.overlay, .menu .list-item').bind('click', function(e){
        if (sb.hasClass('open') && width < 1024){sb.removeClass('open');}
        /*sb2.removeClass('open');*/
        ov.removeClass('toggled');
    });
    $('.wrap, .overlay').on({
        swiperight: function(e) {
            if(width < 1024){
                sb.addClass('open');
                ov.addClass('toggled');
            }
            return false;
        },
        swipeleft: function(e) {
            if(width < 1024){
                sb.removeClass('open');
                ov.removeClass('toggled');
            }
            return false;
        }
    });
    /*$('.player-menu').on({
        click: function(e) {
            sb2.toggleClass('open');
        }
    });*/
}