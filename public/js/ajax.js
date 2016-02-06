var NavigationCache = [],
    content = $("#wrapper"),
    wrap = $(".wrap"),
    selector = " #wrapper > *",
    body = $("body");
$(function(){
    if (history.pushState)  {
        NavigationCache[window.location.pathname] = body.html();
        if (lord.getLocalObject('enableAjax', false))
            history.pushState({page: window.location.pathname, type: "page"}, document.title, window.location.pathname);
        window.onpopstate = function (e) {
            if (e.state.type.length > 0)
                if (NavigationCache[e.state.page] && NavigationCache[e.state.page].length > 0)
                    getPage(NavigationCache[e.state.page], true)
                        .then(htmlToSel)
                        .then(setPage)
                        .catch(function (err) {
                            lord.showPopup(err, {type: "critical"});
                        });
        }
    }
    body.on("click", "a.ajax", function(e) {
        if (lord.getLocalObject('enableAjax', false)) {
            e.preventDefault();
            var url = $(this).attr("href");
            getPage(url, false)
                .then(htmlToSel)
                .then(setPage)
                .catch(function (err) {
                    lord.showPopup(err, {type: "critical"});
                });
            return false;
        }
    });
});
function getPage(url, noHistory) {
    if (content.length > 0 && !noHistory) {
        return new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url);
            xhr.onload = function() {
                if (xhr.status == 200) {
                    NavigationCache[url] = xhr.response;
                    history.pushState({page: url, type: "page"}, document.title, url);
                    resolve(xhr.response);
                } else {
                    console.info(url+": "+xhr.status);
                    reject(xhr.statusText);
                }
            };
            xhr.onerror = function() {
                console.info(url+": "+xhr.status);
                content.fadeOut().html();
                reject(lord.text("error0Text"));
            };
            xhr.send();
        });
    }
    return Promise.resolve(url);
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
    $(".extraScripts").remove();
    rt.filter(".extraScripts").each(function(){
        lord.createScript(this.src,false,"extraScripts");
    });
    return data;
}
function htmlToSel(data) {
    content.html($(data).find(selector));
    //$("abbr.timeago").timeago(); TODO: добавить timeago
    return data;
}
