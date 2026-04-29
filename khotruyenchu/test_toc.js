const cheerio = require('cheerio');
const fs = require('fs');
const fetchNode = require('node-fetch');

let tocCode = fs.readFileSync('src/toc.js', 'utf8').replace("load('config.js');", "");
tocCode = tocCode.replace(/let response = fetch\(url, \{[\s\S]*?\}\);/m, "let response = await fetch(url, {\n        headers: {\n            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'\n        }\n    });");
tocCode = tocCode.replace("function execute(url) {", "async function execute(url) {");

global.Console = { log: console.log };
global.Response = { success: (d)=>d, error: (e)=>console.log("Error:", e) };
global.BASE_URL = "https://khotruyenchu.space";

global.fetch = async function(url, options) {
    console.log("Fetching:", url);
    const headers = options && options.headers ? options.headers : {};
    try {
        const res = await fetchNode(url, { headers });
        const text = await res.text();
        return {
            ok: res.ok,
            status: res.status,
            text: text,
            url: res.url,
            html: () => {
                const $ = cheerio.load(text);
                const wrapElement = (el) => {
                    if (!el) return null;
                    const $el = $(el);
                    return {
                        text: () => $el.text() || "",
                        html: () => $el.html() || "",
                        attr: (name) => $el.attr(name) || "",
                        remove: () => $el.remove(),
                        tagName: () => (el.tagName || "").toLowerCase(),
                        select: (selector) => {
                            const nodes = $el.find(selector).toArray();
                            const arr = nodes.map(wrapElement);
                            return {
                                first: () => arr[0] || null,
                                isEmpty: () => arr.length === 0,
                                size: () => arr.length,
                                get: (i) => arr[i],
                                text: () => arr.map(a => a.text()).join(" "),
                                html: () => arr.map(a => a.html()).join(""),
                                remove: () => arr.forEach(a => a.remove())
                            };
                        }
                    };
                };
                return wrapElement($.root()[0]);
            }
        };
    } catch (e) {
        console.log("Fetch failed:", e);
        return { ok: false };
    }
};

eval(tocCode);

async function run() {
    let result = await execute("https://khotruyenchu.space/truyen/cau-tai-vo-dao-the-gioi-thanh-thanh/");
    console.log("Result items:", result ? result.length : "null");
}
run();
