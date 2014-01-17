module.exports = {
	plugins:
		browserifybundles:
			bundles: [
					arguments: ['-r', 'rtc-videoproc/filters/grayscale']
					entry: 'videoproc.js'
					out:   'videoproc-bundled.js'
				,
					ignore: 'jquery'
					entry:  'miniview.js'
					out:    'miniview-bundled.js'
			]
}