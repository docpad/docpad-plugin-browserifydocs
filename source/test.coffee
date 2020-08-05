# Test our plugin using DocPad's Testers
require('docpad-plugintester').test({
	contentRemoveRegex: /['"][\w\d]{6}['"]/g
})