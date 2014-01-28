# Test our plugin using DocPad's Testers
require('docpad').require('testers').test({
	pluginPath: __dirname+'/..'
	testerClass: 'RendererTester'
	contentRemoveRegex: /['"][\w\d]{6}['"]/g
})
