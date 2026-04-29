load('config.js');

function execute(url) {
    let response = fetch(url, {
        headers: {
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
    });
    if (response.ok) {
        let doc = response.html();
        let list = [url];
        
        let pagination = doc.select("a.page-numbers");
        if (pagination.size() > 0) {
            let lastPage = 1;
            for (let i = 0; i < pagination.size(); i++) {
                let el = pagination.get(i);
                let p = parseInt(el.text());
                if (!isNaN(p) && p > lastPage) lastPage = p;
            }
            
            let baseUrl = url;
            if (baseUrl.endsWith('/')) baseUrl = baseUrl.slice(0, -1);
            
            for (let p = 2; p <= lastPage; p++) {
                list.push(baseUrl + "/page/" + p + "/");
            }
        }
        return Response.success(list);
    }
    return null;
}
