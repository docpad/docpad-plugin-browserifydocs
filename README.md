# Browserify Documents for DocPad

<!-- BADGES/ -->

[![Build Status](https://img.shields.io/travis/docpad/docpad-plugin-browserifydocs/master.svg)](http://travis-ci.org/docpad/docpad-plugin-browserifydocs "Check this project's build status on TravisCI")
[![NPM version](https://img.shields.io/npm/v/docpad-plugin-browserifydocs.svg)](https://npmjs.org/package/docpad-plugin-browserifydocs "View this project on NPM")
[![NPM downloads](https://img.shields.io/npm/dm/docpad-plugin-browserifydocs.svg)](https://npmjs.org/package/docpad-plugin-browserifydocs "View this project on NPM")
[![Dependency Status](https://img.shields.io/david/docpad/docpad-plugin-browserifydocs.svg)](https://david-dm.org/docpad/docpad-plugin-browserifydocs)
[![Dev Dependency Status](https://img.shields.io/david/dev/docpad/docpad-plugin-browserifydocs.svg)](https://david-dm.org/docpad/docpad-plugin-browserifydocs#info=devDependencies)<br/>
[![Gratipay donate button](https://img.shields.io/gratipay/docpad.svg)](https://www.gratipay.com/docpad/ "Donate weekly to this project using Gratipay")
[![Flattr donate button](https://img.shields.io/badge/flattr-donate-yellow.svg)](http://flattr.com/thing/344188/balupton-on-Flattr "Donate monthly to this project using Flattr")
[![PayPayl donate button](https://img.shields.io/badge/paypal-donate-yellow.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=QB8GQPZAH84N6 "Donate once-off to this project using Paypal")
[![BitCoin donate button](https://img.shields.io/badge/bitcoin-donate-yellow.svg)](https://coinbase.com/checkouts/9ef59f5479eec1d97d63382c9ebcb93a "Donate once-off to this project using BitCoin")
[![Wishlist browse button](https://img.shields.io/badge/wishlist-donate-yellow.svg)](http://amzn.com/w/2F8TXKSNAFG4V "Buy an item on our wishlist for us")

<!-- /BADGES -->


Browserify your documents by adding the `browserify: true` meta data


## Install

```
docpad install browserifydocs
```


## Usage

Create a JavaScript file with the *browserify* option:

``` javascript
---
browserify: true
---

var mypackage = require('mypackage');
```


## Configure

### Defaults

The default configuration for this plugin is the equivalant of adding the following [browserify options](https://github.com/substack/node-browserify#bbundleopts-cb) to your [DocPad configuration file](http://docpad.org/docs/config):

``` coffee
plugins:
	browserifydocs:
		debug: false
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
[Discover the change history by heading on over to the `HISTORY.md` file.](https://github.com/docpad/docpad-plugin-browserifydocs/blob/master/HISTORY.md#files)

<!-- /HISTORY -->


<!-- CONTRIBUTE/ -->

## Contribute

[Discover how you can contribute by heading on over to the `CONTRIBUTING.md` file.](https://github.com/docpad/docpad-plugin-browserifydocs/blob/master/CONTRIBUTING.md#files)

<!-- /CONTRIBUTE -->


<!-- BACKERS/ -->

## Backers

### Maintainers

These amazing people are maintaining this project:

- Benjamin Lupton <b@lupton.cc> (https://github.com/balupton)
- Rob Loach <robloach@gmail.com> (https://github.com/RobLoach)

### Sponsors

No sponsors yet! Will you be the first?

[![Gratipay donate button](https://img.shields.io/gratipay/docpad.svg)](https://www.gratipay.com/docpad/ "Donate weekly to this project using Gratipay")
[![Flattr donate button](https://img.shields.io/badge/flattr-donate-yellow.svg)](http://flattr.com/thing/344188/balupton-on-Flattr "Donate monthly to this project using Flattr")
[![PayPayl donate button](https://img.shields.io/badge/paypal-donate-yellow.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=QB8GQPZAH84N6 "Donate once-off to this project using Paypal")
[![BitCoin donate button](https://img.shields.io/badge/bitcoin-donate-yellow.svg)](https://coinbase.com/checkouts/9ef59f5479eec1d97d63382c9ebcb93a "Donate once-off to this project using BitCoin")
[![Wishlist browse button](https://img.shields.io/badge/wishlist-donate-yellow.svg)](http://amzn.com/w/2F8TXKSNAFG4V "Buy an item on our wishlist for us")

### Contributors

These amazing people have contributed code to this project:

- [Benjamin Lupton](https://github.com/balupton) <b@lupton.cc> — [view contributions](https://github.com/docpad/docpad-plugin-browserifydocs/commits?author=balupton)
- [Rob Loach](https://github.com/RobLoach) <robloach@gmail.com> — [view contributions](https://github.com/docpad/docpad-plugin-browserifydocs/commits?author=RobLoach)

[Become a contributor!](https://github.com/docpad/docpad-plugin-browserifydocs/blob/master/CONTRIBUTING.md#files)

<!-- /BACKERS -->


<!-- LICENSE/ -->

## License

Unless stated otherwise all works are:

- Copyright &copy; 2014+ Bevry Pty Ltd <us@bevry.me> (http://bevry.me)

and licensed under:

- The incredibly [permissive](http://en.wikipedia.org/wiki/Permissive_free_software_licence) [MIT License](http://opensource.org/licenses/mit-license.php)

<!-- /LICENSE -->


