const https = require('https');
const fs = require('fs');

const url = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://truyenplus.vn/nho-dao-toi-thuong-ta-o-di-gioi-boi-duong-tho/chuong-1-bpYcdUNffTyY');

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        fs.writeFileSync('chap.html', data);
        console.log('Saved chap.html');
    });
}).on('error', (e) => {
    console.error(e);
});
