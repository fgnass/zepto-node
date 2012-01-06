# About

This is a fork of [Zepto.js](http://zeptojs.com/) that has been performance-optimized for server-side usage in a [jsdom](https://github.com/tmpvar/jsdom) environment.

# Rationale

The most straightforward approach to using Zepto.js with Node.js would be to wrap the whole library inside a huge closure and pass the current `window` object as parameter.

Unfortunately this leads to in pretty bad performance as a lot of processor time is spent with garbage collection. 

In order to improve the performance characteristics the code as been refactored so that all prototype methods accesses the associated `$` and `window`objects via `this.$` and `this.$.window`.

# License

This code is based on Zepto.js, Copyright (c) 2010, 2011 Thomas Fuchs

Zepto.js is is licensed under the terms of the MIT License, see the included MIT-LICENSE file.
