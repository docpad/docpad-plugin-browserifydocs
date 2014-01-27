---
browserify:
	exclude: ['excludelibrary']
---

var lib = require('excludelibrary');
console.log(lib);
