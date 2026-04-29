var BASE_URL = "https://truyenplus.vn";

// chap.js — Nội dung chương
// Contract: execute(url) → htmlString (KHÔNG phải object!)
function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);

    var res = fetch(url);
    if (!res.ok) return Response.error("Cannot load: " + res.status);

    var doc = res.html();

    // Xóa quảng cáo và các phần thừa trước khi lấy nội dung
    doc.select("script, style, ins, iframe, .ads, .advertisement, .banner, .quangcao").remove();
    doc.select("[class*='ads'], [id*='ads'], .fb-comments, #fb-comments").remove();

    // Cập nhật selector chứa nội dung chương
    var contentEl = doc.select(".truyen").first();
    if (!contentEl) return Response.error("No content found");

    var content = contentEl.html() + "";

    // Làm sạch HTML entities thừa
    content = content.replace(/&nbsp;/g, " ");

    return Response.success(content);
}
