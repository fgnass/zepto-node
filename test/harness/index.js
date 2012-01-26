var fs = require('fs');
var domino = require('domino');
var assert = require('./assert');
var Zepto = require('../../');

var html = fs.readFileSync(__dirname + '/zepto.html', 'utf8');

exports.assert = assert;

exports.createTests = function(setup) {
	var window = domino.createWindow(html);
	var $ = Zepto(window);
	var tests = setup(window);
	window.document.close();
	return tests;
}
