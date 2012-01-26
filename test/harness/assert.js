var util = require('util');

function assertExpression(expr, message, template, actual, expected) {
  if (!expr) {
    if (template) {
      template = template.replace(/%[^%]/g, '%s');
      message = util.format(template,
        util.inspect(actual, false, 1, true),
        util.inspect(expected, false, 1, true)
      )
    }
    throw new Error(message);
  }
}

exports.expression = assertExpression;

exports.ok = function(expr, message) {
  assertExpression(expr, message || 'Failed assertion.');
}

exports.equal = function(expected, actual, message) {
  assertExpression(
    (expected == actual),
    message || 'Failed assertion.',
    'Expected %o to be == to %o.', actual, expected
  )
}

exports.true = function(test, message) {
  assertExpression(
    (test === true),
    message || 'Failed assertion.',
    'Expected %o to be true.', test
  )
}

exports.false = function(test, message) {
  assertExpression(
    (test === false),
    message || 'Failed assertion.',
    'Expected %o to be false.', test
  );
}

exports.null = function(test, message) {
  assertExpression(
    (test === null),
    message || 'Failed assertion.',
    'Expected %o to be null.', test
  )
}

exports.identical = function(expected, actual, message) {
  assertExpression(
    (expected === actual),
    message || 'Failed assertion.',
    'Expected %o to be === to %o.', actual, expected
  )
}

exports.undefined = function(test, message) {
  assertExpression(
    (typeof test === 'undefined'),
    message || 'Failed assertion.',
    'Expected %o to be undefined.', test
  )
}

exports.same = function(expected, actual, message) {
  var expectedKeyCount = 0, actualKeyCount = 0, key, passed = true;
  for (key in expected) expectedKeyCount++;
  for (key in actual) actualKeyCount++;

  if (expectedKeyCount == actualKeyCount)
    for (key in expected)
      passed &= expected[key] == actual[key];
  else
    passed = false;

  assertExpression(passed, message || 'Failed assertion.',
    'Expected %o to be the same as %o.', actual, expected);
}

exports.length = function(expected, object, message) {
  var actual = object.length;
  assertExpression(expected === actual, message || 'Failed assertion.',
    'Expected length %d, got %d.', expected, actual);
}

exports.in = function(property, object, message) {
  assertExpression(
    (property in object),
    message || 'Failed assertion.',
    'Expected "%s" to be a property of %o.', property, object
  )
}

exports.equalCollection = function(expectedCollection, actualCollection, message) {
  var expected = expectedCollection, actual = actualCollection,
      passed = expected.length == actual.length

  if (typeof expected.get == 'function') expected = expected.get()
  if (typeof actual.get == 'function') actual = actual.get()

  if (passed) for (var i=0; i<expected.length; i++) passed = expected[i] == actual[i]

  assertExpression(passed, message || 'Failed assertion.',
    'Expected collection %o, got %o.', expected, actual)
}

exports.refute = {
  equal: function(expected, actual, message) {
    assertExpression(
      (expected != actual),
      message || 'Failed refutation.',
      'Expected %o to be != to %o.', actual, expected
    )
  },
  identical: function(expected, actual, message) {
    assertExpression(
      (expected !== actual),
      message || 'Failed refutation.',
      'Expected %o to be !== to %o.', actual, expected
    )
  }
}
