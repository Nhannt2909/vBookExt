var BASE_URL = "https://truyenplus.vn";

// genre.js — Danh sách thể loại
function execute() {
    var res = fetch(BASE_URL + "/");
    if (!res.ok) return Response.error("Cannot load genres");

    var doc = res.html();
    var genres = [];
    var seen = {};

    doc.select(".menu-subs a[href*='/the-loai/']").forEach(function(el) {
        var title = el.text().trim() + "";
        var href = (el.attr("href") || "") + "";
        if (!title || !href || seen[href]) return;
        seen[href] = true;
        
        if (!href.startsWith("http")) href = BASE_URL + href;
        
        // Thêm ?page={{page}} để tương thích với gen.js
        href = href + "/?page={{page}}";

        genres.push({
            title: title,
            input: href,
            script: "gen.js"
        });
    });

    return Response.success(genres);
}