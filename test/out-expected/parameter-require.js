require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"TYou8H":[function(require,module,exports){
/**
 * This file is ignored by Browserify.
 */
var hello = "world";

module.exports = 'nobrowserify ' + hello;
console.log(module.exports);
},{}],"nobrowser":[function(require,module,exports){
module.exports=require('TYou8H');
},{}],3:[function(require,module,exports){
var nobrowser = require('nobrowser');
console.log('parameter-require.js' + nobrowser);

var requirenobrowserify = require('./require-nobrowserify.js');
console.log('parameter-require.js' + requirenobrowserify);
},{"./require-nobrowserify.js":4,"nobrowser":"TYou8H"}],4:[function(require,module,exports){
var nobrowserify = require('./nobrowserify')
console.log('require-nobrowserify.js ' + nobrowserify);
},{"./nobrowserify":"TYou8H"}]},{},[3,4])