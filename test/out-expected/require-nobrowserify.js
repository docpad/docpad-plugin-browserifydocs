(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * This file is ignored by Browserify.
 */
var hello = "world";

module.exports = 'nobrowserify ' + hello;

},{}],2:[function(require,module,exports){
var nobrowserify = require('./nobrowserify')
console.log('require-nobrowserify.js ' + nobrowserify);
},{"./nobrowserify":1}]},{},[2])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvaG9tZS9yb2IvRG9jdW1lbnRzL2RvY3BhZC1wbHVnaW4tYnJvd3NlcmlmeWJ1bmRsZXMvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9ob21lL3JvYi9Eb2N1bWVudHMvZG9jcGFkLXBsdWdpbi1icm93c2VyaWZ5YnVuZGxlcy90ZXN0L291dC9ub2Jyb3dzZXJpZnkuanMiLCIvaG9tZS9yb2IvRG9jdW1lbnRzL2RvY3BhZC1wbHVnaW4tYnJvd3NlcmlmeWJ1bmRsZXMvdGVzdC9vdXQvcmVxdWlyZS1ub2Jyb3dzZXJpZnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIFRoaXMgZmlsZSBpcyBpZ25vcmVkIGJ5IEJyb3dzZXJpZnkuXG4gKi9cbnZhciBoZWxsbyA9IFwid29ybGRcIjtcblxubW9kdWxlLmV4cG9ydHMgPSAnbm9icm93c2VyaWZ5ICcgKyBoZWxsbztcbiIsInZhciBub2Jyb3dzZXJpZnkgPSByZXF1aXJlKCcuL25vYnJvd3NlcmlmeScpXG5jb25zb2xlLmxvZygncmVxdWlyZS1ub2Jyb3dzZXJpZnkuanMgJyArIG5vYnJvd3NlcmlmeSk7Il19
