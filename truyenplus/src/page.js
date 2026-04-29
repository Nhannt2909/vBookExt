var BASE_URL = "https://truyenplus.vn";

// page.js — Nhận URL detail, trả về mảng URL trang mục lục cho toc.js
function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    if (url.slice(-1) === "/") url = url.slice(0, -1);

    var res = fetch(url);
    if (!res.ok) return Response.error("Cannot load: " + res.status);

    var doc = res.html();
    var pages = [url]; // Trang đầu tiên sẽ parse trực tiếp từ trang detail

    // Lấy ID truyện để gọi API phân trang
    var bid = doc.select("input[name=bid]").attr("value");
    if (bid) {
        var lastPage = 1;
        doc.select(".paging a").forEach(function(el) {
            var onclick = el.attr("onclick") || "";
            var match = onclick.match(/page\(\d+,\s*(\d+)\)/);
            if (match) {
                var p = parseInt(match[1]);
                if (p > lastPage) lastPage = p;
            }
        });

        for (var i = 2; i <= lastPage; i++) {
            pages.push(BASE_URL + "/get/listchap/" + bid + "?page=" + i);
        }
    }

    return Response.success(pages);
}
