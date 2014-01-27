---
browserify:
	require:
		'./nobrowserify.js':
			expose: 'nobrowser'
		'./require-nobrowserify.js': true
---

var nobrowser = require('nobrowser');
console.log('parameter-require.js' + nobrowser);

var requirenobrowserify = require('./require-nobrowserify.js');
console.log('parameter-require.js' + requirenobrowserify);
