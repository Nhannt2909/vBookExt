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
        let genreElements = doc.select("a[href*='/the-loai/']");
        for (let i = 0; i < genreElements.size(); i++) {
            let el = genreElements.get(i);
            let title = el.text().trim();
            let href = el.attr("href");
            if (title && href && title.length < 30) {
                genres.push({
                    title: title,
                    input: href,
                    script: "gen.js"
                });
            }
        }
        return Response.success(genres);
    }
    return null;
}
