var fs = require('fs');
var jsdom = require('jsdom');
var Zepto = require('../');

function src(file) {
  return fs.readFileSync(__dirname + '/' + file, 'utf8');
}

jsdom.env({
  html: src('zepto.html'), 
  src: [
    src('evidence.js')
  ],
  features: {
    QuerySelector: true
  },
  done: function(errors, window) {
    var $ = Zepto(window);
    window.console = console;
    var tests = $('script')[0].text;
    window.run(tests);
    window.Evidence.AutoRunner.run();
  }
});
