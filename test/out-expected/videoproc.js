(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function(imageData) {
  var channels = imageData.data;
  var rgb = [];
  var rgbAvg;
  var alpha;
  var ii;

  // check that we have channels is divisible by four (just as a safety)
  if (channels.length % 4 !== 0) {
    return;
  }

  // iterate through the data
  // NOTE: decrementing loops are fast but you need to know that you will
  // hit 0 using this logic otherwise it will run forever (only 0 is falsy)
  for (ii = channels.length; ii -= 4; ) {
    // get the rgb tuple
    rgb = [channels[ii], channels[ii + 1], channels[ii + 2]];

    // get the alpha value
    alpha = channels[ii + 3];

    // calculate the rgb average
    rgbAvg = (rgb[0] + rgb[1] + rgb[2] ) / 3;

    // update the values to the rgb average
    channels[ii] = channels[ii + 1] = channels[ii + 2] = rgbAvg;
  }

  return true;
};
},{}],2:[function(require,module,exports){
/* jshint node: true */
/* global document: false */
/* global HTMLVideoElement: false */
'use strict';

var DEFAULT_FPS = 25;
var raf = require('fdom/raf');

/**
  # rtc-videoproc

  This is a small helper module that allows you to substitute a video
  element with a canvas element.  This can be useful when you want to
  do pixel manipulation of the rendered images, or in situations when
  a video element does not behave as you expect.

  ## Example Usage

  This was primarily written to work with the
  [rtc-media](https://github.com/rtc-io/rtc-media) library so here's an
  example of how it works there:

  <<< examples/rtc-media.js

  Normally, the `media().render` call will create a `<video>` element in
  the specified target container.  In this case, however, `rtc-canvas`
  intercepts the request and creates it's own fake video element that is
  passed back to the render call.

  ## Using the Processing Pipeline

  A processing pipeline has been included to assist with
  manipulating the canvas on the fly. Adding a processor to the pipeline is
  simply a matter of adding a pipeline processor available on the returned
  fake video:

  ```js
  // add a processor
  canvas.pipeline.add(function(imageData) {
    // examine the pixel data

    // if we've modified the pixel data and want to write that back
    // to the canvas then we must return a truthy value
    return true;
  });
  ```

  A more complete example is shown below:

  <<< examples/grayscale-programmatic.js

  ### Using the internal filters

  From `rtc-videoproc@0.6` onwards, we have begun including some simple
  filters as part of the library, which can be used by simply requiring
  `rtc-videoproc/filters/%filtername%` and letting browserify do the rest.

  An example of doing a grayscale transformation using the internal
  filters is shown below:

  <<< examples/grayscale-filter.js

  ## Listening for custom `frame` events

  In addition to providing the opportunity to analyse and modify pixel data
  the `rtc-canvas` module also provides the a custom `frame` event for
  detecting when a new frame has been drawn to the canvas.

  A simple example can be found below:

  <<< examples/framelistener.js

  ## A Note with Regards to CPU Usage

  By default rtc-canvas will draw at 25fps but this can be modified to capture
  at a lower frame rate for slower devices, or increased if you have a
  machine with plenty of grunt.

  ## Reference

  ### canvas(target, opts)

  Create a fake video element for the specified target element.

  - `fps` - the redraw rate of the fake video (default = 25)

**/
module.exports = function(target, opts) {
  var canvas = (target instanceof HTMLCanvasElement) ?
    target :
    document.createElement('canvas');

  var vid = (target instanceof HTMLVideoElement) ?
    target :
    document.createElement('video');

  // if the target is a video
  if (target === vid) {
    // insert the canvas to the video parent element
    vid.parentNode.insertBefore(canvas, vid);
  }
  // otherwise, if the target was not a canvas add the canvas to the target
  else if (target !== canvas) {
    // append the canvas to the target
    target.appendChild(canvas);
  }

  // initialise the canvas width and height
  canvas.width = (opts || {}).width || 0;
  canvas.height = (opts || {}).height || 0;

  // hide the video element
  vid.style.display = 'none';

  // initialise the canvas pipeline
  canvas.pipeline = createFacade(canvas, vid, opts);

  return canvas;
};

/*
  ### createFacade(canvas, vid) ==> EventEmitter

  Inject the required fake properties onto the canvas and return a
  node-style EventEmitter that will provide updates on when the properties
  change.

*/
function createFacade(canvas, vid, opts) {
  var context = canvas.getContext('2d');
  var playing = false;
  var lastTick = 0;
  var tick;

  // initialise fps
  var fps = (opts || {}).fps || DEFAULT_FPS;

  // calaculate the draw delay, clamp as int
  var drawDelay = (1000 / fps) | 0;
  var drawWidth;
  var drawHeight;
  var drawX = 0;
  var drawY = 0;
  var drawData;

  var processors = [];
  var pIdx;
  var pCount = 0;
  var triggerFrameEvent = typeof CustomEvent != 'undefined';

  function addProcessor(processor) {
    pCount = processors.push(processor);
  }

  function redraw(tick) {
    var imageData;
    var tweaked;
    var evt;
    var postProcessEvt;

    if (! playing) {
      return;
    }

    // get the current tick
    tick = tick || Date.now();

    // only draw as often as specified in the fps
    if (tick - lastTick > drawDelay) {
      // draw the image
      context.drawImage(vid, drawX, drawY, drawWidth, drawHeight);

      // create the frame event
      evt = triggerFrameEvent && new CustomEvent('frame', {
        detail: {
          tick: tick
        }
      });

      // if we have the frame event then dispatch
      if (evt) {
        canvas.dispatchEvent(evt);
      }

      // if we have processors, get the image data and pass it through
      if (pCount) {
        imageData = context.getImageData(0, 0, drawWidth, drawHeight);
        tweaked = false;

        // iterate through the processors
        for (pIdx = 0; pIdx < pCount; pIdx++) {
          // call the processor, and allow it to tell us if it has modified
          // the pipeline
          tweaked = processors[pIdx](imageData, context, canvas, drawData) ||
            tweaked;
        }

        if (tweaked) {
          // TODO: dirty area
          context.putImageData(imageData, 0, 0);

          // trigger an event for getting the post processed data
          postProcessEvt = triggerFrameEvent && new CustomEvent('postprocess');
          if (postProcessEvt) {
            canvas.dispatchEvent(postProcessEvt);
          }
        }
      }

      // update the last tick
      lastTick = tick;
    }

    // queue up another redraw
    raf(redraw);
  }

  function handlePlaying() {
    var scale;
    var scaleX;
    var scaleY;

    // set the canvas the right size (if not already initialized)
    if (canvas.width === 0 || canvas.height === 0) {
      canvas.width = vid.videoWidth;
      canvas.height = vid.videoHeight;
    }

    // if either width or height === 0 then bail
    if (canvas.width === 0 || canvas.height === 0) {
      return;
    }

    // calculate required scaling
    scale = Math.min(
      scaleX = (canvas.width / vid.videoWidth),
      scaleY = (canvas.height / vid.videoHeight)
    );

    // calculate the scaled draw width and height
    drawWidth = (vid.videoWidth * scale) | 0;
    drawHeight = (vid.videoHeight * scale) | 0;

    // calculate the offsetX and Y
    drawX = (canvas.width - drawWidth) >> 1;
    drawY = (canvas.height - drawHeight) >> 1;

    // save the draw data
    drawData = {
      x: drawX,
      y: drawY,
      width: drawWidth,
      height: drawHeight
    };

    // flag as playing
    playing = true;

    // start the animation loop
    raf(redraw);
  }

  vid.addEventListener('playing', handlePlaying);

  // inject the fake properties
  ['mozSrcObject', 'src'].forEach(function(prop) {
    if (typeof vid[prop] == 'undefined') {
      return;
    }

    Object.defineProperty(canvas, prop, {
      get: function() {
        return vid[prop];
      },

      set: function(value) {
        vid[prop] = value;
      }
    });
  });

  // add a fake play function
  canvas.play = function() {
    // play the video
    vid.play();
  };

  return {
    add: addProcessor
  };
}
},{"fdom/raf":3}],3:[function(require,module,exports){
/* jshint node: true */
/* global window: false */
'use strict';

var TEST_PROPS = ['r', 'webkitR', 'mozR', 'oR', 'msR'];

/**
  ### raf(callback)

  Request animation frame helper.

  <<< examples/raf.js

**/

module.exports = typeof window != 'undefined' && (function() {
  for (var ii = 0; ii < TEST_PROPS.length; ii++) {
    window.animFrame = window.animFrame ||
      window[TEST_PROPS[ii] + 'equestAnimationFrame'];
  } // for

  return animFrame;
})();
},{}],4:[function(require,module,exports){
// our code
var videoproc = require('rtc-videoproc');
var grayscale = require('rtc-videoproc/filters/grayscale');
},{"rtc-videoproc":2,"rtc-videoproc/filters/grayscale":1}]},{},[4])