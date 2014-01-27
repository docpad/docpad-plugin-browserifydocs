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

Convention: `.js.anything`


## Install

```
docpad install browserifybundles
```


## Configure

### Defaults

The default configuration for this plugin is the equivalant of adding the following [browserify options](https://github.com/substack/node-browserify#bbundleopts-cb) to your [DocPad configuration file](http://docpad.org/docs/config):

``` coffee
plugins:
	browserifybundles:
		debug: false
```

### Usage

Create a JavaScript file with the *browserify* option:

``` javascript
---
browserify: true
---

var mypackage = require('mypackage');
```

### Require

Make certain files available from outside the bundle by using [require](https://github.com/substack/node-browserify#brequirefile-opts):

``` javascript
---
browserify:
	require:
		'./vendor/angular/angular.js':
			expose: 'angular'
---

var angular = require('angular');
```

### Ignore

Prevent a module or file from showing up in the output bundle by using [ignore](https://github.com/substack/node-browserify#bignorefile):

``` javascript
---
browserify:
	ignore: ['jquery']
---

var jquery = require('jquery');
```

### External

Prevent a file or module from being loaded into the current bundle, instead referencing from another bundle, by using [external](https://github.com/substack/node-browserify#bexternalfile).

``` javascript
---
browserify:
	external: ['jquery']
---

var jquery = require('jquery');
```

### Exclude

Prevent a module name or file from showing up in the output bundle by using [exclude](https://github.com/substack/node-browserify#bexcludefile).

``` javascript
---
browserify:
	exclude: ['jquery']
---

var jquery = require('jquery');
```


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


