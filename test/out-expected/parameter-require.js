require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"aI5kVt":[function(require,module,exports){
/**
 * This file is ignored by Browserify.
 */
var hello = "world";

module.exports = 'nobrowserify ' + hello;

},{}],"nobrowser":[function(require,module,exports){
module.exports=require('aI5kVt');
},{}],3:[function(require,module,exports){
var nobrowser = require('nobrowser');
console.log('parameter-require.js' + nobrowser);

var requirenobrowserify = require('./require-nobrowserify.js');
console.log('parameter-require.js' + requirenobrowserify);
},{"./require-nobrowserify.js":4,"nobrowser":"aI5kVt"}],4:[function(require,module,exports){
var nobrowserify = require('./nobrowserify')
console.log('require-nobrowserify.js ' + nobrowserify);
},{"./nobrowserify":"aI5kVt"}]},{},[3,4])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvaG9tZS9yb2IvRG9jdW1lbnRzL2RvY3BhZC1wbHVnaW4tYnJvd3NlcmlmeWJ1bmRsZXMvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9ob21lL3JvYi9Eb2N1bWVudHMvZG9jcGFkLXBsdWdpbi1icm93c2VyaWZ5YnVuZGxlcy90ZXN0L291dC9ub2Jyb3dzZXJpZnkuanMiLCIvaG9tZS9yb2IvRG9jdW1lbnRzL2RvY3BhZC1wbHVnaW4tYnJvd3NlcmlmeWJ1bmRsZXMvdGVzdC9vdXQvcGFyYW1ldGVyLXJlcXVpcmUuanMiLCIvaG9tZS9yb2IvRG9jdW1lbnRzL2RvY3BhZC1wbHVnaW4tYnJvd3NlcmlmeWJ1bmRsZXMvdGVzdC9vdXQvcmVxdWlyZS1ub2Jyb3dzZXJpZnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4gKiBUaGlzIGZpbGUgaXMgaWdub3JlZCBieSBCcm93c2VyaWZ5LlxuICovXG52YXIgaGVsbG8gPSBcIndvcmxkXCI7XG5cbm1vZHVsZS5leHBvcnRzID0gJ25vYnJvd3NlcmlmeSAnICsgaGVsbG87XG4iLCJ2YXIgbm9icm93c2VyID0gcmVxdWlyZSgnbm9icm93c2VyJyk7XG5jb25zb2xlLmxvZygncGFyYW1ldGVyLXJlcXVpcmUuanMnICsgbm9icm93c2VyKTtcblxudmFyIHJlcXVpcmVub2Jyb3dzZXJpZnkgPSByZXF1aXJlKCcuL3JlcXVpcmUtbm9icm93c2VyaWZ5LmpzJyk7XG5jb25zb2xlLmxvZygncGFyYW1ldGVyLXJlcXVpcmUuanMnICsgcmVxdWlyZW5vYnJvd3NlcmlmeSk7IiwidmFyIG5vYnJvd3NlcmlmeSA9IHJlcXVpcmUoJy4vbm9icm93c2VyaWZ5JylcbmNvbnNvbGUubG9nKCdyZXF1aXJlLW5vYnJvd3NlcmlmeS5qcyAnICsgbm9icm93c2VyaWZ5KTsiXX0=
