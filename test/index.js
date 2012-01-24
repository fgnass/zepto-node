var fs = require('fs');
var domino = require('domino');
var Zepto = require('../');

function src(file) {
  return fs.readFileSync(__dirname + '/' + file, 'utf8');
}

var html = src('zepto.html');
var evidence = src('evidence.js');

var window = domino.createWindow(html);

var $ = Zepto(window);
var tests = $('script')[0].text;

window._run(evidence);
window._run(tests);
window.Evidence.AutoRunner.run();
