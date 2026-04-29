var BASE_URL = "https://truyenplus.vn";

// gen.js — Danh sách truyện từ 1 trang URL
function execute(url, page) {
    if (!page) page = "1";

    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);

    // Xử lý phân trang
    var pageUrl = url.replace("{{page}}", page);

    var res = fetch(pageUrl);
    if (!res.ok) return Response.error("Cannot load: " + res.status);

    var doc = res.html();
    var data = [];
    var seen = {};

    doc.select(".item").forEach(function (el) {

        var linkEl = el.select(".caption a").first();
        var imgEl = el.select("img").first();

        if (!linkEl) return;

        var link = (linkEl.attr("href") || "") + "";
        if (!link || seen[link]) return;
        seen[link] = true;

        if (!link.startsWith("http")) link = BASE_URL + link;

        var cover = imgEl ? ((imgEl.attr("data-src") || imgEl.attr("src") || "") + "") : "";
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

        data.push({
            name: linkEl.text().trim() + "",
            link: link,
            cover: cover,
            description: "",
            host: BASE_URL,
            tag: el.select(".Demo").text().trim() // Nếu site có tag, giữ nguyên, nếu không sẽ rỗng
        });
    });

    var hasNext = doc.select(".paging a:contains(›), .pagination .next").size() > 0;
    var nextPage = hasNext ? String(parseInt(page) + 1) : null;

    return Response.success(data, nextPage);
}
