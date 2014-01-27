/**
 * This file is ignored by Browserify.
 */
var hello = "world";

module.exports = 'nobrowserify ' + hello;
console.log(module.exports);
