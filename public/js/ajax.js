$(function() {
    var NavigationCache = [],
        content = $("#wrapper"),
        wrap = $(".wrap"),
        selector = " #wrapper > *",
        body = $("body");
    if (history.pushState) {
        NavigationCache[window.location.pathname] = body.html();
        if (lord.getLocalObject('enableAjax', false))
            history.pushState({page: window.location.pathname, type: "page"}, document.title, window.location.pathname);
        window.onpopstate = function (e) {
            if (e.state && e.state.type.length > 0)
                if (NavigationCache[e.state.page] && NavigationCache[e.state.page].length > 0)
                    tumb.ajax(NavigationCache[e.state.page], true);
        }
    }
    body.on("click", "a.ajax", function (e) {
        if (lord.getLocalObject('enableAjax', false)) {
            e.preventDefault();
            var url = $(this).attr("href");
            tumb.ajax(url);
            return false;
        }
    });
    function getPage(url, noHistory) {
        if (content.length > 0 && !noHistory) {
            return new Promise(function (resolve, reject) {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', url);
                xhr.onload = function () {
                    if (xhr.status == 200) {
                        NavigationCache[url] = xhr.response;
                        history.pushState({page: url, type: "page"}, document.title, url);
                        resolve(xhr.response);
                    } else {
                        console.info(url + ": " + xhr.status);
                        $(".overlay").removeClass("toggled over");
                        reject(xhr.statusText);
                    }
                };
                xhr.onerror = function () {
                    console.info(url + ": " + xhr.status);
                    content.html("<h2 class='alignCenter'>"+lord.text("error"+xhr.status+"Text")+"</h2>");
                    reject(lord.text("error0Text"));
                };
                xhr.send();
                $('html,body').stop().animate({
                    scrollTop: 0
                }, 300);
                $(".overlay").addClass("toggled over");
            });
        }
        return Promise.resolve(url);
    }
    function htmlToSel(data) {
        content.html($(data).find(selector));
        $(".overlay").removeClass("toggled over");

        /* Fix for tumb scroll */
        if(!localStorage["scroll"] || localStorage["scrollPage"] != window.location)
            localStorage["scroll"] = 0;
        localStorage["scrollPage"] = window.location;

        /* Fixes for most ololord functions */
        lord.postProcessors = [];
        lord.pageProcessors = [];
        window.removeEventListener("hashchange", lord.hashChangeHandler, false);
        window.removeEventListener("scroll", lord.scrollHandler, true);
        if(lord.autoUpdateTimer) {
            lord.autoUpdateTimer.stop();
            lord.autoUpdateTimer = null;
        }
        delete lord.AutoUpdateTimer;
        $(window).off('scroll');

        return data;
    }
    function setPage(data) {
        var rt = $(data);
        document.title = rt.filter("title").text();
        if (rt.filter(".wrap")) {
            $.each(lord.queryOne(".wrap").dataset, function (key, val) {
                delete lord.queryOne(".wrap").dataset[key];
            });
            $.each(rt.filter(".wrap").data(), function (key, val) {
                lord.queryOne(".wrap").dataset[key] = val;
            });
        }
        $(".ajaxScripts").remove();
        rt.filter(".ajaxScripts").each(function () {
            lord.createScript(this.src, false, "extraScripts");
        });
        return data;
    }
    tumb = tumb || {};
    tumb.ajax = function(url, noHistory) {
        getPage(url,noHistory)
            .then(setPage)
            .then(htmlToSel)
            .catch(function (err) {
                lord.showPopup(err, {type: "critical"});
            });
    };
});
