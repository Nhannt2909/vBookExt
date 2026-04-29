var BASE_URL = "https://truyenplus.vn";

// toc.js — Mục lục chương
function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    if (url.slice(-1) === "/") url = url.slice(0, -1);

    var res = fetch(url);
    if (!res.ok) return Response.error("Cannot load: " + res.status);

    var doc;
    if (url.indexOf("/get/listchap/") > -1) {
        var json = res.json();
        doc = Html.parse(json.data);
    } else {
        doc = res.html();
    }

    var chapters = [];
    var seen = {};

    doc.select("#chapter-list a, ul li a").forEach(function(el) {
        var name     = el.text().trim() + "";
        var chapUrl  = (el.attr("href") || "") + "";

        if (!name || !chapUrl) return;
        if (seen[chapUrl]) return;
        seen[chapUrl] = true;

        if (!chapUrl.startsWith("http")) {
            chapUrl = chapUrl.startsWith("/") ? BASE_URL + chapUrl : BASE_URL + "/" + chapUrl;
        }

        var isPaid = el.select(".vip, .paid, .lock, .khoa").size() > 0;

        chapters.push({
            name: name,
            url:  chapUrl,
            host: BASE_URL,
            pay:  isPaid || undefined
        });
    });

    if (chapters.length === 0) return Response.error("No chapters found");
    return Response.success(chapters);
}
