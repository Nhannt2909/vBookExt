const fs = require('fs');
try {
    const data = JSON.parse(fs.readFileSync('chap.json', 'utf8'));
    if (data.contents) {
        fs.writeFileSync('chap.html', data.contents);
        console.log('Successfully extracted HTML.');
    } else {
        console.log('No contents found in JSON.');
    }
} catch (e) {
    console.error('Error parsing JSON:', e);
}
