var BASE_URL = "https://truyenplus.vn";

// config.js — Base URL của site
// Dùng let (KHÔNG const) để VBook có thể inject CONFIG_URL khi cần
let BASE_URL = "https://truyenplus.vn";
try { if (CONFIG_URL) BASE_URL = CONFIG_URL; } catch (e) {}
