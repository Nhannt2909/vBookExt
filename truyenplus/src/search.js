var BASE_URL = "https://truyenplus.vn";

// search.js — Tìm kiếm truyện
function execute(key, page) {
    if (!page) page = "1";

    var res = fetch(BASE_URL + "/tim-kiem", {
        queries: { s: key, page: page }
    });
    if (!res.ok) return Response.error("Search failed: " + res.status);

    var doc = res.html();
    var data = [];
    var seen = {};

    doc.select(".item").forEach(function (el) {
        var linkEl = el.select("h3 a").first();
        var imgEl = el.select("img").first();
        if (!linkEl) return;

        var link = (linkEl.attr("href") || "") + "";
        if (!link || seen[link]) return;
        seen[link] = true;

        if (!link.startsWith("http")) link = BASE_URL + link;
        var cover = imgEl ? ((imgEl.attr("data-src") || imgEl.attr("src") || "") + "") : "";
        if (cover.startsWith("//")) cover = "https:" + cover;

        var author = el.select("p.line:contains(Tác giả) a").text().trim() || el.select("p.line:contains(Tác giả)").text().replace("Tác giả :", "").trim();

        data.push({
            name: linkEl.text().trim() + "",
            link: link,
            cover: cover,
            description: author,
            host: BASE_URL
        });
    });

    var hasNext = doc.select(".paging a:contains(›), .pagination .next").size() > 0;
    return Response.success(data, hasNext ? String(parseInt(page) + 1) : null);
}
