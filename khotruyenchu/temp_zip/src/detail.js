load('config.js');

function execute(url) {
    let response = fetch(url, {
        headers: {
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
    });
    if (response.ok) {
        let doc = response.html();
        
        let nameEl = doc.select("h1, .entry-title").first();
        let name = nameEl ? nameEl.text().replace("Bộ truyện", "").trim() : "";
        let coverEl = doc.select(".truyen-cover img, .hs-thumb img, .entry-content img").first();
        let cover = coverEl ? (coverEl.attr("data-src") || coverEl.attr("src")) : "";
        let authorEl = doc.select("a[href*='tac-gia']").first();
        let author = authorEl ? authorEl.text().trim() : "";
        let descEl = doc.select(".truyen-desc, .entry-content").first();
        let description = descEl ? descEl.html() : "";
        let ongoing = doc.html().indexOf("Còn tiếp") >= 0 || doc.html().indexOf("Đang ra") >= 0;
        
        let genres = [];
        doc.select("a[href*='/the-loai/']").forEach(function(el) {
            let gTitle = el.text().trim();
            if (gTitle && gTitle.length < 30) {
                genres.push({
                    title: gTitle,
                    input: el.attr("href"),
                    script: "gen.js"
                });
            }
        });

        return Response.success({
            name: name,
            cover: cover,
            host: BASE_URL,
            author: author,
            description: description,
            ongoing: ongoing,
            genres: genres
        });
    }
    return null;
}
