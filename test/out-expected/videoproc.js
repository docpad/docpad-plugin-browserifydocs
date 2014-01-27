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
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvaG9tZS9yb2IvRG9jdW1lbnRzL2RvY3BhZC1wbHVnaW4tYnJvd3NlcmlmeWJ1bmRsZXMvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9ob21lL3JvYi9Eb2N1bWVudHMvZG9jcGFkLXBsdWdpbi1icm93c2VyaWZ5YnVuZGxlcy9ub2RlX21vZHVsZXMvcnRjLXZpZGVvcHJvYy9maWx0ZXJzL2dyYXlzY2FsZS5qcyIsIi9ob21lL3JvYi9Eb2N1bWVudHMvZG9jcGFkLXBsdWdpbi1icm93c2VyaWZ5YnVuZGxlcy9ub2RlX21vZHVsZXMvcnRjLXZpZGVvcHJvYy9pbmRleC5qcyIsIi9ob21lL3JvYi9Eb2N1bWVudHMvZG9jcGFkLXBsdWdpbi1icm93c2VyaWZ5YnVuZGxlcy9ub2RlX21vZHVsZXMvcnRjLXZpZGVvcHJvYy9ub2RlX21vZHVsZXMvZmRvbS9yYWYuanMiLCIvaG9tZS9yb2IvRG9jdW1lbnRzL2RvY3BhZC1wbHVnaW4tYnJvd3NlcmlmeWJ1bmRsZXMvdGVzdC9vdXQvdmlkZW9wcm9jLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGltYWdlRGF0YSkge1xuICB2YXIgY2hhbm5lbHMgPSBpbWFnZURhdGEuZGF0YTtcbiAgdmFyIHJnYiA9IFtdO1xuICB2YXIgcmdiQXZnO1xuICB2YXIgYWxwaGE7XG4gIHZhciBpaTtcblxuICAvLyBjaGVjayB0aGF0IHdlIGhhdmUgY2hhbm5lbHMgaXMgZGl2aXNpYmxlIGJ5IGZvdXIgKGp1c3QgYXMgYSBzYWZldHkpXG4gIGlmIChjaGFubmVscy5sZW5ndGggJSA0ICE9PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gaXRlcmF0ZSB0aHJvdWdoIHRoZSBkYXRhXG4gIC8vIE5PVEU6IGRlY3JlbWVudGluZyBsb29wcyBhcmUgZmFzdCBidXQgeW91IG5lZWQgdG8ga25vdyB0aGF0IHlvdSB3aWxsXG4gIC8vIGhpdCAwIHVzaW5nIHRoaXMgbG9naWMgb3RoZXJ3aXNlIGl0IHdpbGwgcnVuIGZvcmV2ZXIgKG9ubHkgMCBpcyBmYWxzeSlcbiAgZm9yIChpaSA9IGNoYW5uZWxzLmxlbmd0aDsgaWkgLT0gNDsgKSB7XG4gICAgLy8gZ2V0IHRoZSByZ2IgdHVwbGVcbiAgICByZ2IgPSBbY2hhbm5lbHNbaWldLCBjaGFubmVsc1tpaSArIDFdLCBjaGFubmVsc1tpaSArIDJdXTtcblxuICAgIC8vIGdldCB0aGUgYWxwaGEgdmFsdWVcbiAgICBhbHBoYSA9IGNoYW5uZWxzW2lpICsgM107XG5cbiAgICAvLyBjYWxjdWxhdGUgdGhlIHJnYiBhdmVyYWdlXG4gICAgcmdiQXZnID0gKHJnYlswXSArIHJnYlsxXSArIHJnYlsyXSApIC8gMztcblxuICAgIC8vIHVwZGF0ZSB0aGUgdmFsdWVzIHRvIHRoZSByZ2IgYXZlcmFnZVxuICAgIGNoYW5uZWxzW2lpXSA9IGNoYW5uZWxzW2lpICsgMV0gPSBjaGFubmVsc1tpaSArIDJdID0gcmdiQXZnO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59OyIsIi8qIGpzaGludCBub2RlOiB0cnVlICovXG4vKiBnbG9iYWwgZG9jdW1lbnQ6IGZhbHNlICovXG4vKiBnbG9iYWwgSFRNTFZpZGVvRWxlbWVudDogZmFsc2UgKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIERFRkFVTFRfRlBTID0gMjU7XG52YXIgcmFmID0gcmVxdWlyZSgnZmRvbS9yYWYnKTtcblxuLyoqXG4gICMgcnRjLXZpZGVvcHJvY1xuXG4gIFRoaXMgaXMgYSBzbWFsbCBoZWxwZXIgbW9kdWxlIHRoYXQgYWxsb3dzIHlvdSB0byBzdWJzdGl0dXRlIGEgdmlkZW9cbiAgZWxlbWVudCB3aXRoIGEgY2FudmFzIGVsZW1lbnQuICBUaGlzIGNhbiBiZSB1c2VmdWwgd2hlbiB5b3Ugd2FudCB0b1xuICBkbyBwaXhlbCBtYW5pcHVsYXRpb24gb2YgdGhlIHJlbmRlcmVkIGltYWdlcywgb3IgaW4gc2l0dWF0aW9ucyB3aGVuXG4gIGEgdmlkZW8gZWxlbWVudCBkb2VzIG5vdCBiZWhhdmUgYXMgeW91IGV4cGVjdC5cblxuICAjIyBFeGFtcGxlIFVzYWdlXG5cbiAgVGhpcyB3YXMgcHJpbWFyaWx5IHdyaXR0ZW4gdG8gd29yayB3aXRoIHRoZVxuICBbcnRjLW1lZGlhXShodHRwczovL2dpdGh1Yi5jb20vcnRjLWlvL3J0Yy1tZWRpYSkgbGlicmFyeSBzbyBoZXJlJ3MgYW5cbiAgZXhhbXBsZSBvZiBob3cgaXQgd29ya3MgdGhlcmU6XG5cbiAgPDw8IGV4YW1wbGVzL3J0Yy1tZWRpYS5qc1xuXG4gIE5vcm1hbGx5LCB0aGUgYG1lZGlhKCkucmVuZGVyYCBjYWxsIHdpbGwgY3JlYXRlIGEgYDx2aWRlbz5gIGVsZW1lbnQgaW5cbiAgdGhlIHNwZWNpZmllZCB0YXJnZXQgY29udGFpbmVyLiAgSW4gdGhpcyBjYXNlLCBob3dldmVyLCBgcnRjLWNhbnZhc2BcbiAgaW50ZXJjZXB0cyB0aGUgcmVxdWVzdCBhbmQgY3JlYXRlcyBpdCdzIG93biBmYWtlIHZpZGVvIGVsZW1lbnQgdGhhdCBpc1xuICBwYXNzZWQgYmFjayB0byB0aGUgcmVuZGVyIGNhbGwuXG5cbiAgIyMgVXNpbmcgdGhlIFByb2Nlc3NpbmcgUGlwZWxpbmVcblxuICBBIHByb2Nlc3NpbmcgcGlwZWxpbmUgaGFzIGJlZW4gaW5jbHVkZWQgdG8gYXNzaXN0IHdpdGhcbiAgbWFuaXB1bGF0aW5nIHRoZSBjYW52YXMgb24gdGhlIGZseS4gQWRkaW5nIGEgcHJvY2Vzc29yIHRvIHRoZSBwaXBlbGluZSBpc1xuICBzaW1wbHkgYSBtYXR0ZXIgb2YgYWRkaW5nIGEgcGlwZWxpbmUgcHJvY2Vzc29yIGF2YWlsYWJsZSBvbiB0aGUgcmV0dXJuZWRcbiAgZmFrZSB2aWRlbzpcblxuICBgYGBqc1xuICAvLyBhZGQgYSBwcm9jZXNzb3JcbiAgY2FudmFzLnBpcGVsaW5lLmFkZChmdW5jdGlvbihpbWFnZURhdGEpIHtcbiAgICAvLyBleGFtaW5lIHRoZSBwaXhlbCBkYXRhXG5cbiAgICAvLyBpZiB3ZSd2ZSBtb2RpZmllZCB0aGUgcGl4ZWwgZGF0YSBhbmQgd2FudCB0byB3cml0ZSB0aGF0IGJhY2tcbiAgICAvLyB0byB0aGUgY2FudmFzIHRoZW4gd2UgbXVzdCByZXR1cm4gYSB0cnV0aHkgdmFsdWVcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSk7XG4gIGBgYFxuXG4gIEEgbW9yZSBjb21wbGV0ZSBleGFtcGxlIGlzIHNob3duIGJlbG93OlxuXG4gIDw8PCBleGFtcGxlcy9ncmF5c2NhbGUtcHJvZ3JhbW1hdGljLmpzXG5cbiAgIyMjIFVzaW5nIHRoZSBpbnRlcm5hbCBmaWx0ZXJzXG5cbiAgRnJvbSBgcnRjLXZpZGVvcHJvY0AwLjZgIG9ud2FyZHMsIHdlIGhhdmUgYmVndW4gaW5jbHVkaW5nIHNvbWUgc2ltcGxlXG4gIGZpbHRlcnMgYXMgcGFydCBvZiB0aGUgbGlicmFyeSwgd2hpY2ggY2FuIGJlIHVzZWQgYnkgc2ltcGx5IHJlcXVpcmluZ1xuICBgcnRjLXZpZGVvcHJvYy9maWx0ZXJzLyVmaWx0ZXJuYW1lJWAgYW5kIGxldHRpbmcgYnJvd3NlcmlmeSBkbyB0aGUgcmVzdC5cblxuICBBbiBleGFtcGxlIG9mIGRvaW5nIGEgZ3JheXNjYWxlIHRyYW5zZm9ybWF0aW9uIHVzaW5nIHRoZSBpbnRlcm5hbFxuICBmaWx0ZXJzIGlzIHNob3duIGJlbG93OlxuXG4gIDw8PCBleGFtcGxlcy9ncmF5c2NhbGUtZmlsdGVyLmpzXG5cbiAgIyMgTGlzdGVuaW5nIGZvciBjdXN0b20gYGZyYW1lYCBldmVudHNcblxuICBJbiBhZGRpdGlvbiB0byBwcm92aWRpbmcgdGhlIG9wcG9ydHVuaXR5IHRvIGFuYWx5c2UgYW5kIG1vZGlmeSBwaXhlbCBkYXRhXG4gIHRoZSBgcnRjLWNhbnZhc2AgbW9kdWxlIGFsc28gcHJvdmlkZXMgdGhlIGEgY3VzdG9tIGBmcmFtZWAgZXZlbnQgZm9yXG4gIGRldGVjdGluZyB3aGVuIGEgbmV3IGZyYW1lIGhhcyBiZWVuIGRyYXduIHRvIHRoZSBjYW52YXMuXG5cbiAgQSBzaW1wbGUgZXhhbXBsZSBjYW4gYmUgZm91bmQgYmVsb3c6XG5cbiAgPDw8IGV4YW1wbGVzL2ZyYW1lbGlzdGVuZXIuanNcblxuICAjIyBBIE5vdGUgd2l0aCBSZWdhcmRzIHRvIENQVSBVc2FnZVxuXG4gIEJ5IGRlZmF1bHQgcnRjLWNhbnZhcyB3aWxsIGRyYXcgYXQgMjVmcHMgYnV0IHRoaXMgY2FuIGJlIG1vZGlmaWVkIHRvIGNhcHR1cmVcbiAgYXQgYSBsb3dlciBmcmFtZSByYXRlIGZvciBzbG93ZXIgZGV2aWNlcywgb3IgaW5jcmVhc2VkIGlmIHlvdSBoYXZlIGFcbiAgbWFjaGluZSB3aXRoIHBsZW50eSBvZiBncnVudC5cblxuICAjIyBSZWZlcmVuY2VcblxuICAjIyMgY2FudmFzKHRhcmdldCwgb3B0cylcblxuICBDcmVhdGUgYSBmYWtlIHZpZGVvIGVsZW1lbnQgZm9yIHRoZSBzcGVjaWZpZWQgdGFyZ2V0IGVsZW1lbnQuXG5cbiAgLSBgZnBzYCAtIHRoZSByZWRyYXcgcmF0ZSBvZiB0aGUgZmFrZSB2aWRlbyAoZGVmYXVsdCA9IDI1KVxuXG4qKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odGFyZ2V0LCBvcHRzKSB7XG4gIHZhciBjYW52YXMgPSAodGFyZ2V0IGluc3RhbmNlb2YgSFRNTENhbnZhc0VsZW1lbnQpID9cbiAgICB0YXJnZXQgOlxuICAgIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuXG4gIHZhciB2aWQgPSAodGFyZ2V0IGluc3RhbmNlb2YgSFRNTFZpZGVvRWxlbWVudCkgP1xuICAgIHRhcmdldCA6XG4gICAgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndmlkZW8nKTtcblxuICAvLyBpZiB0aGUgdGFyZ2V0IGlzIGEgdmlkZW9cbiAgaWYgKHRhcmdldCA9PT0gdmlkKSB7XG4gICAgLy8gaW5zZXJ0IHRoZSBjYW52YXMgdG8gdGhlIHZpZGVvIHBhcmVudCBlbGVtZW50XG4gICAgdmlkLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGNhbnZhcywgdmlkKTtcbiAgfVxuICAvLyBvdGhlcndpc2UsIGlmIHRoZSB0YXJnZXQgd2FzIG5vdCBhIGNhbnZhcyBhZGQgdGhlIGNhbnZhcyB0byB0aGUgdGFyZ2V0XG4gIGVsc2UgaWYgKHRhcmdldCAhPT0gY2FudmFzKSB7XG4gICAgLy8gYXBwZW5kIHRoZSBjYW52YXMgdG8gdGhlIHRhcmdldFxuICAgIHRhcmdldC5hcHBlbmRDaGlsZChjYW52YXMpO1xuICB9XG5cbiAgLy8gaW5pdGlhbGlzZSB0aGUgY2FudmFzIHdpZHRoIGFuZCBoZWlnaHRcbiAgY2FudmFzLndpZHRoID0gKG9wdHMgfHwge30pLndpZHRoIHx8IDA7XG4gIGNhbnZhcy5oZWlnaHQgPSAob3B0cyB8fCB7fSkuaGVpZ2h0IHx8IDA7XG5cbiAgLy8gaGlkZSB0aGUgdmlkZW8gZWxlbWVudFxuICB2aWQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblxuICAvLyBpbml0aWFsaXNlIHRoZSBjYW52YXMgcGlwZWxpbmVcbiAgY2FudmFzLnBpcGVsaW5lID0gY3JlYXRlRmFjYWRlKGNhbnZhcywgdmlkLCBvcHRzKTtcblxuICByZXR1cm4gY2FudmFzO1xufTtcblxuLypcbiAgIyMjIGNyZWF0ZUZhY2FkZShjYW52YXMsIHZpZCkgPT0+IEV2ZW50RW1pdHRlclxuXG4gIEluamVjdCB0aGUgcmVxdWlyZWQgZmFrZSBwcm9wZXJ0aWVzIG9udG8gdGhlIGNhbnZhcyBhbmQgcmV0dXJuIGFcbiAgbm9kZS1zdHlsZSBFdmVudEVtaXR0ZXIgdGhhdCB3aWxsIHByb3ZpZGUgdXBkYXRlcyBvbiB3aGVuIHRoZSBwcm9wZXJ0aWVzXG4gIGNoYW5nZS5cblxuKi9cbmZ1bmN0aW9uIGNyZWF0ZUZhY2FkZShjYW52YXMsIHZpZCwgb3B0cykge1xuICB2YXIgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICB2YXIgcGxheWluZyA9IGZhbHNlO1xuICB2YXIgbGFzdFRpY2sgPSAwO1xuICB2YXIgdGljaztcblxuICAvLyBpbml0aWFsaXNlIGZwc1xuICB2YXIgZnBzID0gKG9wdHMgfHwge30pLmZwcyB8fCBERUZBVUxUX0ZQUztcblxuICAvLyBjYWxhY3VsYXRlIHRoZSBkcmF3IGRlbGF5LCBjbGFtcCBhcyBpbnRcbiAgdmFyIGRyYXdEZWxheSA9ICgxMDAwIC8gZnBzKSB8IDA7XG4gIHZhciBkcmF3V2lkdGg7XG4gIHZhciBkcmF3SGVpZ2h0O1xuICB2YXIgZHJhd1ggPSAwO1xuICB2YXIgZHJhd1kgPSAwO1xuICB2YXIgZHJhd0RhdGE7XG5cbiAgdmFyIHByb2Nlc3NvcnMgPSBbXTtcbiAgdmFyIHBJZHg7XG4gIHZhciBwQ291bnQgPSAwO1xuICB2YXIgdHJpZ2dlckZyYW1lRXZlbnQgPSB0eXBlb2YgQ3VzdG9tRXZlbnQgIT0gJ3VuZGVmaW5lZCc7XG5cbiAgZnVuY3Rpb24gYWRkUHJvY2Vzc29yKHByb2Nlc3Nvcikge1xuICAgIHBDb3VudCA9IHByb2Nlc3NvcnMucHVzaChwcm9jZXNzb3IpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVkcmF3KHRpY2spIHtcbiAgICB2YXIgaW1hZ2VEYXRhO1xuICAgIHZhciB0d2Vha2VkO1xuICAgIHZhciBldnQ7XG4gICAgdmFyIHBvc3RQcm9jZXNzRXZ0O1xuXG4gICAgaWYgKCEgcGxheWluZykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIGdldCB0aGUgY3VycmVudCB0aWNrXG4gICAgdGljayA9IHRpY2sgfHwgRGF0ZS5ub3coKTtcblxuICAgIC8vIG9ubHkgZHJhdyBhcyBvZnRlbiBhcyBzcGVjaWZpZWQgaW4gdGhlIGZwc1xuICAgIGlmICh0aWNrIC0gbGFzdFRpY2sgPiBkcmF3RGVsYXkpIHtcbiAgICAgIC8vIGRyYXcgdGhlIGltYWdlXG4gICAgICBjb250ZXh0LmRyYXdJbWFnZSh2aWQsIGRyYXdYLCBkcmF3WSwgZHJhd1dpZHRoLCBkcmF3SGVpZ2h0KTtcblxuICAgICAgLy8gY3JlYXRlIHRoZSBmcmFtZSBldmVudFxuICAgICAgZXZ0ID0gdHJpZ2dlckZyYW1lRXZlbnQgJiYgbmV3IEN1c3RvbUV2ZW50KCdmcmFtZScsIHtcbiAgICAgICAgZGV0YWlsOiB7XG4gICAgICAgICAgdGljazogdGlja1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgLy8gaWYgd2UgaGF2ZSB0aGUgZnJhbWUgZXZlbnQgdGhlbiBkaXNwYXRjaFxuICAgICAgaWYgKGV2dCkge1xuICAgICAgICBjYW52YXMuZGlzcGF0Y2hFdmVudChldnQpO1xuICAgICAgfVxuXG4gICAgICAvLyBpZiB3ZSBoYXZlIHByb2Nlc3NvcnMsIGdldCB0aGUgaW1hZ2UgZGF0YSBhbmQgcGFzcyBpdCB0aHJvdWdoXG4gICAgICBpZiAocENvdW50KSB7XG4gICAgICAgIGltYWdlRGF0YSA9IGNvbnRleHQuZ2V0SW1hZ2VEYXRhKDAsIDAsIGRyYXdXaWR0aCwgZHJhd0hlaWdodCk7XG4gICAgICAgIHR3ZWFrZWQgPSBmYWxzZTtcblxuICAgICAgICAvLyBpdGVyYXRlIHRocm91Z2ggdGhlIHByb2Nlc3NvcnNcbiAgICAgICAgZm9yIChwSWR4ID0gMDsgcElkeCA8IHBDb3VudDsgcElkeCsrKSB7XG4gICAgICAgICAgLy8gY2FsbCB0aGUgcHJvY2Vzc29yLCBhbmQgYWxsb3cgaXQgdG8gdGVsbCB1cyBpZiBpdCBoYXMgbW9kaWZpZWRcbiAgICAgICAgICAvLyB0aGUgcGlwZWxpbmVcbiAgICAgICAgICB0d2Vha2VkID0gcHJvY2Vzc29yc1twSWR4XShpbWFnZURhdGEsIGNvbnRleHQsIGNhbnZhcywgZHJhd0RhdGEpIHx8XG4gICAgICAgICAgICB0d2Vha2VkO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR3ZWFrZWQpIHtcbiAgICAgICAgICAvLyBUT0RPOiBkaXJ0eSBhcmVhXG4gICAgICAgICAgY29udGV4dC5wdXRJbWFnZURhdGEoaW1hZ2VEYXRhLCAwLCAwKTtcblxuICAgICAgICAgIC8vIHRyaWdnZXIgYW4gZXZlbnQgZm9yIGdldHRpbmcgdGhlIHBvc3QgcHJvY2Vzc2VkIGRhdGFcbiAgICAgICAgICBwb3N0UHJvY2Vzc0V2dCA9IHRyaWdnZXJGcmFtZUV2ZW50ICYmIG5ldyBDdXN0b21FdmVudCgncG9zdHByb2Nlc3MnKTtcbiAgICAgICAgICBpZiAocG9zdFByb2Nlc3NFdnQpIHtcbiAgICAgICAgICAgIGNhbnZhcy5kaXNwYXRjaEV2ZW50KHBvc3RQcm9jZXNzRXZ0KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gdXBkYXRlIHRoZSBsYXN0IHRpY2tcbiAgICAgIGxhc3RUaWNrID0gdGljaztcbiAgICB9XG5cbiAgICAvLyBxdWV1ZSB1cCBhbm90aGVyIHJlZHJhd1xuICAgIHJhZihyZWRyYXcpO1xuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlUGxheWluZygpIHtcbiAgICB2YXIgc2NhbGU7XG4gICAgdmFyIHNjYWxlWDtcbiAgICB2YXIgc2NhbGVZO1xuXG4gICAgLy8gc2V0IHRoZSBjYW52YXMgdGhlIHJpZ2h0IHNpemUgKGlmIG5vdCBhbHJlYWR5IGluaXRpYWxpemVkKVxuICAgIGlmIChjYW52YXMud2lkdGggPT09IDAgfHwgY2FudmFzLmhlaWdodCA9PT0gMCkge1xuICAgICAgY2FudmFzLndpZHRoID0gdmlkLnZpZGVvV2lkdGg7XG4gICAgICBjYW52YXMuaGVpZ2h0ID0gdmlkLnZpZGVvSGVpZ2h0O1xuICAgIH1cblxuICAgIC8vIGlmIGVpdGhlciB3aWR0aCBvciBoZWlnaHQgPT09IDAgdGhlbiBiYWlsXG4gICAgaWYgKGNhbnZhcy53aWR0aCA9PT0gMCB8fCBjYW52YXMuaGVpZ2h0ID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gY2FsY3VsYXRlIHJlcXVpcmVkIHNjYWxpbmdcbiAgICBzY2FsZSA9IE1hdGgubWluKFxuICAgICAgc2NhbGVYID0gKGNhbnZhcy53aWR0aCAvIHZpZC52aWRlb1dpZHRoKSxcbiAgICAgIHNjYWxlWSA9IChjYW52YXMuaGVpZ2h0IC8gdmlkLnZpZGVvSGVpZ2h0KVxuICAgICk7XG5cbiAgICAvLyBjYWxjdWxhdGUgdGhlIHNjYWxlZCBkcmF3IHdpZHRoIGFuZCBoZWlnaHRcbiAgICBkcmF3V2lkdGggPSAodmlkLnZpZGVvV2lkdGggKiBzY2FsZSkgfCAwO1xuICAgIGRyYXdIZWlnaHQgPSAodmlkLnZpZGVvSGVpZ2h0ICogc2NhbGUpIHwgMDtcblxuICAgIC8vIGNhbGN1bGF0ZSB0aGUgb2Zmc2V0WCBhbmQgWVxuICAgIGRyYXdYID0gKGNhbnZhcy53aWR0aCAtIGRyYXdXaWR0aCkgPj4gMTtcbiAgICBkcmF3WSA9IChjYW52YXMuaGVpZ2h0IC0gZHJhd0hlaWdodCkgPj4gMTtcblxuICAgIC8vIHNhdmUgdGhlIGRyYXcgZGF0YVxuICAgIGRyYXdEYXRhID0ge1xuICAgICAgeDogZHJhd1gsXG4gICAgICB5OiBkcmF3WSxcbiAgICAgIHdpZHRoOiBkcmF3V2lkdGgsXG4gICAgICBoZWlnaHQ6IGRyYXdIZWlnaHRcbiAgICB9O1xuXG4gICAgLy8gZmxhZyBhcyBwbGF5aW5nXG4gICAgcGxheWluZyA9IHRydWU7XG5cbiAgICAvLyBzdGFydCB0aGUgYW5pbWF0aW9uIGxvb3BcbiAgICByYWYocmVkcmF3KTtcbiAgfVxuXG4gIHZpZC5hZGRFdmVudExpc3RlbmVyKCdwbGF5aW5nJywgaGFuZGxlUGxheWluZyk7XG5cbiAgLy8gaW5qZWN0IHRoZSBmYWtlIHByb3BlcnRpZXNcbiAgWydtb3pTcmNPYmplY3QnLCAnc3JjJ10uZm9yRWFjaChmdW5jdGlvbihwcm9wKSB7XG4gICAgaWYgKHR5cGVvZiB2aWRbcHJvcF0gPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoY2FudmFzLCBwcm9wLCB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdmlkW3Byb3BdO1xuICAgICAgfSxcblxuICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICB2aWRbcHJvcF0gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cbiAgLy8gYWRkIGEgZmFrZSBwbGF5IGZ1bmN0aW9uXG4gIGNhbnZhcy5wbGF5ID0gZnVuY3Rpb24oKSB7XG4gICAgLy8gcGxheSB0aGUgdmlkZW9cbiAgICB2aWQucGxheSgpO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgYWRkOiBhZGRQcm9jZXNzb3JcbiAgfTtcbn0iLCIvKiBqc2hpbnQgbm9kZTogdHJ1ZSAqL1xuLyogZ2xvYmFsIHdpbmRvdzogZmFsc2UgKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIFRFU1RfUFJPUFMgPSBbJ3InLCAnd2Via2l0UicsICdtb3pSJywgJ29SJywgJ21zUiddO1xuXG4vKipcbiAgIyMjIHJhZihjYWxsYmFjaylcblxuICBSZXF1ZXN0IGFuaW1hdGlvbiBmcmFtZSBoZWxwZXIuXG5cbiAgPDw8IGV4YW1wbGVzL3JhZi5qc1xuXG4qKi9cblxubW9kdWxlLmV4cG9ydHMgPSB0eXBlb2Ygd2luZG93ICE9ICd1bmRlZmluZWQnICYmIChmdW5jdGlvbigpIHtcbiAgZm9yICh2YXIgaWkgPSAwOyBpaSA8IFRFU1RfUFJPUFMubGVuZ3RoOyBpaSsrKSB7XG4gICAgd2luZG93LmFuaW1GcmFtZSA9IHdpbmRvdy5hbmltRnJhbWUgfHxcbiAgICAgIHdpbmRvd1tURVNUX1BST1BTW2lpXSArICdlcXVlc3RBbmltYXRpb25GcmFtZSddO1xuICB9IC8vIGZvclxuXG4gIHJldHVybiBhbmltRnJhbWU7XG59KSgpOyIsIi8vIG91ciBjb2RlXG52YXIgdmlkZW9wcm9jID0gcmVxdWlyZSgncnRjLXZpZGVvcHJvYycpO1xudmFyIGdyYXlzY2FsZSA9IHJlcXVpcmUoJ3J0Yy12aWRlb3Byb2MvZmlsdGVycy9ncmF5c2NhbGUnKTsiXX0=
