# Browserify Bundles for DocPad

<!-- BADGES/ -->

[![Build Status](http://img.shields.io/travis-ci/docpad/docpad-plugin-browserifybundles.png?branch=master)](http://travis-ci.org/docpad/docpad-plugin-browserifybundles "Check this project's build status on TravisCI")
[![NPM version](http://badge.fury.io/js/docpad-plugin-browserifybundles.png)](https://npmjs.org/package/docpad-plugin-browserifybundles "View this project on NPM")
[![Dependency Status](https://david-dm.org/docpad/docpad-plugin-browserifybundles.png?theme=shields.io)](https://david-dm.org/docpad/docpad-plugin-browserifybundles)
[![Development Dependency Status](https://david-dm.org/docpad/docpad-plugin-browserifybundles/dev-status.png?theme=shields.io)](https://david-dm.org/docpad/docpad-plugin-browserifybundles#info=devDependencies)<br/>
[![Gittip donate button](http://img.shields.io/gittip/docpad.png)](https://www.gittip.com/docpad/ "Donate weekly to this project using Gittip")
[![Flattr donate button](http://img.shields.io/flattr/donate.png?color=yellow)](http://flattr.com/thing/344188/balupton-on-Flattr "Donate monthly to this project using Flattr")
[![PayPayl donate button](http://img.shields.io/paypal/donate.png?color=yellow)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=QB8GQPZAH84N6 "Donate once-off to this project using Paypal")
[![BitCoin donate button](http://img.shields.io/bitcoin/donate.png?color=yellow)](https://coinbase.com/checkouts/9ef59f5479eec1d97d63382c9ebcb93a "Donate once-off to this project using BitCoin")

<!-- /BADGES -->


Bundle scripts into browserify packages


## Install

```
docpad install browserifybundles
```


## Usage

Add the following to your [docpad configuration file](http://docpad.org/docs/config):

``` coffee
	plugins:
		browserifybundles:
			bundles: [
				{
					arguments: ['-r', 'rtc-videoproc/filters/grayscale']
					entry: 'videoproc.js'
					out:   'videoproc-bundled.js'
				},
				{
					ignore: 'jquery'
					entry:  'miniview.js'
					out:    'miniview-bundled.js'
				}
			]
```

The `bundles` option is the list of bundles you want. Each bundle accepts the following arguments:

- `entry` a String pointing to which file should be executed right away with this bundle, it is prefixed with the project's outPath if it is a relative path
- `out` a String pointing to where the bundle should be written, it is prefixed with the project's outPath if it is a relative path
- `ignore` a String or Array of Strings for which modules should not be bundled with this bundle
- `require` a String or Array of Strings of paths that should be bundled with this bundle
- `arguments` an Array of Strings that should be sent to the browserify executable


<!-- HISTORY/ -->

## History
[Discover the change history by heading on over to the `HISTORY.md` file.](https://github.com/docpad/docpad-plugin-browserifybundles/blob/master/HISTORY.md#files)

<!-- /HISTORY -->


<!-- CONTRIBUTE/ -->

## Contribute

[Discover how you can contribute by heading on over to the `CONTRIBUTING.md` file.](https://github.com/docpad/docpad-plugin-browserifybundles/blob/master/CONTRIBUTING.md#files)

<!-- /CONTRIBUTE -->


<!-- BACKERS/ -->

## Backers

### Maintainers

These amazing people are maintaining this project:

- Benjamin Lupton <b@lupton.cc> (https://github.com/balupton)

### Sponsors

No sponsors yet! Will you be the first?

[![Gittip donate button](http://img.shields.io/gittip/docpad.png)](https://www.gittip.com/docpad/ "Donate weekly to this project using Gittip")
[![Flattr donate button](http://img.shields.io/flattr/donate.png?color=yellow)](http://flattr.com/thing/344188/balupton-on-Flattr "Donate monthly to this project using Flattr")
[![PayPayl donate button](http://img.shields.io/paypal/donate.png?color=yellow)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=QB8GQPZAH84N6 "Donate once-off to this project using Paypal")
[![BitCoin donate button](http://img.shields.io/bitcoin/donate.png?color=yellow)](https://coinbase.com/checkouts/9ef59f5479eec1d97d63382c9ebcb93a "Donate once-off to this project using BitCoin")

### Contributors

No contributors yet! Will you be the first?
[Discover how you can contribute by heading on over to the `CONTRIBUTING.md` file.](https://github.com/docpad/docpad-plugin-browserifybundles/blob/master/CONTRIBUTING.md#files)

<!-- /BACKERS -->


<!-- LICENSE/ -->

## License

Licensed under the incredibly [permissive](http://en.wikipedia.org/wiki/Permissive_free_software_licence) [MIT license](http://creativecommons.org/licenses/MIT/)

Copyright &copy; 2013+ Bevry Pty Ltd <us@bevry.me> (http://bevry.me)

<!-- /LICENSE -->


