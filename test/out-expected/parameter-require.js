require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"aI5kVt":[function(require,module,exports){
/**
 * This file is ignored by Browserify.
 */
var hello = "world";

module.exports = 'nobrowserify ' + hello;
console.log(module.exports);

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
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvaG9tZS9yb2IvRG9jdW1lbnRzL2RvY3BhZC1wbHVnaW4tYnJvd3NlcmlmeWJ1bmRsZXMvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9ob21lL3JvYi9Eb2N1bWVudHMvZG9jcGFkLXBsdWdpbi1icm93c2VyaWZ5YnVuZGxlcy90ZXN0L291dC9ub2Jyb3dzZXJpZnkuanMiLCIvaG9tZS9yb2IvRG9jdW1lbnRzL2RvY3BhZC1wbHVnaW4tYnJvd3NlcmlmeWJ1bmRsZXMvdGVzdC9vdXQvcGFyYW1ldGVyLXJlcXVpcmUuanMiLCIvaG9tZS9yb2IvRG9jdW1lbnRzL2RvY3BhZC1wbHVnaW4tYnJvd3NlcmlmeWJ1bmRsZXMvdGVzdC9vdXQvcmVxdWlyZS1ub2Jyb3dzZXJpZnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIFRoaXMgZmlsZSBpcyBpZ25vcmVkIGJ5IEJyb3dzZXJpZnkuXG4gKi9cbnZhciBoZWxsbyA9IFwid29ybGRcIjtcblxubW9kdWxlLmV4cG9ydHMgPSAnbm9icm93c2VyaWZ5ICcgKyBoZWxsbztcbmNvbnNvbGUubG9nKG1vZHVsZS5leHBvcnRzKTtcbiIsInZhciBub2Jyb3dzZXIgPSByZXF1aXJlKCdub2Jyb3dzZXInKTtcbmNvbnNvbGUubG9nKCdwYXJhbWV0ZXItcmVxdWlyZS5qcycgKyBub2Jyb3dzZXIpO1xuXG52YXIgcmVxdWlyZW5vYnJvd3NlcmlmeSA9IHJlcXVpcmUoJy4vcmVxdWlyZS1ub2Jyb3dzZXJpZnkuanMnKTtcbmNvbnNvbGUubG9nKCdwYXJhbWV0ZXItcmVxdWlyZS5qcycgKyByZXF1aXJlbm9icm93c2VyaWZ5KTsiLCJ2YXIgbm9icm93c2VyaWZ5ID0gcmVxdWlyZSgnLi9ub2Jyb3dzZXJpZnknKVxuY29uc29sZS5sb2coJ3JlcXVpcmUtbm9icm93c2VyaWZ5LmpzICcgKyBub2Jyb3dzZXJpZnkpOyJdfQ==
