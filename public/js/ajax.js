$(function() {
    var NavigationCache = [],
        content = $("#wrapper"),
        wrap = $(".wrap"),
        selector = " #wrapper > *",
        body = $("body");
    lord.setSessionObject("ajaxFires", 0);
    if (history.pushState) {
        NavigationCache[location.pathname] = body.html();
        if (lord.getLocalObject('enableAjax', false))
            history.pushState({page: location.pathname+location.search+location.hash, type: "page"}, document.title, location.pathname+location.search+location.hash);
        window.onpopstate = function (e) {
            if (location.hash == "" && e.state != null && e.state.type == "page")
                if (NavigationCache[e.state.page] && NavigationCache[e.state.page].length > 0) {
                    tumb.ajax(NavigationCache[e.state.page], true);
                    console.log('ajax!');
                }
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
                function onError() {
                    content.html("<h2 class='alignCenter'>"+lord.text("error"+xhr.status+"Text")+"</h2>");
                    $(".overlay").removeClass("toggled over");
                    reject(lord.text("error"+xhr.status+"Text"));
                }
                var xhr = new XMLHttpRequest();
                xhr.open('GET', url);
                xhr.onload = function () {
                    if (xhr.status == 200) {
                        NavigationCache[url] = xhr.response;
                        history.pushState({page: url, type: "page"}, document.title, url);
                        lord.setSessionObject("ajaxFires", 1+lord.getSessionObject("ajaxFires", 0));
                        resolve(xhr.response);
                    } else
                        onError();
                };
                xhr.onerror = onError;
                xhr.send();
                $(".overlay").addClass("toggled over");
            });
        }
        return Promise.reject("Не задана обёртка!");
    }
    function htmlToSel(data) {
        content.html($(data).find(selector));
        $(".overlay").removeClass("toggled over");

        /* Fixes for most ololord functions */
        lord.postProcessors = [];
        lord.pageProcessors = [];
        lord.series(tumb.ajaxProcessors, function(f) {
            return f();
        }).catch(lord.handleError);
        lord.initializeOnLoadBase();
        lord.checkFavoriteThreads();
        window.removeEventListener("scroll", lord.scrollHandler, true);
        if(lord.autoUpdateTimer) {
            lord.autoUpdateTimer.stop();
            lord.autoUpdateTimer = null;
        }
        delete lord.AutoUpdateTimer;
        $(window).off('scroll');

        /* Fix for tumb scroll */
        if(!localStorage["scroll"] || localStorage["scrollPage"] != location.pathname+location.search+location.hash)
            localStorage["scroll"] = 0;
        localStorage["scrollPage"] = location.pathname+location.search+location.hash;
        if(location.hash == "")
            $('html,body').stop().animate({
                scrollTop: 0
            }, 300);
        else {/* NOTE: Temporary fix! */
            function setHash(hash) {
                window.removeEventListener("load", setHash, true);
                location.hash = '';
                location.hash = hash;
            }
            var hash = location.hash;
            window.addEventListener("load", setHash(hash), true);
        }
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
            lord.createScript(this.src, false, "ajaxScripts");
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
