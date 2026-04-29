const cheerio = require('cheerio');
const fs = require('fs');

let htmlCode = fs.readFileSync('src/chap.js', 'utf8').replace("load('config.js');", "");

htmlCode += `
function test() {
    let docHTML = '<div id="model-response-message-contentr_0e8d67f0eda889db" class="markdown markdown-main-panel stronger enable-updated-hr-color" dir="ltr" aria-live="polite" aria-busy="false"><p data-path-to-node="1">&#8220;Đến chưa?&#8221;</p><p data-path-to-node="2">&#8220;Đừng căng thẳng, thành tích của con tốt như vậy, nhất định có thể vượt qua.&#8221;</p></div>';
    
    const $ = cheerio.load(docHTML);
    const wrap = (el) => {
        if(!el) return null;
        const $el = $(el);
        return {
            text: ()=>$el.text(),
            html: ()=>$el.html(),
            attr: (n)=>$el.attr(n)||'',
            remove: ()=>$el.remove(),
            tagName: ()=>(el.tagName||'').toLowerCase(),
            select: (sel)=>{
                const nodes = $el.find(sel).toArray();
                const arr = nodes.map(wrap);
                return {
                    first: ()=>arr[0]||null,
                    isEmpty: ()=>arr.length===0,
                    size: ()=>arr.length,
                    get: (i)=>arr[i],
                    text: ()=>arr.map(a=>a.text()).join(' '),
                    html: ()=>arr.map(a=>a.html()).join(''),
                    remove: ()=>arr.forEach(a=>a.remove())
                };
            }
        };
    };
    
    let doc = wrap($.root()[0]);
    global.Console = { log: console.log };
    global.Response = { success: (d)=>d };
    
    let contentEl = doc.select('div.entry-content').first() || doc.select('.story-detail-content').first() || doc.select('article').first() || doc.select('.markdown-main-panel').first() || doc.select('[id^=model-response-message-content]').first();
    
    if(contentEl) {
        console.log('Found:', contentEl.html());
        let html = contentEl.html();
        console.log('Cleaned:', cleanContent(html));
    } else {
        console.log('Not found');
    }
}
test();
`;

eval(htmlCode);
