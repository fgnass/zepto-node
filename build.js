var fs = require('fs');

var files = ['zepto', 'detect', 'data', 'form', 'event'];
var src = '';

files.forEach(function(f) {
  src += fs.readFileSync('src/' + f + '.js', 'utf8');
});

fs.writeFileSync('lib/zepto.js', src);