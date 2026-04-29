const fs = require('fs');
try {
    const data = JSON.parse(fs.readFileSync('detail.json', 'utf8'));
    if (data.contents) {
        fs.writeFileSync('detail.html', data.contents);
        console.log('Successfully extracted detail.html.');
    } else {
        console.log('No contents found in JSON.', data);
    }
} catch (e) {
    console.error('Error parsing JSON:', e);
}
