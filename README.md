# About

This is a fork of [Zepto.js](http://zeptojs.com/) that has been performance-optimized for server-side usage with [jsdom](https://github.com/tmpvar/jsdom) or [domino](https://github.com/fgnass/domino).

# Rationale

The most straightforward approach to using Zepto.js with Node.js would be to wrap the whole library inside a huge closure and pass the current `window` object as parameter.

Unfortunately this leads to in pretty bad performance as a lot of processor time is spent with garbage collection.

In order to improve the performance characteristics the code as been refactored so that all prototype methods accesses the associated `$` and `window`objects via `this.$` and `this.$.window`.

# Usage

```javascript
var domino = require('domino');
var Zepto = require('zepto-node');

var window = domino.createWindow();

var $ = Zepto(window);
$('body').append('<h1>Hello World</h1>');
```

# Tests

The original Evidence tests have been ported to Mocha and can be run via `npm test`.

[![Build Status](https://secure.travis-ci.org/fgnass/zepto-node.png)](http://travis-ci.org/fgnass/zepto-node)

# License

This code is based on Zepto.js, Copyright (c) 2010, 2011 Thomas Fuchs

Zepto.js is is licensed under the terms of the MIT License, see the included MIT-LICENSE file.
