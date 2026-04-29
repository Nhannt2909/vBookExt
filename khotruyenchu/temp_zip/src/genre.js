load('config.js');

function execute() {
    let response = fetch(BASE_URL, {
        headers: {
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
    });
    if (response.ok) {
        let doc = response.html();
        let genres = [];
        doc.select("a[href*='/the-loai/']").forEach(function(el) {
            let title = el.text().trim();
            if (title && title.length < 30) {
                genres.push({
                    title: title,
                    input: el.attr("href"),
                    script: "gen.js"
                });
            }
        });
        return Response.success(genres);
    }
    return null;
}
