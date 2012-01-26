var harness = require('./harness');
var assert = harness.assert;

module.exports = harness.createTests(function(window) {

  var document = window.document;
  var $ = window.$;
  var Zepto = $;
  var Node = window.Node;
  var Event = window.Event;
  var MouseEvent = window.MouseEvent;
  var getComputedStyle = window.getComputedStyle;

  function click(el){
    var event = document.createEvent('MouseEvents');
    event.initMouseEvent('click', true, true, document.defaultView, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
    el.dispatchEvent(event);
  }

  function mousedown(el){
    var event = document.createEvent('MouseEvents');
    event.initMouseEvent('mousedown', true, true, document.defaultView, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
    el.dispatchEvent(event);
  }

  function outerHTML(n) {
    var div = document.createElement('div');
    div.appendChild(n.cloneNode(true));
    var html = div.innerHTML;
    div = null;
    return html;
  }

  var globalVarSetFromReady = "";
  $(document).ready(function(){ globalVarSetFromReady = 'hi!' });

  var globalVarSetFromReady2 = "";
  $(function(){ globalVarSetFromReady2 = 'hi!' });

  var tests = {};

  tests.core = {

    // test to see if we augment iOS 3.2 with String#trim()
    testTrim: function(){
      assert.equal("blah", " blah ".trim());
    },

    testExtend: function(){
      assert.same({}, $.extend({}));
      assert.same(
        {a: "b", c: "d", e: "f"},
        $.extend({a: "1", e: "f"}, {a: "b", c: "d"})
      );
      var obj = {};
      assert.identical(obj, $.extend(obj, {a: 1}));
      assert.equal(1, obj.a);

      obj = {};
      assert.identical(obj, $.extend(obj, {a: 1}, {b: 2}))
      assert.equal(2, obj.b);
    },

    testDollar: function(){
      var expectedElement = document.getElementById('some_element');

      assert.length(1, $('#some_element'));
      assert.equal(expectedElement, $('#some_element').get(0));
      assert.equal(expectedElement, $(expectedElement).get(0));

      assert.length(4, $('p'));
      assert.length(1, $('p > span.yay'));
    },

    testDollarWithNil: function(){
      assert.length(0, $(null));
      assert.length(0, $(undefined));
      assert.length(0, $(false));
      assert.length(0, $(''));
    },

    testDollarWithNonDOM: function(){
      var zepto = $(['a', 'b', 'c']);
      assert.length(3, zepto);
      assert.equalCollection(['a', 'b', 'c'], zepto);
    },

    testSize: function(){
      assert.equal(4, $('#find1 .findme').size());
    },

    testDollarWithMultipleinstances: function(){
      var instance1 = $('#some_element'),
          instance2 = $('p');

      assert.length(1, instance1);
      assert.length(4, instance2);
      assert.refute.identical(instance1.get(0), instance2.get(0));
    },

    testDollarWithArrays: function(){
      var element = document.getElementById('some_element');

      var z1 = $([element]);
      assert.length(1, z1);
      assert.equal(element, z1.get(0));

      var z2 = $([element, null, undefined]);
      assert.length(1, z2);
      assert.equal(element, z2.get(0));

      var z3 = $([null, element, null]);
      assert.length(1, z3);
      assert.equal(element, z3.get(0));
    },

    testDollarWithContext: function(){
      // Zepto object
      var zepto = $('p#find1, #find2');
      assert.length(11, $('span', zepto));

      // DOM Element
      var domElement = document.getElementById('find1');
      assert.length(4, $('span.findme', domElement));
    },

    testDollarWithDocument: function(){
      var z = $(document);
      assert.length(1, z);
      assert.equal('', z.selector);
    },

    testDollarWithDocumentFragment: function(){
      var documentFragment = $(document.createDocumentFragment());
      assert.length(1, documentFragment);
      assert.equal(Node.DOCUMENT_FRAGMENT_NODE, documentFragment.get(0).nodeType);
    },

    testDollarWithFragment: function(){
      var fragment = $("<div>");
      assert.length(1, fragment);
      assert.equal("<div></div>", outerHTML(fragment.get(0)));
      assert.equal('', fragment.selector);

      fragment = $("<div>hello world</div>");
      assert.length(1, fragment);
      assert.equal("<div>hello world</div>", outerHTML(fragment.get(0)));
      assert.equal('', fragment.selector);

      fragment = $("<div>hello</div> <span>world</span>");
      assert.length(3, fragment);
      assert.equal("<div>hello</div>", outerHTML(fragment.get(0)));
      assert.equal(Node.TEXT_NODE, fragment.get(1).nodeType);
      assert.equal("<span>world</span>", outerHTML(fragment.get(2)));
      assert.equal('', fragment.selector);

      fragment = $("<div>\nhello</div> \n<span>world</span>");
      assert.length(3, fragment);
      assert.equal("<div>\nhello</div>", outerHTML(fragment.get(0)));
      assert.equal(Node.TEXT_NODE, fragment.get(1).nodeType);
      assert.equal("<span>world</span>", outerHTML(fragment.get(2)));
      assert.equal('', fragment.selector);

      fragment = $("<div>hello</div> ");
      assert.length(1, fragment);
    },

    testDollarWithTextNode: function(){
      var textNode = $(document.createTextNode('hi there'));
      assert.length(1, textNode);
      assert.equal(Node.TEXT_NODE, textNode.get(0).nodeType);
    },

    testNodeCreationViaDollar: function() {
      assert.equal('<div></div>', outerHTML($('<div></div>').get(0)));
      assert.equal('<div></div>', outerHTML($('<div/>').get(0)));
      assert.equal('<div><div></div></div>', outerHTML($('<div><div></div></div>').get(0)));
      assert.equal('<div><div></div></div>', outerHTML($('<div><div/></div>').get(0)));
      assert.equal('<div><div></div><div></div></div>', outerHTML($('<div><div></div><div></div></div>').get(0)));
    },

    testCreateTableCell: function() {
      assert.equal('TD', $('<td></td>').pluck('nodeName').join(','));
    },

    testCreateTableHeaderCell: function() {
      assert.equal('TH', $('<th></th>').pluck('nodeName').join(','));
    },

    testCreateTableRow: function() {
      assert.equal('TR', $('<tr></tr>').pluck('nodeName').join(','));
    },

    testCreateTableHeader: function() {
      assert.equal('THEAD', $('<thead></thead>').pluck('nodeName').join(','));
    },

    testCreateTableBody: function() {
      assert.equal('TBODY', $('<tbody></tbody>').pluck('nodeName').join(','));
    },

    testCreateTableFooter: function() {
      assert.equal('TFOOT', $('<tfoot></tfoot>').pluck('nodeName').join(','));
    },

    testReady: function(){
      assert.equal('hi!', globalVarSetFromReady);
      assert.equal('hi!', globalVarSetFromReady2);
    },

    testNext: function(){
      assert.equal('P', $('#some_element').next().get(0).tagName);
      assert.equal('DIV', $('p').next().get(0).tagName);
    },

    testPrev: function(){
      assert.equal('H1', $('p').prev().get(0).tagName);
      assert.equal('DIV', $('ul').prev().get(0).tagName);
    },

    testEach: function(){
      var index, tagnames = [];
      $('#eachtest > *').each(function(idx, el){
        index = idx;
        assert.identical(el, this);
        tagnames.push(el.tagName.toUpperCase());
      });
      assert.equal('SPAN, B, BR', tagnames.join(', '));
      assert.equal(2, index);
    },

    testMap: function(){
      var results = $('#eachtest > *').map(function(idx, el) {
        assert.identical(el, this);
        return idx + ':' + this.nodeName.toUpperCase();
      });
      assert.equal('0:SPAN, 1:B, 2:BR', results.join(', '));
    },

    testDollarMap: function(){
      var fruits = ['apples', 'oranges', 'pineapple', 'peach', ['grape', 'melon']];
      var results = $.map(fruits, function(item, i) {
        if (item instanceof Array) return item;
        else if (!/apple/.test(item)) return i + ':' + item;
      })
      assert.equal('1:oranges,3:peach,grape,melon', results.join(','));
    },

    testDollarMapObject: function(){
      var fruit = { name: 'banana', taste: 'sweet' };
      var results = $.map(fruit, function(value, key) {
        return key + '=' + value;
      })
      assert.equal('name=banana,taste=sweet', results.sort().join(','));
    },

    testDollarEach: function(){
      var array = ['a','b','c'], object = { a: 1, b: 2, c: 3 }, result;

      result = [];
      $.each(array, function(idx, val){
        result.push(idx);
        result.push(val);
      });
      assert.equal('0a1b2c', result.join(''));

      result = [];
      $.each(object, function(key, val){
        result.push(key);
        result.push(val);
      });
      assert.equal('a1b2c3', result.join(''));

      result = [];
      $.each(array, function(idx, val){
        result.push(idx);
        result.push(val);
        return idx<1;
      });
      assert.equal('0a1b', result.join(''));

      assert.equal('abc', $.each(array, function(){}).join(''));
    },

    testDollarEachContext: function(){
      $.each(['a'], function(key, val) {
        assert.equal(this, val);
      });
      $.each({a:'b'}, function(key, val) {
        assert.equal(this, val);
      });
    },

    testDollarinArray: function() {
      assert.identical( 0,  $.inArray(1, [1,2,3]) );
      assert.identical( 1,  $.inArray(2, [1,2,3]) );
      assert.identical( -1, $.inArray(4, [1,2,3]) );
      assert.identical( 3,  $.inArray(1, [1,2,3,1], 1) );
    },

    testEq: function(){
      var $els = $('#eq_test div');
      assert.length(1, $els.eq(0));
      assert.length(1, $els.eq(-1));
      assert.equal($els.eq(-1)[0].className, 'eq2');
      assert.undefined($els.eq(-1).tagName);

      assert.length(0, $('nonexistent').eq(0));
    },

    testFirst: function(){
      var zepto = $('h1,p');
      assert.length(5, zepto);

      var zepto2 = zepto.first();
      assert.refute.identical(zepto, zepto2);
      assert.length(5, zepto);

      assert.length(1, zepto2);
      assert.equal('H1', zepto2.get(0).tagName);

      assert.length(0, $('nonexistent').first());
    },

    testFirstNonDOM: function(){
      assert.equal('a', $(['a', 'b', 'c']).first());
    },

    testLast: function(){
      var zepto = $('h1,p');
      assert.length(5, zepto);

      var zepto2 = zepto.last();
      assert.refute.identical(zepto, zepto2);
      assert.length(5, zepto);

      assert.length(1, zepto2);
      assert.equal('P', zepto2.get(0).tagName);

      assert.length(0, $('nonexistent').last());
    },

    testLastNonDOM: function(){
      assert.equal('c', $(['a', 'b', 'c']).last());
    },

    testPluck: function(){
      assert.equal('H1DIVDIV', $('h1,div.htmltest').pluck('tagName').join(''));
    },

    // for now, we brute-force "display:block" for show/hide
    // need to change that to work better with inline elements in the future
    /*
    // XXX Skip this test for now
    testShow: function(){
      $('#show_hide_div1').show();
      assert.equal('inline-block', getComputedStyle($('#show_hide_div1').get(0)).display);

      $('#show_hide_div2').show();
      assert.equal('block', getComputedStyle($('#show_hide_div2').get(0)).display);

      $('#show_hide_div3').show();
      assert.equal('block', getComputedStyle($('#show_hide_div3').get(0)).display);

      $('#show_hide_span1').show();
      assert.equal('block', getComputedStyle($('#show_hide_span1').get(0)).display);

      $('#show_hide_span2').show();
      assert.equal('block', getComputedStyle($('#show_hide_span2').get(0)).display);

      $('#show_hide_span3').show();
      assert.equal('inline', getComputedStyle($('#show_hide_span3').get(0)).display);
    },
    */
    testHide: function(){
      $('#show_hide_div1').hide();
      assert.equal('none', $('#show_hide_div1').get(0).style.display);

      $('#show_hide_div2').hide();
      assert.equal('none', $('#show_hide_div2').get(0).style.display);

      $('#show_hide_div3').hide();
      assert.equal('none', $('#show_hide_div3').get(0).style.display);

      $('#show_hide_span1').hide();
      assert.equal('none', $('#show_hide_span1').get(0).style.display);

      $('#show_hide_span2').hide();
      assert.equal('none', $('#show_hide_span2').get(0).style.display);

      $('#show_hide_span3').hide();
      assert.equal('none', $('#show_hide_span3').get(0).style.display);
    },

    testToggle: function(){
      $('#show_hide_div1').hide();
      assert.equal('none', $('#show_hide_div1').get(0).style.display);

      $('#show_hide_div1').toggle();
      assert.equal('', $('#show_hide_div1').get(0).style.display);

      $('#show_hide_div1').toggle();
      assert.equal('none', $('#show_hide_div1').get(0).style.display);

      $('#show_hide_div1').toggle(true);
      assert.equal('', $('#show_hide_div1').get(0).style.display);

      $('#show_hide_div1').toggle(true);
      assert.equal('', $('#show_hide_div1').get(0).style.display);

      $('#show_hide_div1').toggle(false);
      assert.equal('none', $('#show_hide_div1').get(0).style.display);

      $('#show_hide_div1').toggle(false);
      assert.equal('none', $('#show_hide_div1').get(0).style.display);
    },

    testOffset: function(){
      // TODO
      assert.null($('#doesnotexist').offset());
    },

    /*
    // XXX Skip width and height tests
    testWidth: function(){
      assert.null($('#doesnotexist').width());
      // can't check values here, but make sure it doesn't error out
      var viewportWidth = $(window).width();
      assert.ok(viewportWidth > 0 || viewportWidth === 0);
      assert.ok($(document).width());

      assert.identical(100, $('#offset').width());
      $('#offset').width('90px');
      assert.identical(90, $('#offset').width());
      $('#offset').width(110);
      assert.identical(110, $('#offset').width());
      $('#offset').width(function(i, oldWidth) { return oldWidth + 5 });
      assert.identical(115, $('#offset').width());
    },

    testHeight: function(){
      assert.null($('#doesnotexist').height());
      // can't check values here, but make sure it doesn't error out
      var viewportHeight = $(window).height();
      assert.ok(viewportHeight > 0 || viewportHeight === 0);
      assert.ok($(document).height());

      assert.identical(50, $('#offset').height());
      $('#offset').height('60px');
      assert.identical(60, $('#offset').height());
      $('#offset').height(70);
      assert.identical(70, $('#offset').height());
      $('#offset').height(function(i, oldHeight) { return oldHeight + 5 });
      assert.identical(75, $('#offset').height());
    },
    */

    testClosest: function(){
      var el = $('#li2');
      assert.equalCollection(el, el.closest('li'));
      assert.equalCollection($('#nested'), el.closest('ul'));
      // with context
      assert.equalCollection($('#nested'), el.closest('ul', $('#li1').get(0)));
      assert.length(0, el.closest('#parents', $('#li1').get(0)));
      // no ancestor matched
      assert.length(0, el.closest('form'));
    },

    testParents: function(){
      var body = document.body, html = body.parentNode, container = $('#parents'),
        wrapper = $('#fixtures').get(0);
      assert.equalCollection($([wrapper, body, html]), container.parents());

      var expected = $('#li1 > ul').get();
      expected.push($('#li1').get(0));
      expected.push(container.get(0));
      expected = expected.concat([wrapper, body, html]);
      assert.equalCollection($(expected), $('#li1').find('li').parents());

      expected = [$('#nested').get(0), $('#parents').get(0)];
      assert.equalCollection($(expected), $('#li2').parents('ul'));
    },

    testParent: function(){
      var el = $('#li1');
      assert.equalCollection($('#parents'), el.parent());
      assert.equalCollection($('#li1 > ul'), el.find('li').parent());
      assert.length(0, $(document.createElement('div')).parent());
    },

    testChildren: function(){
      var el=$("#childrenTest"), lis=$("li.child", el);

      //basic form
      assert.equalCollection(lis, el.children());
      //filtered by selector
      assert.equalCollection(lis.filter(".two"), el.children(".two"));
      //across multiple parents
      assert.equalCollection(el.find("li a"), lis.children("a"));
      //chainabilty
      assert.equal(el.find("li a.childOfTwo").text(), lis.children(".childOfTwo").text());
      //non-existent children
      assert.length(0,lis.children(".childOfTwo").children());
    },

    testSiblings: function(){
      var el=$("#siblingsTest");

      //basic form
      assert.equalCollection($("li.one,li.three,li.four",el), $("li.two",el).siblings());
      //filtered by selector
      assert.equalCollection($("li.three",el), $("li.two",el).siblings(".three"));
      //across multiple parents
      assert.equalCollection(el.find("li b"), $("li em",el).siblings("b"));
      assert.length(6,$("li span",el).siblings());
      //non-existent siblings
      assert.length(0,$("li span.e",el).siblings());
    },

    testNot: function(){
      var el=$("#notTest");

      //selector form
      assert.equalCollection($("li.one,li.three,li.four",el), $("li",el).not(".two"));
      //element or NodeList form
      assert.equalCollection($("span.b,span.c,span.e",el), $("span",el).not(document.getElementById("notTestExclude")));
      assert.equalCollection($("li",el), $("li, span",el).not(document.getElementsByTagName("span")));
      //function form
      assert.equalCollection($("span.b,span.c",el),$("span",el).not(function(i){
        var $this=$(this);
        $this.html(i);
        return ($this.hasClass("d") || $this.hasClass("e")) ? true : false;
      }));
      //test the index was passed in properly in previous test
      assert.equal("0",$("span.b",el).text());
      assert.equal("1",$("span.c",el).text());
    },

    testReplaceWith: function() {
      $('div.first').replaceWith('<h2 id="replace_test">New heading</h2>');
      assert.undefined($('div.first').get(0));
      assert.ok(document.getElementById("replace_test").nodeType);
      assert.equal($('.replacewith h2#replace_test').get(0), document.getElementById("replace_test"));

      $('#replace_test').replaceWith($('.replace_test_div'));
      assert.undefined($('#replace_test').get(0));
      assert.ok(document.getElementsByClassName("replace_test_div")[0].nodeType);
      assert.equal($('.replacewith h2#replace_test').get(0), document.getElementsByClassName("replace_test")[0]);

      //Multiple elements
      $('.replacewith .replace_test_div').replaceWith('<div class="inner first">hi</div><div class="inner fourth">hello</div>');
      assert.length(4,$('.replacewith div'));
      assert.equal("inner first", $('.replacewith div')[0].className);
      assert.equal("inner fourth", $('.replacewith div')[1].className);
    },

    testReplaceWithFragment: function() {
      var orphanDiv = $("<div />");
      orphanDiv.replaceWith($("<div class='different' />"));
      assert.ok(!orphanDiv.hasClass('different'));
    },

    testWrap: function() {
      assert.ok(document.getElementById("wrap_test_div").nodeType);

      $('#wrap_test_div span').wrapAll('<div id="wrap_test" />');
      assert.ok(document.getElementById("wrap_test").nodeType);
      assert.equal($("#wrap_test").children().length, 2);

      $('#wrap_test_div span').wrap('<div class="wrap_test" />');
      assert.ok(document.getElementsByClassName("wrap_test")[0].nodeType);
      assert.equal($('#wrap_test_div span').length, $('.wrap_test').length);
    },

    testWrapFragment: function() {
      var fragment = $('<div id="fragment" />');
      fragment.wrapAll('<div id="wrap_test" />');
      assert.equal('wrap_test', fragment.parent().attr('id'));
      assert.equal(0, fragment.children().length);

      fragment = $('<div id="fragment" />');
      fragment.wrap('<div id="wrap_test" />');
      assert.equal('wrap_test', fragment.parent().attr('id'));
      assert.equal(0, fragment.children().length);
    },

    testUnwrap: function(){
      var context=$("#unwrap_test");

      //Element With no siblings
      $(".unwrap_one span",context).unwrap();
      assert.length(1,$("b",context));

      //Element with siblings
      $(".unwrap_two span",context).unwrap();
      assert.length(0,$("b",context));
      //make sure siblings are unaffected
      assert.length(3,$("span",context));
      //make sure parents are what they should be
      assert.equal($("span",context).parent().get(0), document.getElementsByClassName("unwrap_one")[0]);
    },

    testUnwrapFragment: function(){
      var fragment = $('<div id="outer"><div id="inner"></div></div>');
      var innerFragment = fragment.find("#inner");
      innerFragment.unwrap();
      assert.equal(0, fragment.children().length);
      assert.equal("", innerFragment.parent().attr("id"));

      fragment = $('<div id="outer"><div id="inner"></div><div id="uninvolved"></div></div>');
      innerFragment = fragment.find("#inner");
      var uninvolved = fragment.find("#uninvolved");
      innerFragment.unwrap();
      assert.equal(0, fragment.children().length);

      assert.equal("", innerFragment.parent().attr("id"));
      assert.equal("", uninvolved.parent().attr("id"));

      assert.equal("uninvolved", innerFragment.siblings().attr("id"));
      assert.equal("inner", uninvolved.siblings().attr("id"));
    },

    testFind: function(){
      var found = $('p#find1').find('span.findme');
      assert.length(4, found);
      assert.equal('1', found.get(0).innerHTML);
      assert.equal('2', found.get(1).innerHTML);
      assert.equal('4', found.get(2).innerHTML);
      assert.equal('5<span>6</span>', found.get(3).innerHTML);

      found = $('p#find1, #find2').find('span');
      assert.length(11, found);
    },

    testFilter: function(){
      var found = $('div');
      assert.length(2, found.filter('.filtertest'));
      assert.length(0, found.filter('.doesnotexist'));
      assert.length(1, found.filter('.filtertest').filter(':nth-child(2n)'));

      var withoutParent = $(document.createElement('div'));
      assert.ok(!withoutParent.is('div'));
    },

    testAdd: function(){
      var lis=$("li"),spans=$("span"),
      together=lis.add("span"),
      duplicates=spans.add("span"),
      disconnected=$("<div></div>").add("<span></span>"),
      mainContext=$("#addTest");

      //uniquness of collection
      assert.length(spans.length, duplicates);

      //selector only
      assert.length((lis.length + spans.length), together);

      //selector with context
      assert.equalCollection($("span",mainContext), $(".add_span").add(".add_span_exclude",mainContext));

      //DOM Element + Chaining test
      assert.equalCollection(mainContext.children(), $(".add_span").add(".add_span_exclude").add(document.getElementById("addTestDiv")));

      //Disconnected
      assert.ok(!disconnected.get(0).parentNode);

      $("#addTestDiv").append(disconnected);
      assert.equal('<div></div><span></span>', document.getElementById("addTestDiv").innerHTML);
    },

    testIs: function(){
      assert.ok($('#find1').is('p'));
      assert.ok($('#li2').is(':first-child'));
      assert.ok(!$('#find1').is('doesnotexist'));
      assert.ok(!$('#find1').is());

      assert.ok($('#fixtures div').is('#some_element'));
      assert.ok(!$('#doesnotexist').is('p'));

      assert.ok(!$(window).is('p'));
    },

    testCSS: function(){
      var el = $('#some_element').get(0);

      $('#some_element').css('color', '#f00');
      $('#some_element').css('margin-top', '10px');
      $('#some_element').css('marginBottom', '5px');
      $('#some_element').css('left', 42);
      $('#some_element').css('z-index', 10);
      $('#some_element').css('fontWeight', 300);
      $('#some_element').css('border', '1px solid rgba(255,0,0,1)');

      //XXX assert.equal('rgb(255, 0, 0)', el.style.color);
      //XXX:
      assert.equal('#f00', el.style.color);

      //XXX assert.equal('rgb(255, 0, 0)', el.style.borderLeftColor);
      //XXX assert.equal('1px', el.style.borderLeftWidth);

      assert.equal('10px', el.style.marginTop);
      assert.equal('5px', el.style.marginBottom);
      assert.equal('42px', el.style.left);
      assert.equal(300, el.style.fontWeight);

      //assert.equal(10, el.style.zindex);

      var style1 = $('#some_element').css('color');
      var style2 = $('#some_element').css('border');

      //XXX assert.equal('rgb(255, 0, 0)', style1);
      //XXX:
      assert.equal('#f00', style1);

      //XXX assert.equal('1px solid rgb(255, 0, 0)', style2);

      $('#some_element').css({
        'border': '2px solid #000',
        'color': 'rgb(0,255,0)',
        'padding-left': '2px'
      });

      //XXX assert.equal('2px', $('#some_element').css('borderLeftWidth'));
      //XXX assert.equal('solid', $('#some_element').css('borderLeftStyle'));
      //XXX assert.equal('rgb(0, 0, 0)', $('#some_element').css('borderLeftColor'));
      //assert.equal('rgb(0, 255, 0)', $('#some_element').css('color'));
      //XXX assert.equal('2px', $('#some_element').css('paddingLeft'));

      //XXX assert.equal('2px', $('#some_element').css('border-left-width'));
      //XXX assert.equal('solid', $('#some_element').css('border-left-style'));
      //XXX assert.equal('rgb(0, 0, 0)', $('#some_element').css('border-left-color'));
      //assert.equal('rgb(0, 255, 0)', $('#some_element').css('color'));
      assert.equal('2px', $('#some_element').css('padding-left'));

      /*
      //XXX
      var div = $('#get_style_element');
      assert.equal('48px', div.css('font-size'));
      assert.equal('rgb(0, 0, 0)', div.css('color'));
      */
    },

    testCSSOnNonExistElm: function() {
      var errorWasRaised = false;
      try {
        var color = $('.some-non-exist-elm').css('color');
      } catch (e) {
        errorWasRaised = true;
      }
      assert.ok(!errorWasRaised);
    },

    testHtml: function(){
      var div = $('div.htmltest');
      div.html('yowza');

      assert.equal('yowza', document.getElementById('htmltest1').innerHTML);
      assert.equal('yowza', document.getElementById('htmltest2').innerHTML);

      assert.equal('yowza', $('div.htmltest').html());

      div.html('');
      assert.equal('', document.getElementById('htmltest2').innerHTML);

      assert.equal("", $('#htmltest3').html());

      assert.null($('doesnotexist').html());

      div.html('yowza');
      div.html(function(idx, html){
        return html.toUpperCase();
      });
      assert.equal('YOWZA', div.html());

      div.html('<u>a</u><u>b</u><u>c</u>');

      $('u').html(function(idx,html){
        return idx+html;
      });
      assert.equal('<u>0a</u><u>1b</u><u>2c</u>', div.html());

      var table = $('#htmltest4'),
        html = '<tbody><tr><td>ok</td></tr></tbody>';
      table.html('<tbody><tr><td>ok</td></tr></tbody>');
      assert.equal(html, table.html());
    },

    testText: function(){
      assert.equal('Here is some text', $('div.texttest').text());
      assert.equal('And some more', $('#texttest2').text());

      $('div.texttest').text("Let's set it");
      assert.equal("Let's set it", $('#texttest1').text());
      assert.equal("Let's set it", $('#texttest2').text());

      $('#texttest2').text('');
      assert.equal("Let's set it", $('div.texttest').text());
      assert.equal('', $('#texttest2').text());
    },

    testEmpty: function() {
      $('#empty_test').empty();

      assert.equal(document.getElementById('empty_1'), null);
      assert.equal(document.getElementById('empty_2'), null);
      assert.equal(document.getElementById('empty_3'), null);
      assert.equal(document.getElementById('empty_4'), null);
    },

    testAttr: function(){
      var els = $('#attr_1, #attr_2');

      assert.equal('someId1', els.attr("data-id"));
      assert.equal('someName1', els.attr("data-name"));

      els.attr("data-id","someOtherId");
      els.attr("data-name","someOtherName");

      assert.equal('someOtherId', els.attr("data-id"));
      assert.equal('someOtherName', els.attr("data-name"));
      assert.equal('someOtherId', $('#attr_2').attr('data-id'));

      assert.null(els.attr("nonExistentAttribute"));

      els.attr("data-id", false);
      assert.equal("false", els.attr("data-id"));

      els.attr("data-id", 0);
      assert.equal("0", els.attr("data-id"));

      assert.undefined($('doesnotexist').attr('yo'));

      els.attr({ 'data-id': 'id', 'data-name': 'name' });
      assert.equal('id', els.attr("data-id"));
      assert.equal('name', els.attr("data-name"));
      assert.equal('id', $('#attr_2').attr('data-id'));

      els.attr('data-id', function(idx,oldvalue){
        return idx+oldvalue;
      });
      assert.equal('0id', els.attr('data-id'));
      assert.equal('1id', $('#attr_2').attr('data-id'));
    },

    testAttrEmpty: function(){
      var el = $('#data_attr')
      assert.identical('', el.attr('data-empty'));
    },

    testAttrOnTextinputField: function() {
      var inputs = $('#attr_with_text_input input'), values;

      values = inputs.map(function(){ return $(this).attr('value') });
      assert.equal('Default input, Text input, Email input, Search input', values.join(', '));

      inputs.val(function(i, value){ return value.replace('input', 'changed') });

      values = inputs.map(function(){ return $(this).attr('value') });
      assert.equal('Default changed, Text changed, Email changed, Search changed', values.join(', '));
    },

    testRemoveAttr: function() {
      var el = $('#attr_remove');
      assert.equal('boom', el.attr('data-name'));
      el.removeAttr('data-name');
      assert.null(el.attr('data-name'));
    },

    testData: function() {
      var els = $('#data_attr');

      els.data('fun', 'hello');
      //XXX data.js is loaded, so skip this test:
      //assert.equal('hello', els.attr('data-fun'));

      assert.equal('hello', els.data('fun'));
      assert.equal('whatever', els.data('blah'));
    },

    testVal: function() {
      var input = $('#attr_val');

      assert.equal('Hello World', input.val());

      input.val('');
      assert.equal('', input.val());

      input.get(0).value = 'Hello again';
      assert.equal('Hello again', input.val());

      input.val(function(i, val){ return val.replace('Hello', 'Bye') });
      assert.equal('Bye again', input.val());
    },

    testChaining: function(){
      assert.ok(document.getElementById('nay').innerHTML == "nay");
      $('span.nay').css('color', 'red').html('test');
      assert.ok(document.getElementById('nay').innerHTML == "test");
    },

    testCachingForLater: function(){
      var one = $('div');
      var two = $('span');

      assert.ok(one.get(0) !== two.get(0));
    },

    testPlugins: function(){
      var el = $('#some_element').get(0);

      $.fn.plugin = function(){
        return this.each(function(){ this.innerHTML = 'plugin!' });
      };
      $('#some_element').plugin();
      assert.equal('plugin!', el.innerHTML);

      // test if existing Zepto objects receive new plugins
      $.fn.anotherplugin = function(){
        return this.each(function(){ this.innerHTML = 'anotherplugin!' });
      }
      assert.ok(typeof $('#some_element').anotherplugin == 'function');
      $('#some_element').anotherplugin();
      assert.equal('anotherplugin!', el.innerHTML);
    },

    testAppendPrependBeforeAfter: function(){
      $('#beforeafter').append('append');
      $('#beforeafter').prepend('prepend');
      $('#beforeafter').before('before');
      $('#beforeafter').after('after');

      assert.equal('before<div id="beforeafter">prependappend</div>after', $('#beforeafter_container').html());

      //testing with TextNode as parameter
      $('#beforeafter_container').html('<div id="beforeafter"></div>');

      function text(contents){
        return document.createTextNode(contents);
      }

      $('#beforeafter').append(text('append'));
      $('#beforeafter').prepend(text('prepend'));
      $('#beforeafter').before(text('before'));
      $('#beforeafter').after(text('after'));

      assert.equal('before<div id="beforeafter">prependappend</div>after', $('#beforeafter_container').html());

      $('#beforeafter_container').html('<div id="beforeafter"></div>');

      function div(contents){
        var el = document.createElement('div');
        el.innerHTML = contents;
        return el;
      }

      $('#beforeafter').append(div('append'));
      $('#beforeafter').prepend(div('prepend'));
      $('#beforeafter').before(div('before'));
      $('#beforeafter').after(div('after'));

      assert.equal(
        '<div>before</div><div id="beforeafter"><div>prepend</div>'+
        '<div>append</div></div><div>after</div>',
        $('#beforeafter_container').html()
      );

      //testing with Zepto object as parameter
      $('#beforeafter_container').html('<div id="beforeafter"></div>');

      $('#beforeafter').append($(div('append')));
      $('#beforeafter').prepend($(div('prepend')));
      $('#beforeafter').before($(div('before')));
      $('#beforeafter').after($(div('after')));

      assert.equal(
        '<div>before</div><div id="beforeafter"><div>prepend</div>'+
        '<div>append</div></div><div>after</div>',
        $('#beforeafter_container').html()
      );

      //testing with a zepto object of more than one element as parameter
      $(document.body).append('<div class="append">append1</div><div class="append">append2</div>');
      $(document.body).append('<div class="prepend">prepend1</div><div class="prepend">prepend2</div>');
      $(document.body).append('<div class="before">before1</div><div class="before">before2</div>');
      $(document.body).append('<div class="after">after1</div><div class="after">after2</div>');

      $('#beforeafter_container').html('<div id="beforeafter"></div>');

      $('#beforeafter').append($('.append'));
      $('#beforeafter').prepend($('.prepend'));
      $('#beforeafter').before($('.before'));
      $('#beforeafter').after($('.after'));

      assert.equal(
        '<div class="before">before1</div><div class="before">before2</div><div id="beforeafter"><div class="prepend">prepend1</div><div class="prepend">prepend2</div>'+
        '<div class="append">append1</div><div class="append">append2</div></div><div class="after">after1</div><div class="after">after2</div>',
        $('#beforeafter_container').html()
      );

      //

      var helloWorlds = [], appendContainer1 = $('<div> <div>Hello</div> <div>Hello</div> </div>'),
          helloDivs = appendContainer1.find('div');

      helloDivs.append(' world!');
      helloDivs.each(function() { helloWorlds.push($(this).text()) })
      assert.equal('Hello world!,Hello world!', helloWorlds.join(','));

      //

      var spans = [], appendContainer2 = $('<div> <div></div> <div></div> </div>'),
          appendDivs = appendContainer2.find('div');

      appendDivs.append($('<span>Test</span>'));
      appendDivs.each(function() { spans.push($(this).html()) })
      assert.equal('<span>Test</span>,<span>Test</span>', spans.join(','));
    },

    testBeforeAfterFragment: function(){
      var fragment = $('<div class=fragment />');
      fragment.before('before').after('after');
      assert.length(1, fragment);
      assert.ok(fragment.hasClass('fragment'));
    },

    testAppendToPrependTo: function(){
      //testing with Zepto object
      function div(contents){
        var el = document.createElement('div');
        el.innerHTML = contents;
        return el;
      }

      var ap = $(div('appendto'));
      var pr = $(div('prependto'));

      var ap2 = ap.appendTo($('#appendtoprependto'));
      var pr2 = pr.prependTo($('#appendtoprependto'));

      // Test the object returned is correct for method chaining
      assert.same(ap, ap2);
      assert.same(pr, pr2);

      assert.equal(
        '<div id="appendtoprependto"><div>prependto</div>'+
        '<div>appendto</div></div>',
        $('#appendtoprependto_container').html()
      );

      //testing with a zepto object of more than one element as parameter
      $(document.body).append('<div class="appendto">appendto1</div><div class="appendto">appendto2</div>');
      $(document.body).append('<div class="prependto">prependto1</div><div class="prependto">prependto2</div>');

      $('#appendtoprependto_container').html('<div id="appendtoprependto"></div>');

      $('.appendto').appendTo($('#appendtoprependto'));
      $('.prependto').prependTo($('#appendtoprependto'));

      assert.equal(
        '<div id="appendtoprependto"><div class="prependto">prependto1</div><div class="prependto">prependto2</div><div class="appendto">appendto1</div><div class="appendto">appendto2</div></div>',
        $('#appendtoprependto_container').html()
      );

      //testing with a selector as parameter
      $('#appendtoprependto_container').html('<div id="appendtoprependto"></div>');
      ap.appendTo('#appendtoprependto');
      pr.prependTo('#appendtoprependto');
      assert.equal(
        '<div id="appendtoprependto"><div>prependto</div>'+
        '<div>appendto</div></div>',
        $('#appendtoprependto_container').html()
      );
    },

    testinsertBeforeinsertAfter: function(){
      //testing with Zepto object
      function div(contents){
        var el = document.createElement('div');
        el.innerHTML = contents;
        return el;
      }

      var ib = $(div('insertbefore'));
      var ia = $(div('insertafter'));

      var ibia = $('#insertbeforeinsertafter');
      var ib2 = ib.insertBefore(ibia);
      var ia2 = ia.insertAfter(ibia);

      // Test the object returned is correct for method chaining
      assert.equal(
        '<div>insertbefore</div><div id="insertbeforeinsertafter">'+
        '</div><div>insertafter</div>',
        $('#insertbeforeinsertafter_container').html()
      );

      //testing with a zepto object of more than one element as parameter
      $(document.body).append('<div class="insertbefore">insertbefore1</div><div class="insertbefore">insertbefore2</div>');
      $(document.body).append('<div class="insertafter">insertafter1</div><div class="insertafter">insertafter2</div>');

      $('#insertbeforeinsertafter_container').html('<div id="insertbeforeinsertafter"></div>');

      $('.insertbefore').insertBefore($('#insertbeforeinsertafter'));
      $('.insertafter').insertAfter($('#insertbeforeinsertafter'));

      assert.equal(
        '<div class="insertbefore">insertbefore1</div><div class="insertbefore">insertbefore2</div>'+
        '<div id="insertbeforeinsertafter"></div><div class="insertafter">insertafter1</div>'+
        '<div class="insertafter">insertafter2</div>',
        $('#insertbeforeinsertafter_container').html()
      );

      //testing with a selector as parameter
      $('#insertbeforeinsertafter_container').html('<div id="insertbeforeinsertafter"></div>');

      ib.insertBefore('#insertbeforeinsertafter');
      ia.insertAfter('#insertbeforeinsertafter');

      assert.equal(
        '<div>insertbefore</div><div id="insertbeforeinsertafter">'+
        '</div><div>insertafter</div>',
        $('#insertbeforeinsertafter_container').html()
      );
    },

    /*
    //XXX Domino doesn't evaluate scripts
    testAppendEval: function() {
      try {
        window.someGlobalVariable = false;
        $('<' + 'script>window.someGlobalVariable = true;</script' + '>').appendTo('body');
        assert.ok(window.someGlobalVariable);

        window.someGlobalVariable = false;
        $('<' + 'script>this.someGlobalVariable = true;</script' + '>').appendTo('body');
        assert.ok(window.someGlobalVariable);
      } finally {
        delete window.someGlobalVariable;
      }
    },

    testHtmlEval: function() {
      try {
        window.someGlobalVariable = false;
        $('<div></div>').appendTo('body')
          .html('<' + 'script>window.someGlobalVariable = true;</script' + '>');
        assert.ok(window.someGlobalVariable);
      } finally {
        delete window.someGlobalVariable;
      }
    },

    testAppendTemplateNonEval: function() {
      try {
        window.someGlobalVariable = true;
        $('<' + 'script type="text/template">window.someGlobalVariable = false;</script' + '>').appendTo('body');
        assert.ok(window.someGlobalVariable);

        window.someGlobalVariable = true;
        $('<' + 'script type="text/template">this.someGlobalVariable = false;</script' + '>').appendTo('body');
        assert.ok(window.someGlobalVariable);
      } finally {
        delete window.someGlobalVariable;
      }
    },

    testHtmlTemplateNonEval: function() {
      try {
        window.someGlobalVariable = true;
        $('<div></div>').appendTo('body')
          .html('<' + 'script type="text/template">window.someGlobalVariable = false;</script' + '>');
        assert.ok(window.someGlobalVariable);
      } finally {
        delete window.someGlobalVariable;
      }
    },
    */

    testRemove: function() {
      var newElement1 = $('<div id="some_new_element_1" />');

      newElement1
        .appendTo('body')
        .remove();

      assert.equal( $('#some_new_element_1').length, 0 );

      //

      var newElement2 = $('<div id="some_new_element_2" />'),
          errorRaised = false;

      newElement2.appendTo('body');

      $('#some_new_element_2').remove();

      try {
        newElement2.remove();
      }
      catch (e) {
        errorRaised = true;
      }

      assert.ok(!errorRaised);
    },

    testAddRemoveClass: function(){
      var el = $('#some_element').get(0);

      $('#some_element').addClass('green');
      assert.equal('green', el.className);
      $('#some_element').addClass('green');
      assert.equal('green', el.className);
      $('#some_element').addClass('red');
      assert.equal('green red', el.className);
      $('#some_element').addClass('blue red');
      assert.equal('green red blue', el.className);
      $('#some_element').removeClass('green blue');
      assert.equal('red', el.className);

      $('#some_element').attr('class', ' red green blue ');
      assert.equal(' red green blue ', el.className); // sanity check that WebKit doesn't change original input
      $('#some_element').removeClass('green');
      assert.equal('red blue', el.className);

      //addClass with function argument
      $('#some_element').addClass(function(idx,classes){
        //test the value of "this"
        assert.equalCollection($('#some_element'), $(this));
        //test original classes are being passed
        assert.equal('red blue', this.className);
        return "green";
      });
      assert.equal('red blue green', el.className);

      //removeClass with function argument
      $('#some_element').removeClass(function(idx,classes){
        //test the value of "this"
        assert.equalCollection($('#some_element'), $(this));
        //test original classes are being passed
        assert.equal('red blue green', this.className);
        return "blue";
      });
      assert.equal('red green', el.className);

      $('#some_element').removeClass();
      assert.equal('', el.className);
    },

    testHasClass: function(){
      var el = $('#some_element').get(0);
      $('#some_element').addClass('green');

      assert.ok($('#some_element').hasClass('green'));
      assert.ok(!$('#some_element').hasClass('orange'));

      $('#some_element').addClass('orange');
      assert.ok($('#some_element').hasClass('green'));
      assert.ok($('#some_element').hasClass('orange'));
    },

    testHasClassEmpty: function(){
      var z = $('#doesnotexist');
      assert.equal(0, z.size());
      assert.false(z.hasClass('a'));
    },

    testToggleClass: function(){
      var el = $('#toggle_element').get(0);
      $('#toggle_element').toggleClass('green');

      assert.ok($('#toggle_element').hasClass('green'));
      assert.ok(!$('#toggle_element').hasClass('orange'));

      $('#toggle_element').toggleClass('orange');
      assert.ok($('#toggle_element').hasClass('green'));
      assert.ok($('#toggle_element').hasClass('orange'));

      $('#toggle_element').toggleClass('green');

      assert.ok(!$('#toggle_element').hasClass('green'));
      assert.ok($('#toggle_element').hasClass('orange'));

      $('#toggle_element').toggleClass('orange');
      assert.ok(!$('#toggle_element').hasClass('green'));
      assert.ok(!$('#toggle_element').hasClass('orange'));

      $('#toggle_element').toggleClass('orange', false);
      assert.ok(!$('#toggle_element').hasClass('orange'));

      $('#toggle_element').toggleClass('orange', false);
      assert.ok(!$('#toggle_element').hasClass('orange'));

      $('#toggle_element').toggleClass('orange', true);
      assert.ok($('#toggle_element').hasClass('orange'));

      $('#toggle_element').toggleClass('orange', true);
      assert.ok($('#toggle_element').hasClass('orange'));

      //function argument
      $('#toggle_element').toggleClass(function(idx,classes){
        //test the value of "this"
        assert.equalCollection($('#toggle_element'), $(this));
        //test original classes are being passed
        assert.equal('orange', this.className);
        return "brown";
      });
      assert.ok($('#toggle_element').hasClass('brown'));

      $('#toggle_element').toggleClass(function(idx,classes){
        return "yellow";
      },false);
      assert.ok(!$('#toggle_element').hasClass('yellow'));

      $('#toggle_element').toggleClass(function(idx,classes){
        return "yellow";
      },true);
      assert.ok($('#toggle_element').hasClass('yellow'));
    },

    testindex: function(){
      assert.equal($("p > span").index("#nay"), 2);
      assert.equal($("p > span").index(".yay"), 0);
      assert.equal($("span").index("span"), 0);
      assert.equal($("span").index("boo"), -1);

      assert.equal($('#index_test > *').eq(-1).index(), 1);
    },

    testBoolAttr: function() {
      assert.true($('#BooleanInput').attr('required'));
      assert.equal($('#BooleanInput').attr('non_existant_attr'), undefined);
    },

    testDocumentReady: function() {
      // Check that if document is already loaded, ready() immediately executes callback
      var arg1, arg2, fired = false;
      $(function (Z1) {
        arg1 = Z1;
        $(document).ready(function (Z2) {
          arg2 = Z2;
          fired = true;
        })
      });
      assert.true(fired);
      assert.identical(Zepto, arg1);
      assert.identical(Zepto, arg2);
    },

    testSlice: function() {
      var $els = $("#slice_test div");
      assert.equal($els.slice().length, 3);
      assert.equal(typeof $els.slice().ready, 'function');
      assert.equal($els.slice(-1)[0].className, 'slice3');
    },

    testEnd: function() {
      assert.ok($().end().length, 0);

      var $endTest = $('#end_test');
      var $endTest2 = $('#end_test').find('div').find('span').end().end();
      assert.equal($endTest.length, $endTest2.length);
      assert.equal($endTest.get(0), $endTest2.get(0));
    },

    testAndSelf: function() {
      var testDiv  = $('#andself_test'),
          secondEl = $('.two', testDiv),
          thirdEl  = $('.three', testDiv),
          nextAndSelf = secondEl.next().andSelf();

      assert.ok( secondEl.get(0), nextAndSelf.get(0) );
      assert.ok( thirdEl.get(0),  nextAndSelf.get(1) );
    }
  };

  tests.events = {
    afterEach: function(){
      $('*').unbind();
    },

    testBind: function(){
      var counter = 0;
      $(document.body).bind('click', function(){ counter++ });
      click($('#some_element').get(0));
      assert.equal(1, counter);

      counter = 0;
      $('#some_element').bind('click mousedown', function(){ counter++ });
      click($('#some_element').get(0));
      mousedown($('#some_element').get(0));
      assert.equal(3, counter); // 1 = body click, 2 = element click, 3 = element mousedown
    },

    testBindWithObject: function(){
      var counter = 0, keyCounter = 0, el = $('#some_element'),
        eventData = {
          click: function(){ counter++ },
          keypress: function(){ keyCounter++ }
        };

      $(document.body).bind(eventData);

      el.trigger('click');
      el.trigger('click');
      assert.equal(2, counter);
      el.trigger('keypress');
      assert.equal(1, keyCounter);

      $(document.body).unbind({ keypress: eventData.keypress });

      el.trigger('click');
      assert.equal(3, counter);
      el.trigger('keypress');
      assert.equal(1, keyCounter);
    },

    testBindContext: function(){
      var context, handler = function(){
        context = $(this);
      };
      $('#empty_test').bind("click",handler);
      $('#empty_test').bind("mousedown",handler);
      click($('#empty_test').get(0));
      assert.equalCollection($('#empty_test'), context);
      context = null;
      mousedown($('#empty_test').get(0));
      assert.equalCollection($('#empty_test'), context);
    },

    testBindWithCustomData: function() {
      var counter = 0;
      var handler = function(ev,customData) { counter = customData.counter };

      $('#some_element').bind('custom', handler);
      $('#some_element').trigger('custom', { counter: 10 });
      assert.equal(10, counter);
    },

    testBindPreventDefault: function() {
      var link = $('<a href="#"></a>'),
          prevented = false;

      link
        .appendTo('body')
        .bind('click', function () {
          return false;
        })
        .bind('click', function (e) {
          prevented = e.defaultPrevented;
        })
        .trigger('click');

      assert.ok(prevented);
    },

    testCreateEventObject: function(){
      var e = $.Event('custom');
      assert.equal('custom', e.type);

      var e2 = new $.Event('custom');
      assert.equal('custom', e2.type);

      var e3 = $.Event('custom', {customKey: 'customValue'});
      assert.equal('custom', e3.type);
      assert.equal('customValue', e3.customKey);

      var e4 = $.Event('custom', {bubbles: false});
      assert.false(e4.bubbles);
    },

    testTriggerEventObject: function(){
      var counter = 0,
          customEventKey = 0;

      var handler = function(ev,customData) {
        counter = customData.counter;
        customEventKey = ev.customKey;
      };

      var customEventObject = $.Event('custom', { customKey: 20 });

      $('#some_element').bind('custom', handler);
      $('#some_element').trigger(customEventObject, { counter: 10 });

      assert.equal(10, counter);
      assert.equal(20, customEventKey);
    },

    testTriggerEventCancelled: function(){
      $('#some_element').bind('custom', function(e){
        e.preventDefault();
      });
      var event = $.Event('custom');
      assert.ok(!event.defaultPrevented);
      $('#some_element').trigger(event);
      assert.ok(event.defaultPrevented);
    },

    testTriggerHandler: function(){
      assert.undefined($('doesnotexist').triggerHandler('submit'));

      var form = $('#trigger_handler form').get(0);
      $('#trigger_handler').bind('submit', function(e) {
        fail("triggerHandler shouldn't bubble");
      });

      var executed = [];
      $(form).bind('submit', function(e) {
        executed.push("1");
        assert.equal(form, e.target);
        return 1;
      });
      $(form).bind('submit', function(e) {
        executed.push("2");
        assert.equal(form, e.target);
        e.stopImmediatePropagation();
        return 2;
      });
      $(form).bind('submit', function(e) {
        fail("triggerHandler shouldn't continue after stopImmediatePropagation");
      });
      assert.identical(2, $(form).triggerHandler('submit'));
      assert.equal('1 2', executed.join(' '));
    },

    testUnbind: function(){
      var counter = 0, el = $('#another_element').get(0);
      var handler = function(){ counter++ };
      $('#another_element').bind('click mousedown', handler);
      click(el);
      mousedown(el);
      assert.equal(2, counter);

      $('#another_element').unbind('click', handler);
      click(el);
      assert.equal(2, counter);
      mousedown(el);
      assert.equal(3, counter);

      $('#another_element').unbind('mousedown');
      mousedown(el);
      assert.equal(3, counter);

      $('#another_element').bind('click mousedown', handler);
      click(el);
      mousedown(el);
      assert.equal(5, counter);

      $('#another_element').unbind();
      click(el);
      mousedown(el);
      assert.equal(5, counter);
    },

    testUnbindWithNamespace: function(){
      var count = 0;
      $("#namespace_test").bind("click.bar", function() { count++ });
      $("#namespace_test").bind("click.foo", function() { count++ });
      $("#namespace_test").bind("mousedown.foo.bar", function() { count++ });

      $("#namespace_test").trigger("click");
      assert.equal(2, count);

      $("#namespace_test").unbind("click.baz");
      $("#namespace_test").trigger("click");
      assert.equal(4, count);

      $("#namespace_test").unbind("click.foo");
      $("#namespace_test").trigger("click");
      assert.equal(5, count);

      $("#namespace_test").trigger("mousedown");
      assert.equal(6, count);

      $("#namespace_test").unbind(".bar");
      $("#namespace_test").trigger("click").trigger("mousedown");
      assert.equal(6, count);
    },

    testDelegate: function(){
      var counter = 0, pcounter = 0;
      $(document.body).delegate('#some_element', 'click', function(){ counter++ });
      $('p').delegate('span.yay', 'click', function(){ counter++ });
      $(document.body).delegate('p', 'click', function(){ pcounter++ });

      click($('#some_element').get(0));
      assert.equal(1, counter);

      click($('span.yay').get(0));
      assert.equal(2, counter);

      click($('span.nay').get(0));
      assert.equal(2, counter);

      click($('p').get(0));
      assert.equal(3, pcounter);
    },

    testDelegateReturnfalse: function(){
      $(document.body).delegate('#some_element', 'click', function(){ return false });

      var event = $.Event('click');
      $('#some_element').trigger(event);
      assert.true(event.defaultPrevented);
    },

    testDelegateWithObject: function(){
      var counter = 0, received, el = $('p').first(),
        eventData = {
          click: function(){ counter++ },
          custom: function(e, data){ received = data }
        };

      $(document.body).delegate('p', eventData);

      el.trigger('click');
      assert.equal(1, counter);
      el.trigger('click');
      assert.equal(2, counter);
      el.trigger('custom', 'boo');
      assert.equal('boo', received);

      $(document.body).undelegate('p', {custom: eventData.custom});

      el.trigger('click');
      assert.equal(3, counter);
      el.trigger('custom', 'bam');
      assert.equal('boo', received);
    },

    testDelegateWithCustomData: function() {
      var received;
      $(document).delegate('#some_element', 'custom', function(e, data, more){ received = data + more });
      $('p').delegate('span.yay', 'custom', function(e, data){ received = data });
      $(document).delegate('p', 'custom', function(e, data){ received = data });

      $('#some_element').trigger('custom', 'one');
      assert.equal('oneundefined', received);
      $('#some_element').trigger('custom', ['one', 'two']);
      assert.equal('onetwo', received);

      $('span.yay').trigger('custom', 'boom');
      assert.equal('boom', received);
      $('span.yay').trigger('custom', ['bam', 'boom']);
      assert.equal('bam', received);

      $('span.nay').trigger('custom', 'noes');
      assert.equal('noes', received);

      $('p').first().trigger('custom', 'para');
      assert.equal('para', received);
    },

    testDelegateEventProxy: function(){
      var content;
      $('div#delegate_test').delegate('span.second-level', 'click', function(e){
        assert.equal($('span.second-level').get(0), this);
        assert.equal($('span.second-level').get(0), e.currentTarget);
        assert.refute.equal($('span.second-level').get(0), e.originalEvent.currentTarget);
        assert.equal($('div#delegate_test').get(0), e.liveFired);
        content = $(this).html();
      });
      click($('span.second-level').get(0));
      assert.equal('hi', content);

      var fired = false;
      if (window.location.hash.length) window.location.hash = '';
      $('div#delegate_test').html('<a href="#foo"></a>');
      $('div#delegate_test').delegate('a', 'click', function(e){
        e.preventDefault();
        fired = true;
      });
      click($('div#delegate_test a').get(0));
      assert.ok(fired);
      assert.refute.equal('#foo', window.location.hash);

      fired = false;
      if (window.location.hash.length) window.location.hash = '';
      $('div#delegate_test').html('<a href="#bar"></a>');
      $('div#delegate_test a').trigger('click');
      assert.ok(fired);
      assert.refute.equal('#bar', window.location.hash);
    },

    testUndelegate: function(){
      var count = 0, handler = function() { count++ };
      $("#undelegate_test").bind("click mousedown", handler);
      $("#undelegate_test").delegate("span.first-level", "click mousedown", handler);
      $("#undelegate_test").delegate("span.second-level", "click mousedown", handler);
      $("#undelegate_test span.second-level").trigger("click");
      assert.equal(3, count);

      $("#undelegate_test").undelegate("span.second-level", "click", handler);
      $("#undelegate_test span.second-level").trigger("click");
      assert.equal(5, count);

      $("#undelegate_test").undelegate("span.first-level");
      $("#undelegate_test span.second-level").trigger("click");
      assert.equal(6, count);

      $("#undelegate_test").unbind("click");
      $("#undelegate_test span.second-level").trigger("click");
      assert.equal(6, count);

      $("#undelegate_test span.second-level").trigger("mousedown");
      assert.equal(8, count);

      $("#undelegate_test").undelegate();
      $("#undelegate_test span.second-level").trigger("mousedown");
      assert.equal(8, count);
    },

    testLive: function(){
      var counter = 0;
      $('p.live').live('click', function(){ counter++ });

      $(document.body).append('<p class="live" id="live_1"></p>');
      $(document.body).append('<p class="live" id="live_2"></p>');

      click($('#live_1').get(0));
      click($('#live_2').get(0));

      $('p.live').remove();
      $(document.body).append('<p class="live" id="live_this_test"></p>');

      $('p.live').live('click', function(){
        assert.equal(document.getElementById('live_this_test'), this);
      });
      click($('#live_this_test').get(0));

      assert.equal(3, counter);
    },

    testDie: function(){
      var count = 0, handler = function() { count++ };
      $("#another_element").live("click mousedown", handler);
      $("#another_element").trigger("click");
      assert.equal(1, count);

      $("#another_element").die("click", handler);
      $("#another_element").trigger("click");
      assert.equal(1, count);

      $("#another_element").trigger("mousedown");
      assert.equal(2, count);

      $("#another_element").die();
      $("#another_element").trigger("mousedown");
      assert.equal(2, count);
    },

    testOn: function(){
      var el = $('#some_element'), node = el.get(0), ret,
        bindTriggered = 0, delegateTriggered = 0;

      ret = el.on('click', function(e){
        bindTriggered++;
        assert.identical(node, this);
      })
        .on({ click: function(){bindTriggered++} });
      assert.identical(el, ret);

      ret = $(document.body).on('click', 'div', function(e){
        delegateTriggered++;
        assert.identical(node, this);
      })
        .on({ click: function(){delegateTriggered++} }, '*[id^=some]');
      assert.identical(document.body, ret.get(0));

      click(node);
      assert.equal(2, bindTriggered, "bind handlers");
      assert.equal(2, delegateTriggered, "delegate handlers");
    },

    testOff: function(){
      var el = $('#some_element'), bindTriggered = 0, delegateTriggered = 0,
        handler = function(){ bindTriggered++ };

      el.bind('click', handler).bind('click', function(){ bindTriggered++ });
      el.live('click', function(){ delegateTriggered++ });

      click(el.get(0));
      assert.equal(2, bindTriggered, "bind handlers before unbind");
      assert.equal(1, delegateTriggered, "delegate handlers before unbind");

      el.off('click', handler);
      $(document.body).off('click', '#some_element');

      click(el.get(0));
      assert.equal(3, bindTriggered, "bind handlers");
      assert.equal(1, delegateTriggered, "delegate handlers");
    },

    testOne: function(){
      var counter = 0, context, received, el = $('#some_element');
      $(document.body).one('click', function(e, data, more){
        context = this;
        counter++;
        received = data + more;
        assert.in('preventDefault', e);
        return false;
      });

      var evt = $.Event('click');
      el.trigger(evt, ['one', 'two']);
      assert.equal(1, counter);
      assert.equal('onetwo', received);
      assert.identical(document.body, context);
      assert.true(evt.defaultPrevented);

      el.trigger('click');
      assert.equal(1, counter, "the event handler didn't unbind itself");
    },

    testOneWithObject: function(){
      var counter = 0, el = $('#some_element');
      $(document.body).one({
        click: function() { counter++ },
        custom: function() { counter-- }
      });

      el.trigger('click');
      assert.equal(1, counter);
      el.trigger('click');
      assert.equal(1, counter);

      el.trigger('custom');
      assert.equal(0, counter);
      el.trigger('custom');
      assert.equal(0, counter);
    },

    testDOMEventWrappers: function(){
      var events = ('blur focus focusin focusout load resize scroll unload click dblclick '+
        'mousedown mouseup mousemove mouseover mouseout '+
        'change select keydown keypress keyup error').split(' ');

      var el = $('#another_element'), count = 0;

      events.forEach(function(event){
        assert.true($.isFunction(el[event]), 'event type: ' + event);
      });

      el.click(function(){ count++ });
      click(el.get(0));

      assert.equal(1, count);
    },

    testCustomEvents: function() {
      var el = $(document.body);

      el.bind('custom', function(evt, a, b) {
        assert.equal(a, 1);
        assert.equal(b, 2);
        el.unbind();
      })
      el.trigger('custom', [1, 2]);

      el.bind('custom', function(evt, a) {
        assert.equal(a, 1);
        el.unbind();
      })
      el.trigger('custom', 1);

      var eventData = {z: 1};
      el.bind('custom', function(evt, a) {
        assert.equal(a, eventData);
        el.unbind();
      })
      el.trigger('custom', eventData);
    },

    testSpecialEvent: function() {
      var clickEvent     = $.Event('click'),
          mouseDownEvent = $.Event('mousedown'),
          mouseUpEvent   = $.Event('mouseup'),
          mouseMoveEvent = $.Event('mousemove'),
          submitEvent    = $.Event('submit');

      assert.equal(MouseEvent, clickEvent.constructor);
      assert.equal(MouseEvent, mouseDownEvent.constructor);
      assert.equal(MouseEvent, mouseUpEvent.constructor);
      assert.equal(MouseEvent, mouseMoveEvent.constructor);
      assert.equal(Event,      submitEvent.constructor);
    }
  };

  return tests;

});
