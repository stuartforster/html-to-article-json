'use strict';

require('./browser');

var test = require('tape');
var fs = require('fs');
var parse = require('../lib/parse');

['basic', 'style', 'divs', 'whitespace', 'linebreak', 'selection-marker'].forEach(function (testName) {
  test('parse() ' + testName, function (t) {
    var html = fs.readFileSync(__dirname + '/fixtures/' + testName + '.html');
    var elm = document.createElement('div');
    elm.contentEditable = true;
    elm.innerHTML = html.toString().trim();

    t.deepEqual(parse(elm), require('./fixtures/' + testName + '.json'));

    t.end();
  });
});

test('parse() whitespace \t', function (t) {
  var elm = document.body.appendChild(document.createElement('p'));
  elm.appendChild(document.createTextNode('\tbeep\tboop\t'));
  t.deepEqual(parse(elm), [{
    type: 'paragraph',
    children: [{
      type: 'text',
      content: ' beep boop ',
      href: null,
      bold: false,
      italic: false
    }]
  }]);
  t.end();
});

test('parse() Multiple text nodes', function (t) {
  var elm = document.body.appendChild(document.createElement('div'));
  'foobar'.split('').forEach(function (char) {
    elm.appendChild(document.createTextNode(char));
  });

  t.deepEqual(parse(elm), [{
    type: 'paragraph',
    children: [{
      type: 'text',
      content: 'foobar',
      href: null,
      bold: false,
      italic: false
    }]
  }]);
  t.end();
});

test('parse() empty text node', function (t) {
  var elm = document.body.appendChild(document.createElement('div'));
  var p = elm.appendChild(document.createElement('p'));
  p.appendChild(document.createTextNode(''));

  t.deepEqual(parse(elm), [{
    type: 'paragraph',
    children: []
  }]);
  t.end();
});