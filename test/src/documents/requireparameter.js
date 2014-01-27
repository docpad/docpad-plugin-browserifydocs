---
browserify:
	require:
		'./nobrowserify.js':
			expose: 'nobrowser'
		'./requirenobrowserify.js': true
---

var nobrowser = require('nobrowser');
console.log('requireparameter.js' + nobrowser);

var requirenobrowserify = require('./requirenobrowserify.js');
console.log('requireparameter.js' + requirenobrowserify);
