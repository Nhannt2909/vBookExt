const fs = require('fs');
const cheerio = require("cheerio");

// Mock vBook environment
global.Console = {
    log: console.log
};

global.Response = {
    success: (data) => {
        console.log("=== SUCCESS ===");
        console.log(data);
        return data;
    },
    error: (msg) => {
        console.log("=== ERROR ===");
        console.log(msg);
        return null;
    }
};

global.BASE_URL = "https://khotruyenchu.space";

const fetchNode = require('node-fetch');

// Mock fetch
global.fetch = async function (url, options) {
    console.log("Fetching: " + url);
    const headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    };
    if (options && options.headers) Object.assign(headers, options.headers);

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

                // Mock Jsoup select wrapper
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

// Load chap.js content
let chapCode = fs.readFileSync('./src/chap.js', 'utf8');
// remove the load('config.js')
chapCode = chapCode.replace("load('config.js');", "");
// make execute async and await fetch
chapCode = chapCode.replace("function execute(url) {", "async function execute(url) {");
chapCode = chapCode.replace(/let response = fetch\(url, \{[\s\S]*?\}\);/m, "let response = await fetch(url, {\n        headers: {\n            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'\n        }\n    });");

// Eval chap.js
eval(chapCode);

// Run the execute function
async function run() {
    console.log("Testing khotruyenchu chapter loading...");
    let result = await execute("https://khotruyenchu.space/chuong-1-dien-thi/");
    if (!result) {
        console.log("Returned null (Unable to load content)");
    }
}

run();
