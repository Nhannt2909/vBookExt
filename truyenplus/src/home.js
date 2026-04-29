var BASE_URL = "https://truyenplus.vn";

// home.js — Danh sách tab trang chủ
function execute() {
    return Response.success([
        { title: "Mới cập nhật", input: BASE_URL + "/?page={{page}}",    script: "gen.js" },
        { title: "Hot",          input: BASE_URL + "/danh-sach/truyen-hot/?page={{page}}",    script: "gen.js" },
        { title: "Hoàn thành",   input: BASE_URL + "/danh-sach/truyen-full/?page={{page}}",  script: "gen.js" },
    ]);
}
