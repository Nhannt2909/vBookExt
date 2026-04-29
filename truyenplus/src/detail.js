var BASE_URL = "https://truyenplus.vn";

// detail.js — Thông tin chi tiết một truyện
function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);

    var res = fetch(url);
    if (!res.ok) return Response.error("Cannot load: " + res.status);

    var doc = res.html();

    var nameEl = doc.select("h1[itemprop=name]").first();
    var name = (nameEl ? nameEl.text() : "") + "";

    var coverEl = doc.select(".book-info-pic img[itemprop=image]").first();
    var cover = "";
    if (coverEl) {
        cover = (coverEl.attr("data-src") || coverEl.attr("src") || "") + "";
        if (cover.startsWith("//")) cover = "https:" + cover;
        if (cover && !cover.startsWith("http")) cover = BASE_URL + cover;
        try {
            var urlObj = new URL(cover);
            urlObj.pathname = urlObj.pathname
                .split("/")
                .map(p => encodeURIComponent(p))
                .join("/");
            cover = urlObj.toString();
        } catch (e) {
            cover = encodeURI(cover);
        }
    }

    var authorEl = doc.select("a[itemprop=author]").first();
    var author = (authorEl ? authorEl.text() : "") + "";

    var statusEl = doc.select(".label-status").first();
    var status = (statusEl ? statusEl.text() : "") + "";
    var ongoing = status.indexOf("Hoàn") === -1
        && status.indexOf("Completed") === -1
        && status.indexOf("Full") === -1
        && status.indexOf("完结") === -1;

    var descEl = doc.select("div[itemprop=description]").first();
    var description = (descEl ? descEl.html() : "") + "";

    var genres = [];
    doc.select(".li--genres a").forEach(function (el) {
        var gTitle = el.text() + "";
        var gHref = (el.attr("href") || "") + "";
        if (!gTitle || !gHref) return;
        if (!gHref.startsWith("http")) gHref = BASE_URL + gHref;
        genres.push({ title: gTitle, input: gHref, script: "gen.js" });
    });

    var suggests = [];
    suggests.push({ title: "Liên quan: ", input: author, script: "search.js" });

    return Response.success({
        name: name,
        cover: cover,
        host: BASE_URL,
        author: author,
        description: description,
        ongoing: ongoing,
        format: "series",
        genres: genres.length > 0 ? genres : undefined,
        suggests: suggests.length > 0 ? suggests : undefined
    });
}
