const fs = require('fs');
const html = fs.readFileSync('lib/the-illusion-of-skill.html', 'utf8');

const withoutBase64 = html.replace(/<img[^>]+src="data:[^"]+"[^>]*>/gi, '');
console.log('Text preview length:', withoutBase64.length);
console.log(withoutBase64);
fs.writeFileSync('lib/the-illusion-of-skill-clean.html', withoutBase64.trim(), 'utf8');

