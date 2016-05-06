(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
/*
 * Copyright 2015 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var Emitter = _dereq_('./emitter.js');
var Modes = _dereq_('./modes.js');
var Util = _dereq_('./util.js');

/**
 * Everything having to do with the WebVR button.
 * Emits a 'click' event when it's clicked.
 */
function ButtonManager(opt_root) {
  var root = opt_root || document.body;
  this.loadIcons_();

  // Make the fullscreen button.
  var fsButton = this.createButton();
  fsButton.src = this.ICONS.fullscreen;
  fsButton.title = 'Fullscreen mode';
  var s = fsButton.style;
  s.bottom = 0;
  s.right = 0;
  fsButton.addEventListener('click', this.createClickHandler_('fs'));
  root.appendChild(fsButton);
  this.fsButton = fsButton;

  // Make the VR button.
  var vrButton = this.createButton();
  vrButton.src = this.ICONS.cardboard;
  vrButton.title = 'Virtual reality mode';
  var s = vrButton.style;
  s.bottom = 0;
  s.right = '48px';
  vrButton.addEventListener('click', this.createClickHandler_('vr'));
  root.appendChild(vrButton);
  this.vrButton = vrButton;

  this.isVisible = true;

}
ButtonManager.prototype = new Emitter();

ButtonManager.prototype.createButton = function() {
  var button = document.createElement('img');
  button.className = 'webvr-button';
  var s = button.style;
  s.position = 'fixed';
  s.width = '24px'
  s.height = '24px';
  s.backgroundSize = 'cover';
  s.backgroundColor = 'transparent';
  s.border = 0;
  s.userSelect = 'none';
  s.webkitUserSelect = 'none';
  s.MozUserSelect = 'none';
  s.cursor = 'pointer';
  s.padding = '12px';
  s.zIndex = 1;
  s.display = 'none';
  s.boxSizing = 'content-box';

  // Prevent button from being selected and dragged.
  button.draggable = false;
  button.addEventListener('dragstart', function(e) {
    e.preventDefault();
  });

  // Style it on hover.
  button.addEventListener('mouseenter', function(e) {
    s.filter = s.webkitFilter = 'drop-shadow(0 0 5px rgba(255,255,255,1))';
  });
  button.addEventListener('mouseleave', function(e) {
    s.filter = s.webkitFilter = '';
  });
  return button;
};

ButtonManager.prototype.setMode = function(mode, isVRCompatible) {
  isVRCompatible = isVRCompatible || WebVRConfig.FORCE_ENABLE_VR;
  if (!this.isVisible) {
    return;
  }
  switch (mode) {
    case Modes.NORMAL:
      this.fsButton.style.display = 'block';
      this.fsButton.src = this.ICONS.fullscreen;
      this.vrButton.style.display = (isVRCompatible ? 'block' : 'none');
      break;
    case Modes.MAGIC_WINDOW:
      this.fsButton.style.display = 'block';
      this.fsButton.src = this.ICONS.exitFullscreen;
      this.vrButton.style.display = (isVRCompatible ? 'block' : 'none');
      break;
    case Modes.VR:
      this.fsButton.style.display = 'none';
      this.vrButton.style.display = 'none';
      break;
  }

  // Hack for Safari Mac/iOS to force relayout (svg-specific issue)
  // http://goo.gl/hjgR6r
  var oldValue = this.fsButton.style.display;
  this.fsButton.style.display = 'inline-block';
  this.fsButton.offsetHeight;
  this.fsButton.style.display = oldValue;
};

ButtonManager.prototype.setVisibility = function(isVisible) {
  this.isVisible = isVisible;
  this.fsButton.style.display = isVisible ? 'block' : 'none';
  this.vrButton.style.display = isVisible ? 'block' : 'none';
};

ButtonManager.prototype.createClickHandler_ = function(eventName) {
  return function(e) {
    e.stopPropagation();
    e.preventDefault();
    this.emit(eventName);
  }.bind(this);
};

ButtonManager.prototype.loadIcons_ = function() {
  // Preload some hard-coded SVG.
  this.ICONS = {};
  this.ICONS.cardboard = Util.base64('image/svg+xml', 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNHB4IiBoZWlnaHQ9IjI0cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0ZGRkZGRiI+CiAgICA8cGF0aCBkPSJNMjAuNzQgNkgzLjIxQzIuNTUgNiAyIDYuNTcgMiA3LjI4djEwLjQ0YzAgLjcuNTUgMS4yOCAxLjIzIDEuMjhoNC43OWMuNTIgMCAuOTYtLjMzIDEuMTQtLjc5bDEuNC0zLjQ4Yy4yMy0uNTkuNzktMS4wMSAxLjQ0LTEuMDFzMS4yMS40MiAxLjQ1IDEuMDFsMS4zOSAzLjQ4Yy4xOS40Ni42My43OSAxLjExLjc5aDQuNzljLjcxIDAgMS4yNi0uNTcgMS4yNi0xLjI4VjcuMjhjMC0uNy0uNTUtMS4yOC0xLjI2LTEuMjh6TTcuNSAxNC42MmMtMS4xNyAwLTIuMTMtLjk1LTIuMTMtMi4xMiAwLTEuMTcuOTYtMi4xMyAyLjEzLTIuMTMgMS4xOCAwIDIuMTIuOTYgMi4xMiAyLjEzcy0uOTUgMi4xMi0yLjEyIDIuMTJ6bTkgMGMtMS4xNyAwLTIuMTMtLjk1LTIuMTMtMi4xMiAwLTEuMTcuOTYtMi4xMyAyLjEzLTIuMTNzMi4xMi45NiAyLjEyIDIuMTMtLjk1IDIuMTItMi4xMiAyLjEyeiIvPgogICAgPHBhdGggZmlsbD0ibm9uZSIgZD0iTTAgMGgyNHYyNEgwVjB6Ii8+Cjwvc3ZnPgo=');
  this.ICONS.fullscreen = Util.base64('image/svg+xml', 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNHB4IiBoZWlnaHQ9IjI0cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0ZGRkZGRiI+CiAgICA8cGF0aCBkPSJNMCAwaDI0djI0SDB6IiBmaWxsPSJub25lIi8+CiAgICA8cGF0aCBkPSJNNyAxNEg1djVoNXYtMkg3di0zem0tMi00aDJWN2gzVjVINXY1em0xMiA3aC0zdjJoNXYtNWgtMnYzek0xNCA1djJoM3YzaDJWNWgtNXoiLz4KPC9zdmc+Cg==');
  this.ICONS.exitFullscreen = Util.base64('image/svg+xml', 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNHB4IiBoZWlnaHQ9IjI0cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0ZGRkZGRiI+CiAgICA8cGF0aCBkPSJNMCAwaDI0djI0SDB6IiBmaWxsPSJub25lIi8+CiAgICA8cGF0aCBkPSJNNSAxNmgzdjNoMnYtNUg1djJ6bTMtOEg1djJoNVY1SDh2M3ptNiAxMWgydi0zaDN2LTJoLTV2NXptMi0xMVY1aC0ydjVoNVY4aC0zeiIvPgo8L3N2Zz4K');
  this.ICONS.settings = Util.base64('image/svg+xml', 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNHB4IiBoZWlnaHQ9IjI0cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0ZGRkZGRiI+CiAgICA8cGF0aCBkPSJNMCAwaDI0djI0SDB6IiBmaWxsPSJub25lIi8+CiAgICA8cGF0aCBkPSJNMTkuNDMgMTIuOThjLjA0LS4zMi4wNy0uNjQuMDctLjk4cy0uMDMtLjY2LS4wNy0uOThsMi4xMS0xLjY1Yy4xOS0uMTUuMjQtLjQyLjEyLS42NGwtMi0zLjQ2Yy0uMTItLjIyLS4zOS0uMy0uNjEtLjIybC0yLjQ5IDFjLS41Mi0uNC0xLjA4LS43My0xLjY5LS45OGwtLjM4LTIuNjVDMTQuNDYgMi4xOCAxNC4yNSAyIDE0IDJoLTRjLS4yNSAwLS40Ni4xOC0uNDkuNDJsLS4zOCAyLjY1Yy0uNjEuMjUtMS4xNy41OS0xLjY5Ljk4bC0yLjQ5LTFjLS4yMy0uMDktLjQ5IDAtLjYxLjIybC0yIDMuNDZjLS4xMy4yMi0uMDcuNDkuMTIuNjRsMi4xMSAxLjY1Yy0uMDQuMzItLjA3LjY1LS4wNy45OHMuMDMuNjYuMDcuOThsLTIuMTEgMS42NWMtLjE5LjE1LS4yNC40Mi0uMTIuNjRsMiAzLjQ2Yy4xMi4yMi4zOS4zLjYxLjIybDIuNDktMWMuNTIuNCAxLjA4LjczIDEuNjkuOThsLjM4IDIuNjVjLjAzLjI0LjI0LjQyLjQ5LjQyaDRjLjI1IDAgLjQ2LS4xOC40OS0uNDJsLjM4LTIuNjVjLjYxLS4yNSAxLjE3LS41OSAxLjY5LS45OGwyLjQ5IDFjLjIzLjA5LjQ5IDAgLjYxLS4yMmwyLTMuNDZjLjEyLS4yMi4wNy0uNDktLjEyLS42NGwtMi4xMS0xLjY1ek0xMiAxNS41Yy0xLjkzIDAtMy41LTEuNTctMy41LTMuNXMxLjU3LTMuNSAzLjUtMy41IDMuNSAxLjU3IDMuNSAzLjUtMS41NyAzLjUtMy41IDMuNXoiLz4KPC9zdmc+Cg==');
};

module.exports = ButtonManager;

},{"./emitter.js":2,"./modes.js":4,"./util.js":5}],2:[function(_dereq_,module,exports){
/*
 * Copyright 2015 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function Emitter() {
  this.callbacks = {};
}

Emitter.prototype.emit = function(eventName) {
  var callbacks = this.callbacks[eventName];
  if (!callbacks) {
    //console.log('No valid callback specified.');
    return;
  }
  var args = [].slice.call(arguments);
  // Eliminate the first param (the callback).
  args.shift();
  for (var i = 0; i < callbacks.length; i++) {
    callbacks[i].apply(this, args);
  }
};

Emitter.prototype.on = function(eventName, callback) {
  if (eventName in this.callbacks) {
    this.callbacks[eventName].push(callback);
  } else {
    this.callbacks[eventName] = [callback];
  }
};

module.exports = Emitter;

},{}],3:[function(_dereq_,module,exports){
/*
 * Copyright 2015 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var WebVRManager = _dereq_('./webvr-manager.js');

window.WebVRConfig = window.WebVRConfig || {};
window.WebVRManager = WebVRManager;

},{"./webvr-manager.js":6}],4:[function(_dereq_,module,exports){
/*
 * Copyright 2015 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var Modes = {
  UNKNOWN: 0,
  // Not fullscreen, just tracking.
  NORMAL: 1,
  // Magic window immersive mode.
  MAGIC_WINDOW: 2,
  // Full screen split screen VR mode.
  VR: 3,
};

module.exports = Modes;

},{}],5:[function(_dereq_,module,exports){
/*
 * Copyright 2015 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var Util = {};

Util.base64 = function(mimeType, base64) {
  return 'data:' + mimeType + ';base64,' + base64;
};

Util.isMobile = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

Util.isFirefox = function() {
  return /firefox/i.test(navigator.userAgent);
};

Util.isIOS = function() {
  return /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
};

Util.isIFrame = function() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
};

Util.appendQueryParameter = function(url, key, value) {
  // Determine delimiter based on if the URL already GET parameters in it.
  var delimiter = (url.indexOf('?') < 0 ? '?' : '&');
  url += delimiter + key + '=' + value;
  return url;
};

// From http://goo.gl/4WX3tg
Util.getQueryParameter = function(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
};

Util.isLandscapeMode = function() {
  return (window.orientation == 90 || window.orientation == -90);
};

Util.getScreenWidth = function() {
  return Math.max(window.screen.width, window.screen.height) *
      window.devicePixelRatio;
};

Util.getScreenHeight = function() {
  return Math.min(window.screen.width, window.screen.height) *
      window.devicePixelRatio;
};

/**
 * Utility to convert the projection matrix to a vector accepted by the shader.
 *
 * @param {Object} opt_params A rectangle to scale this vector by.
 */
Util.projectionMatrixToVector_ = function(matrix, opt_params) {
  var params = opt_params || {};
  var xScale = params.xScale || 1;
  var yScale = params.yScale || 1;
  var xTrans = params.xTrans || 0;
  var yTrans = params.yTrans || 0;

  var elements = matrix.elements;
  var vec = new THREE.Vector4();
  vec.set(elements[4*0 + 0] * xScale,
          elements[4*1 + 1] * yScale,
          elements[4*2 + 0] - 1 - xTrans,
          elements[4*2 + 1] - 1 - yTrans).divideScalar(2);
  return vec;
};

Util.leftProjectionVectorToRight_ = function(left) {
  //projectionLeft + vec4(0.0, 0.0, 1.0, 0.0)) * vec4(1.0, 1.0, -1.0, 1.0);
  var out = new THREE.Vector4(0, 0, 1, 0);
  out.add(left); // out = left + (0, 0, 1, 0).
  out.z *= -1; // Flip z.

  return out;
};

module.exports = Util;

},{}],6:[function(_dereq_,module,exports){
/*
 * Copyright 2015 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var ButtonManager = _dereq_('./button-manager.js');
var Emitter = _dereq_('./emitter.js');
var Modes = _dereq_('./modes.js');
var Util = _dereq_('./util.js');

/**
 * Helper for getting in and out of VR mode.
 */
function WebVRManager(renderer, effect, params) {
  this.params = params || {};

  this.mode = Modes.UNKNOWN;

  // Set option to hide the button.
  this.hideButton = this.params.hideButton || false;
  // Whether or not the FOV should be distorted or un-distorted. By default, it
  // should be distorted, but in the case of vertex shader based distortion,
  // ensure that we use undistorted parameters.
  this.predistorted = !!this.params.predistorted;

  // Save the THREE.js renderer and effect for later.
  this.renderer = renderer;
  this.effect = effect;
  var polyfillWrapper = document.querySelector('.webvr-polyfill-fullscreen-wrapper');
  this.button = new ButtonManager(polyfillWrapper);

  this.isFullscreenDisabled = !!Util.getQueryParameter('no_fullscreen');
  this.startMode = Modes.NORMAL;
  var startModeParam = parseInt(Util.getQueryParameter('start_mode'));
  if (!isNaN(startModeParam)) {
    this.startMode = startModeParam;
  }

  if (this.hideButton) {
    this.button.setVisibility(false);
  }

  // Check if the browser is compatible with WebVR.
  this.getDeviceByType_(VRDisplay).then(function(hmd) {
    this.hmd = hmd;

    // Only enable VR mode if there's a VR device attached or we are running the
    // polyfill on mobile.
    this.isVRCompatible =  !hmd.isPolyfilled || Util.isMobile();

    switch (this.startMode) {
      case Modes.MAGIC_WINDOW:
        this.setMode_(Modes.MAGIC_WINDOW);
        break;
      case Modes.VR:
        this.enterVRMode_();
        this.setMode_(Modes.VR);
        break;
      default:
        this.setMode_(Modes.NORMAL);
    }

    this.emit('initialized');
  }.bind(this));

  // Hook up button listeners.
  this.button.on('fs', this.onFSClick_.bind(this));
  this.button.on('vr', this.onVRClick_.bind(this));

  // Bind to fullscreen events.
  document.addEventListener('webkitfullscreenchange',
      this.onFullscreenChange_.bind(this));
  document.addEventListener('mozfullscreenchange',
      this.onFullscreenChange_.bind(this));
  document.addEventListener('msfullscreenchange',
      this.onFullscreenChange_.bind(this));

  // Bind to VR* specific events.
  window.addEventListener('vrdisplaypresentchange',
      this.onVRDisplayPresentChange_.bind(this));
  window.addEventListener('vrdisplaydeviceparamschange',
      this.onVRDisplayDeviceParamsChange_.bind(this));
}

WebVRManager.prototype = new Emitter();

// Expose these values externally.
WebVRManager.Modes = Modes;

/**
 * Promise returns true if there is at least one HMD device available.
 */
WebVRManager.prototype.getDeviceByType_ = function(type) {
  return new Promise(function(resolve, reject) {
    navigator.getVRDisplays().then(function(displays) {
      // Promise succeeds, but check if there are any displays actually.
      for (var i = 0; i < displays.length; i++) {
        if (displays[i] instanceof type) {
          resolve(displays[i]);
          break;
        }
      }
      resolve(null);
    }, function() {
      // No displays are found.
      resolve(null);
    });
  });
};

WebVRManager.prototype.render = function(scene, camera, timestamp) {
  // Scene may be an array of two scenes, one for each eye.
  if (scene instanceof Array) {
    this.effect.render(scene[0], camera);
  } else {
    this.effect.render(scene, camera);
  }
};

/**
 * Helper for entering VR mode.
 */
WebVRManager.prototype.enterVRMode_ = function() {
  this.hmd.requestPresent({
    source: this.renderer.domElement,
    predistorted: this.predistorted
  });
};

WebVRManager.prototype.setMode_ = function(mode) {
  var oldMode = this.mode;
  if (mode == this.mode) {
    console.warn('Not changing modes, already in %s', mode);
    return;
  }
  console.log('Mode change: %s => %s', this.mode, mode);
  this.mode = mode;
  this.button.setMode(mode, this.isVRCompatible);

  // Emit an event indicating the mode changed.
  this.emit('modechange', mode, oldMode);
};

/**
 * Main button was clicked.
 */
WebVRManager.prototype.onFSClick_ = function() {
  switch (this.mode) {
    case Modes.NORMAL:
      // TODO: Remove this hack if/when iOS gets real fullscreen mode.
      // If this is an iframe on iOS, break out and open in no_fullscreen mode.
      if (Util.isIOS() && Util.isIFrame()) {
        var url = window.location.href;
        url = Util.appendQueryParameter(url, 'no_fullscreen', 'true');
        url = Util.appendQueryParameter(url, 'start_mode', Modes.MAGIC_WINDOW);
        top.location.href = url;
        return;
      }
      this.setMode_(Modes.MAGIC_WINDOW);
      this.requestFullscreen_();
      break;
    case Modes.MAGIC_WINDOW:
      if (this.isFullscreenDisabled) {
        window.history.back();
        return;
      }
      this.setMode_(Modes.NORMAL);
      this.exitFullscreen_();
      break;
  }
};

/**
 * The VR button was clicked.
 */
WebVRManager.prototype.onVRClick_ = function() {
  // TODO: Remove this hack when iOS has fullscreen mode.
  // If this is an iframe on iOS, break out and open in no_fullscreen mode.
  if (this.mode == Modes.NORMAL && Util.isIOS() && Util.isIFrame()) {
    var url = window.location.href;
    url = Util.appendQueryParameter(url, 'no_fullscreen', 'true');
    url = Util.appendQueryParameter(url, 'start_mode', Modes.VR);
    top.location.href = url;
    return;
  }
  this.enterVRMode_();
};

WebVRManager.prototype.requestFullscreen_ = function() {
  var canvas = document.body;
  //var canvas = this.renderer.domElement;
  if (canvas.requestFullscreen) {
    canvas.requestFullscreen();
  } else if (canvas.mozRequestFullScreen) {
    canvas.mozRequestFullScreen();
  } else if (canvas.webkitRequestFullscreen) {
    canvas.webkitRequestFullscreen();
  } else if (canvas.msRequestFullscreen) {
    canvas.msRequestFullscreen();
  }
};

WebVRManager.prototype.exitFullscreen_ = function() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
};

WebVRManager.prototype.onVRDisplayPresentChange_ = function(e) {
  console.log('onVRDisplayPresentChange_', e);
  if (this.hmd.isPresenting) {
    this.setMode_(Modes.VR);
  } else {
    this.setMode_(Modes.NORMAL);
  }
};

WebVRManager.prototype.onVRDisplayDeviceParamsChange_ = function(e) {
  console.log('onVRDisplayDeviceParamsChange_', e);
};

WebVRManager.prototype.onFullscreenChange_ = function(e) {
  // If we leave full-screen, go back to normal mode.
  if (document.webkitFullscreenElement === null ||
      document.mozFullScreenElement === null) {
    this.setMode_(Modes.NORMAL);
  }
};

module.exports = WebVRManager;

},{"./button-manager.js":1,"./emitter.js":2,"./modes.js":4,"./util.js":5}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWVicmV3L2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9idXR0b24tbWFuYWdlci5qcyIsInNyYy9lbWl0dGVyLmpzIiwic3JjL21haW4uanMiLCJzcmMvbW9kZXMuanMiLCJzcmMvdXRpbC5qcyIsInNyYy93ZWJ2ci1tYW5hZ2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9JQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKlxuICogQ29weXJpZ2h0IDIwMTUgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG52YXIgRW1pdHRlciA9IHJlcXVpcmUoJy4vZW1pdHRlci5qcycpO1xudmFyIE1vZGVzID0gcmVxdWlyZSgnLi9tb2Rlcy5qcycpO1xudmFyIFV0aWwgPSByZXF1aXJlKCcuL3V0aWwuanMnKTtcblxuLyoqXG4gKiBFdmVyeXRoaW5nIGhhdmluZyB0byBkbyB3aXRoIHRoZSBXZWJWUiBidXR0b24uXG4gKiBFbWl0cyBhICdjbGljaycgZXZlbnQgd2hlbiBpdCdzIGNsaWNrZWQuXG4gKi9cbmZ1bmN0aW9uIEJ1dHRvbk1hbmFnZXIob3B0X3Jvb3QpIHtcbiAgdmFyIHJvb3QgPSBvcHRfcm9vdCB8fCBkb2N1bWVudC5ib2R5O1xuICB0aGlzLmxvYWRJY29uc18oKTtcblxuICAvLyBNYWtlIHRoZSBmdWxsc2NyZWVuIGJ1dHRvbi5cbiAgdmFyIGZzQnV0dG9uID0gdGhpcy5jcmVhdGVCdXR0b24oKTtcbiAgZnNCdXR0b24uc3JjID0gdGhpcy5JQ09OUy5mdWxsc2NyZWVuO1xuICBmc0J1dHRvbi50aXRsZSA9ICdGdWxsc2NyZWVuIG1vZGUnO1xuICB2YXIgcyA9IGZzQnV0dG9uLnN0eWxlO1xuICBzLmJvdHRvbSA9IDA7XG4gIHMucmlnaHQgPSAwO1xuICBmc0J1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuY3JlYXRlQ2xpY2tIYW5kbGVyXygnZnMnKSk7XG4gIHJvb3QuYXBwZW5kQ2hpbGQoZnNCdXR0b24pO1xuICB0aGlzLmZzQnV0dG9uID0gZnNCdXR0b247XG5cbiAgLy8gTWFrZSB0aGUgVlIgYnV0dG9uLlxuICB2YXIgdnJCdXR0b24gPSB0aGlzLmNyZWF0ZUJ1dHRvbigpO1xuICB2ckJ1dHRvbi5zcmMgPSB0aGlzLklDT05TLmNhcmRib2FyZDtcbiAgdnJCdXR0b24udGl0bGUgPSAnVmlydHVhbCByZWFsaXR5IG1vZGUnO1xuICB2YXIgcyA9IHZyQnV0dG9uLnN0eWxlO1xuICBzLmJvdHRvbSA9IDA7XG4gIHMucmlnaHQgPSAnNDhweCc7XG4gIHZyQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5jcmVhdGVDbGlja0hhbmRsZXJfKCd2cicpKTtcbiAgcm9vdC5hcHBlbmRDaGlsZCh2ckJ1dHRvbik7XG4gIHRoaXMudnJCdXR0b24gPSB2ckJ1dHRvbjtcblxuICB0aGlzLmlzVmlzaWJsZSA9IHRydWU7XG5cbn1cbkJ1dHRvbk1hbmFnZXIucHJvdG90eXBlID0gbmV3IEVtaXR0ZXIoKTtcblxuQnV0dG9uTWFuYWdlci5wcm90b3R5cGUuY3JlYXRlQnV0dG9uID0gZnVuY3Rpb24oKSB7XG4gIHZhciBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgYnV0dG9uLmNsYXNzTmFtZSA9ICd3ZWJ2ci1idXR0b24nO1xuICB2YXIgcyA9IGJ1dHRvbi5zdHlsZTtcbiAgcy5wb3NpdGlvbiA9ICdmaXhlZCc7XG4gIHMud2lkdGggPSAnMjRweCdcbiAgcy5oZWlnaHQgPSAnMjRweCc7XG4gIHMuYmFja2dyb3VuZFNpemUgPSAnY292ZXInO1xuICBzLmJhY2tncm91bmRDb2xvciA9ICd0cmFuc3BhcmVudCc7XG4gIHMuYm9yZGVyID0gMDtcbiAgcy51c2VyU2VsZWN0ID0gJ25vbmUnO1xuICBzLndlYmtpdFVzZXJTZWxlY3QgPSAnbm9uZSc7XG4gIHMuTW96VXNlclNlbGVjdCA9ICdub25lJztcbiAgcy5jdXJzb3IgPSAncG9pbnRlcic7XG4gIHMucGFkZGluZyA9ICcxMnB4JztcbiAgcy56SW5kZXggPSAxO1xuICBzLmRpc3BsYXkgPSAnbm9uZSc7XG4gIHMuYm94U2l6aW5nID0gJ2NvbnRlbnQtYm94JztcblxuICAvLyBQcmV2ZW50IGJ1dHRvbiBmcm9tIGJlaW5nIHNlbGVjdGVkIGFuZCBkcmFnZ2VkLlxuICBidXR0b24uZHJhZ2dhYmxlID0gZmFsc2U7XG4gIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdkcmFnc3RhcnQnLCBmdW5jdGlvbihlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICB9KTtcblxuICAvLyBTdHlsZSBpdCBvbiBob3Zlci5cbiAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCBmdW5jdGlvbihlKSB7XG4gICAgcy5maWx0ZXIgPSBzLndlYmtpdEZpbHRlciA9ICdkcm9wLXNoYWRvdygwIDAgNXB4IHJnYmEoMjU1LDI1NSwyNTUsMSkpJztcbiAgfSk7XG4gIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgZnVuY3Rpb24oZSkge1xuICAgIHMuZmlsdGVyID0gcy53ZWJraXRGaWx0ZXIgPSAnJztcbiAgfSk7XG4gIHJldHVybiBidXR0b247XG59O1xuXG5CdXR0b25NYW5hZ2VyLnByb3RvdHlwZS5zZXRNb2RlID0gZnVuY3Rpb24obW9kZSwgaXNWUkNvbXBhdGlibGUpIHtcbiAgaXNWUkNvbXBhdGlibGUgPSBpc1ZSQ29tcGF0aWJsZSB8fCBXZWJWUkNvbmZpZy5GT1JDRV9FTkFCTEVfVlI7XG4gIGlmICghdGhpcy5pc1Zpc2libGUpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgc3dpdGNoIChtb2RlKSB7XG4gICAgY2FzZSBNb2Rlcy5OT1JNQUw6XG4gICAgICB0aGlzLmZzQnV0dG9uLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgdGhpcy5mc0J1dHRvbi5zcmMgPSB0aGlzLklDT05TLmZ1bGxzY3JlZW47XG4gICAgICB0aGlzLnZyQnV0dG9uLnN0eWxlLmRpc3BsYXkgPSAoaXNWUkNvbXBhdGlibGUgPyAnYmxvY2snIDogJ25vbmUnKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgTW9kZXMuTUFHSUNfV0lORE9XOlxuICAgICAgdGhpcy5mc0J1dHRvbi5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgIHRoaXMuZnNCdXR0b24uc3JjID0gdGhpcy5JQ09OUy5leGl0RnVsbHNjcmVlbjtcbiAgICAgIHRoaXMudnJCdXR0b24uc3R5bGUuZGlzcGxheSA9IChpc1ZSQ29tcGF0aWJsZSA/ICdibG9jaycgOiAnbm9uZScpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBNb2Rlcy5WUjpcbiAgICAgIHRoaXMuZnNCdXR0b24uc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgIHRoaXMudnJCdXR0b24uc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgIGJyZWFrO1xuICB9XG5cbiAgLy8gSGFjayBmb3IgU2FmYXJpIE1hYy9pT1MgdG8gZm9yY2UgcmVsYXlvdXQgKHN2Zy1zcGVjaWZpYyBpc3N1ZSlcbiAgLy8gaHR0cDovL2dvby5nbC9oamdSNnJcbiAgdmFyIG9sZFZhbHVlID0gdGhpcy5mc0J1dHRvbi5zdHlsZS5kaXNwbGF5O1xuICB0aGlzLmZzQnV0dG9uLnN0eWxlLmRpc3BsYXkgPSAnaW5saW5lLWJsb2NrJztcbiAgdGhpcy5mc0J1dHRvbi5vZmZzZXRIZWlnaHQ7XG4gIHRoaXMuZnNCdXR0b24uc3R5bGUuZGlzcGxheSA9IG9sZFZhbHVlO1xufTtcblxuQnV0dG9uTWFuYWdlci5wcm90b3R5cGUuc2V0VmlzaWJpbGl0eSA9IGZ1bmN0aW9uKGlzVmlzaWJsZSkge1xuICB0aGlzLmlzVmlzaWJsZSA9IGlzVmlzaWJsZTtcbiAgdGhpcy5mc0J1dHRvbi5zdHlsZS5kaXNwbGF5ID0gaXNWaXNpYmxlID8gJ2Jsb2NrJyA6ICdub25lJztcbiAgdGhpcy52ckJ1dHRvbi5zdHlsZS5kaXNwbGF5ID0gaXNWaXNpYmxlID8gJ2Jsb2NrJyA6ICdub25lJztcbn07XG5cbkJ1dHRvbk1hbmFnZXIucHJvdG90eXBlLmNyZWF0ZUNsaWNrSGFuZGxlcl8gPSBmdW5jdGlvbihldmVudE5hbWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGUpIHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB0aGlzLmVtaXQoZXZlbnROYW1lKTtcbiAgfS5iaW5kKHRoaXMpO1xufTtcblxuQnV0dG9uTWFuYWdlci5wcm90b3R5cGUubG9hZEljb25zXyA9IGZ1bmN0aW9uKCkge1xuICAvLyBQcmVsb2FkIHNvbWUgaGFyZC1jb2RlZCBTVkcuXG4gIHRoaXMuSUNPTlMgPSB7fTtcbiAgdGhpcy5JQ09OUy5jYXJkYm9hcmQgPSBVdGlsLmJhc2U2NCgnaW1hZ2Uvc3ZnK3htbCcsICdQSE4yWnlCNGJXeHVjejBpYUhSMGNEb3ZMM2QzZHk1M015NXZjbWN2TWpBd01DOXpkbWNpSUhkcFpIUm9QU0l5TkhCNElpQm9aV2xuYUhROUlqSTBjSGdpSUhacFpYZENiM2c5SWpBZ01DQXlOQ0F5TkNJZ1ptbHNiRDBpSTBaR1JrWkdSaUkrQ2lBZ0lDQThjR0YwYUNCa1BTSk5NakF1TnpRZ05rZ3pMakl4UXpJdU5UVWdOaUF5SURZdU5UY2dNaUEzTGpJNGRqRXdMalEwWXpBZ0xqY3VOVFVnTVM0eU9DQXhMakl6SURFdU1qaG9OQzQzT1dNdU5USWdNQ0F1T1RZdExqTXpJREV1TVRRdExqYzViREV1TkMwekxqUTRZeTR5TXkwdU5Ua3VOemt0TVM0d01TQXhMalEwTFRFdU1ERnpNUzR5TVM0ME1pQXhMalExSURFdU1ERnNNUzR6T1NBekxqUTRZeTR4T1M0ME5pNDJNeTQzT1NBeExqRXhMamM1YURRdU56bGpMamN4SURBZ01TNHlOaTB1TlRjZ01TNHlOaTB4TGpJNFZqY3VNamhqTUMwdU55MHVOVFV0TVM0eU9DMHhMakkyTFRFdU1qaDZUVGN1TlNBeE5DNDJNbU10TVM0eE55QXdMVEl1TVRNdExqazFMVEl1TVRNdE1pNHhNaUF3TFRFdU1UY3VPVFl0TWk0eE15QXlMakV6TFRJdU1UTWdNUzR4T0NBd0lESXVNVEl1T1RZZ01pNHhNaUF5TGpFemN5MHVPVFVnTWk0eE1pMHlMakV5SURJdU1USjZiVGtnTUdNdE1TNHhOeUF3TFRJdU1UTXRMamsxTFRJdU1UTXRNaTR4TWlBd0xURXVNVGN1T1RZdE1pNHhNeUF5TGpFekxUSXVNVE56TWk0eE1pNDVOaUF5TGpFeUlESXVNVE10TGprMUlESXVNVEl0TWk0eE1pQXlMakV5ZWlJdlBnb2dJQ0FnUEhCaGRHZ2dabWxzYkQwaWJtOXVaU0lnWkQwaVRUQWdNR2d5TkhZeU5FZ3dWakI2SWk4K0Nqd3ZjM1puUGdvPScpO1xuICB0aGlzLklDT05TLmZ1bGxzY3JlZW4gPSBVdGlsLmJhc2U2NCgnaW1hZ2Uvc3ZnK3htbCcsICdQSE4yWnlCNGJXeHVjejBpYUhSMGNEb3ZMM2QzZHk1M015NXZjbWN2TWpBd01DOXpkbWNpSUhkcFpIUm9QU0l5TkhCNElpQm9aV2xuYUhROUlqSTBjSGdpSUhacFpYZENiM2c5SWpBZ01DQXlOQ0F5TkNJZ1ptbHNiRDBpSTBaR1JrWkdSaUkrQ2lBZ0lDQThjR0YwYUNCa1BTSk5NQ0F3YURJMGRqSTBTREI2SWlCbWFXeHNQU0p1YjI1bElpOCtDaUFnSUNBOGNHRjBhQ0JrUFNKTk55QXhORWcxZGpWb05YWXRNa2czZGkwemVtMHRNaTAwYURKV04yZ3pWalZJTlhZMWVtMHhNaUEzYUMwemRqSm9OWFl0TldndE1uWXplazB4TkNBMWRqSm9NM1l6YURKV05XZ3ROWG9pTHo0S1BDOXpkbWMrQ2c9PScpO1xuICB0aGlzLklDT05TLmV4aXRGdWxsc2NyZWVuID0gVXRpbC5iYXNlNjQoJ2ltYWdlL3N2Zyt4bWwnLCAnUEhOMlp5QjRiV3h1Y3owaWFIUjBjRG92TDNkM2R5NTNNeTV2Y21jdk1qQXdNQzl6ZG1jaUlIZHBaSFJvUFNJeU5IQjRJaUJvWldsbmFIUTlJakkwY0hnaUlIWnBaWGRDYjNnOUlqQWdNQ0F5TkNBeU5DSWdabWxzYkQwaUkwWkdSa1pHUmlJK0NpQWdJQ0E4Y0dGMGFDQmtQU0pOTUNBd2FESTBkakkwU0RCNklpQm1hV3hzUFNKdWIyNWxJaTgrQ2lBZ0lDQThjR0YwYUNCa1BTSk5OU0F4Tm1nemRqTm9Nbll0TlVnMWRqSjZiVE10T0VnMWRqSm9OVlkxU0RoMk0zcHROaUF4TVdneWRpMHphRE4yTFRKb0xUVjJOWHB0TWkweE1WWTFhQzB5ZGpWb05WWTRhQzB6ZWlJdlBnbzhMM04yWno0SycpO1xuICB0aGlzLklDT05TLnNldHRpbmdzID0gVXRpbC5iYXNlNjQoJ2ltYWdlL3N2Zyt4bWwnLCAnUEhOMlp5QjRiV3h1Y3owaWFIUjBjRG92TDNkM2R5NTNNeTV2Y21jdk1qQXdNQzl6ZG1jaUlIZHBaSFJvUFNJeU5IQjRJaUJvWldsbmFIUTlJakkwY0hnaUlIWnBaWGRDYjNnOUlqQWdNQ0F5TkNBeU5DSWdabWxzYkQwaUkwWkdSa1pHUmlJK0NpQWdJQ0E4Y0dGMGFDQmtQU0pOTUNBd2FESTBkakkwU0RCNklpQm1hV3hzUFNKdWIyNWxJaTgrQ2lBZ0lDQThjR0YwYUNCa1BTSk5NVGt1TkRNZ01USXVPVGhqTGpBMExTNHpNaTR3TnkwdU5qUXVNRGN0TGprNGN5MHVNRE10TGpZMkxTNHdOeTB1T1Roc01pNHhNUzB4TGpZMVl5NHhPUzB1TVRVdU1qUXRMalF5TGpFeUxTNDJOR3d0TWkwekxqUTJZeTB1TVRJdExqSXlMUzR6T1MwdU15MHVOakV0TGpJeWJDMHlMalE1SURGakxTNDFNaTB1TkMweExqQTRMUzQzTXkweExqWTVMUzQ1T0d3dExqTTRMVEl1TmpWRE1UUXVORFlnTWk0eE9DQXhOQzR5TlNBeUlERTBJREpvTFRSakxTNHlOU0F3TFM0ME5pNHhPQzB1TkRrdU5ESnNMUzR6T0NBeUxqWTFZeTB1TmpFdU1qVXRNUzR4Tnk0MU9TMHhMalk1TGprNGJDMHlMalE1TFRGakxTNHlNeTB1TURrdExqUTVJREF0TGpZeExqSXliQzB5SURNdU5EWmpMUzR4TXk0eU1pMHVNRGN1TkRrdU1USXVOalJzTWk0eE1TQXhMalkxWXkwdU1EUXVNekl0TGpBM0xqWTFMUzR3Tnk0NU9ITXVNRE11TmpZdU1EY3VPVGhzTFRJdU1URWdNUzQyTldNdExqRTVMakUxTFM0eU5DNDBNaTB1TVRJdU5qUnNNaUF6TGpRMll5NHhNaTR5TWk0ek9TNHpMall4TGpJeWJESXVORGt0TVdNdU5USXVOQ0F4TGpBNExqY3pJREV1TmprdU9UaHNMak00SURJdU5qVmpMakF6TGpJMExqSTBMalF5TGpRNUxqUXlhRFJqTGpJMUlEQWdMalEyTFM0eE9DNDBPUzB1TkRKc0xqTTRMVEl1TmpWakxqWXhMUzR5TlNBeExqRTNMUzQxT1NBeExqWTVMUzQ1T0d3eUxqUTVJREZqTGpJekxqQTVMalE1SURBZ0xqWXhMUzR5TW13eUxUTXVORFpqTGpFeUxTNHlNaTR3TnkwdU5Ea3RMakV5TFM0Mk5Hd3RNaTR4TVMweExqWTFlazB4TWlBeE5TNDFZeTB4TGpreklEQXRNeTQxTFRFdU5UY3RNeTQxTFRNdU5YTXhMalUzTFRNdU5TQXpMalV0TXk0MUlETXVOU0F4TGpVM0lETXVOU0F6TGpVdE1TNDFOeUF6TGpVdE15NDFJRE11TlhvaUx6NEtQQzl6ZG1jK0NnPT0nKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQnV0dG9uTWFuYWdlcjtcbiIsIi8qXG4gKiBDb3B5cmlnaHQgMjAxNSBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmZ1bmN0aW9uIEVtaXR0ZXIoKSB7XG4gIHRoaXMuY2FsbGJhY2tzID0ge307XG59XG5cbkVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbihldmVudE5hbWUpIHtcbiAgdmFyIGNhbGxiYWNrcyA9IHRoaXMuY2FsbGJhY2tzW2V2ZW50TmFtZV07XG4gIGlmICghY2FsbGJhY2tzKSB7XG4gICAgLy9jb25zb2xlLmxvZygnTm8gdmFsaWQgY2FsbGJhY2sgc3BlY2lmaWVkLicpO1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgLy8gRWxpbWluYXRlIHRoZSBmaXJzdCBwYXJhbSAodGhlIGNhbGxiYWNrKS5cbiAgYXJncy5zaGlmdCgpO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGNhbGxiYWNrcy5sZW5ndGg7IGkrKykge1xuICAgIGNhbGxiYWNrc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfVxufTtcblxuRW1pdHRlci5wcm90b3R5cGUub24gPSBmdW5jdGlvbihldmVudE5hbWUsIGNhbGxiYWNrKSB7XG4gIGlmIChldmVudE5hbWUgaW4gdGhpcy5jYWxsYmFja3MpIHtcbiAgICB0aGlzLmNhbGxiYWNrc1tldmVudE5hbWVdLnB1c2goY2FsbGJhY2spO1xuICB9IGVsc2Uge1xuICAgIHRoaXMuY2FsbGJhY2tzW2V2ZW50TmFtZV0gPSBbY2FsbGJhY2tdO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEVtaXR0ZXI7XG4iLCIvKlxuICogQ29weXJpZ2h0IDIwMTUgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG52YXIgV2ViVlJNYW5hZ2VyID0gcmVxdWlyZSgnLi93ZWJ2ci1tYW5hZ2VyLmpzJyk7XG5cbndpbmRvdy5XZWJWUkNvbmZpZyA9IHdpbmRvdy5XZWJWUkNvbmZpZyB8fCB7fTtcbndpbmRvdy5XZWJWUk1hbmFnZXIgPSBXZWJWUk1hbmFnZXI7XG4iLCIvKlxuICogQ29weXJpZ2h0IDIwMTUgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG52YXIgTW9kZXMgPSB7XG4gIFVOS05PV046IDAsXG4gIC8vIE5vdCBmdWxsc2NyZWVuLCBqdXN0IHRyYWNraW5nLlxuICBOT1JNQUw6IDEsXG4gIC8vIE1hZ2ljIHdpbmRvdyBpbW1lcnNpdmUgbW9kZS5cbiAgTUFHSUNfV0lORE9XOiAyLFxuICAvLyBGdWxsIHNjcmVlbiBzcGxpdCBzY3JlZW4gVlIgbW9kZS5cbiAgVlI6IDMsXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGVzO1xuIiwiLypcbiAqIENvcHlyaWdodCAyMDE1IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxudmFyIFV0aWwgPSB7fTtcblxuVXRpbC5iYXNlNjQgPSBmdW5jdGlvbihtaW1lVHlwZSwgYmFzZTY0KSB7XG4gIHJldHVybiAnZGF0YTonICsgbWltZVR5cGUgKyAnO2Jhc2U2NCwnICsgYmFzZTY0O1xufTtcblxuVXRpbC5pc01vYmlsZSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgY2hlY2sgPSBmYWxzZTtcbiAgKGZ1bmN0aW9uKGEpe2lmKC8oYW5kcm9pZHxiYlxcZCt8bWVlZ28pLittb2JpbGV8YXZhbnRnb3xiYWRhXFwvfGJsYWNrYmVycnl8YmxhemVyfGNvbXBhbHxlbGFpbmV8ZmVubmVjfGhpcHRvcHxpZW1vYmlsZXxpcChob25lfG9kKXxpcmlzfGtpbmRsZXxsZ2UgfG1hZW1vfG1pZHB8bW1wfG1vYmlsZS4rZmlyZWZveHxuZXRmcm9udHxvcGVyYSBtKG9ifGluKWl8cGFsbSggb3MpP3xwaG9uZXxwKGl4aXxyZSlcXC98cGx1Y2tlcnxwb2NrZXR8cHNwfHNlcmllcyg0fDYpMHxzeW1iaWFufHRyZW98dXBcXC4oYnJvd3NlcnxsaW5rKXx2b2RhZm9uZXx3YXB8d2luZG93cyBjZXx4ZGF8eGlpbm8vaS50ZXN0KGEpfHwvMTIwN3w2MzEwfDY1OTB8M2dzb3w0dGhwfDUwWzEtNl1pfDc3MHN8ODAyc3xhIHdhfGFiYWN8YWMoZXJ8b298c1xcLSl8YWkoa298cm4pfGFsKGF2fGNhfGNvKXxhbW9pfGFuKGV4fG55fHl3KXxhcHR1fGFyKGNofGdvKXxhcyh0ZXx1cyl8YXR0d3xhdShkaXxcXC1tfHIgfHMgKXxhdmFufGJlKGNrfGxsfG5xKXxiaShsYnxyZCl8YmwoYWN8YXopfGJyKGV8dil3fGJ1bWJ8YndcXC0obnx1KXxjNTVcXC98Y2FwaXxjY3dhfGNkbVxcLXxjZWxsfGNodG18Y2xkY3xjbWRcXC18Y28obXB8bmQpfGNyYXd8ZGEoaXR8bGx8bmcpfGRidGV8ZGNcXC1zfGRldml8ZGljYXxkbW9ifGRvKGN8cClvfGRzKDEyfFxcLWQpfGVsKDQ5fGFpKXxlbShsMnx1bCl8ZXIoaWN8azApfGVzbDh8ZXooWzQtN10wfG9zfHdhfHplKXxmZXRjfGZseShcXC18Xyl8ZzEgdXxnNTYwfGdlbmV8Z2ZcXC01fGdcXC1tb3xnbyhcXC53fG9kKXxncihhZHx1bil8aGFpZXxoY2l0fGhkXFwtKG18cHx0KXxoZWlcXC18aGkocHR8dGEpfGhwKCBpfGlwKXxoc1xcLWN8aHQoYyhcXC18IHxffGF8Z3xwfHN8dCl8dHApfGh1KGF3fHRjKXxpXFwtKDIwfGdvfG1hKXxpMjMwfGlhYyggfFxcLXxcXC8pfGlicm98aWRlYXxpZzAxfGlrb218aW0xa3xpbm5vfGlwYXF8aXJpc3xqYSh0fHYpYXxqYnJvfGplbXV8amlnc3xrZGRpfGtlaml8a2d0KCB8XFwvKXxrbG9ufGtwdCB8a3djXFwtfGt5byhjfGspfGxlKG5vfHhpKXxsZyggZ3xcXC8oa3xsfHUpfDUwfDU0fFxcLVthLXddKXxsaWJ3fGx5bnh8bTFcXC13fG0zZ2F8bTUwXFwvfG1hKHRlfHVpfHhvKXxtYygwMXwyMXxjYSl8bVxcLWNyfG1lKHJjfHJpKXxtaShvOHxvYXx0cyl8bW1lZnxtbygwMXwwMnxiaXxkZXxkb3x0KFxcLXwgfG98dil8enopfG10KDUwfHAxfHYgKXxtd2JwfG15d2F8bjEwWzAtMl18bjIwWzItM118bjMwKDB8Mil8bjUwKDB8Mnw1KXxuNygwKDB8MSl8MTApfG5lKChjfG0pXFwtfG9ufHRmfHdmfHdnfHd0KXxub2soNnxpKXxuenBofG8yaW18b3AodGl8d3YpfG9yYW58b3dnMXxwODAwfHBhbihhfGR8dCl8cGR4Z3xwZygxM3xcXC0oWzEtOF18YykpfHBoaWx8cGlyZXxwbChheXx1Yyl8cG5cXC0yfHBvKGNrfHJ0fHNlKXxwcm94fHBzaW98cHRcXC1nfHFhXFwtYXxxYygwN3wxMnwyMXwzMnw2MHxcXC1bMi03XXxpXFwtKXxxdGVrfHIzODB8cjYwMHxyYWtzfHJpbTl8cm8odmV8em8pfHM1NVxcL3xzYShnZXxtYXxtbXxtc3xueXx2YSl8c2MoMDF8aFxcLXxvb3xwXFwtKXxzZGtcXC98c2UoYyhcXC18MHwxKXw0N3xtY3xuZHxyaSl8c2doXFwtfHNoYXJ8c2llKFxcLXxtKXxza1xcLTB8c2woNDV8aWQpfHNtKGFsfGFyfGIzfGl0fHQ1KXxzbyhmdHxueSl8c3AoMDF8aFxcLXx2XFwtfHYgKXxzeSgwMXxtYil8dDIoMTh8NTApfHQ2KDAwfDEwfDE4KXx0YShndHxsayl8dGNsXFwtfHRkZ1xcLXx0ZWwoaXxtKXx0aW1cXC18dFxcLW1vfHRvKHBsfHNoKXx0cyg3MHxtXFwtfG0zfG01KXx0eFxcLTl8dXAoXFwuYnxnMXxzaSl8dXRzdHx2NDAwfHY3NTB8dmVyaXx2aShyZ3x0ZSl8dmsoNDB8NVswLTNdfFxcLXYpfHZtNDB8dm9kYXx2dWxjfHZ4KDUyfDUzfDYwfDYxfDcwfDgwfDgxfDgzfDg1fDk4KXx3M2MoXFwtfCApfHdlYmN8d2hpdHx3aShnIHxuY3xudyl8d21sYnx3b251fHg3MDB8eWFzXFwtfHlvdXJ8emV0b3x6dGVcXC0vaS50ZXN0KGEuc3Vic3RyKDAsNCkpKWNoZWNrID0gdHJ1ZX0pKG5hdmlnYXRvci51c2VyQWdlbnR8fG5hdmlnYXRvci52ZW5kb3J8fHdpbmRvdy5vcGVyYSk7XG4gIHJldHVybiBjaGVjaztcbn07XG5cblV0aWwuaXNGaXJlZm94ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAvZmlyZWZveC9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XG59O1xuXG5VdGlsLmlzSU9TID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAvKGlQYWR8aVBob25lfGlQb2QpL2cudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcbn07XG5cblV0aWwuaXNJRnJhbWUgPSBmdW5jdGlvbigpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gd2luZG93LnNlbGYgIT09IHdpbmRvdy50b3A7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTtcblxuVXRpbC5hcHBlbmRRdWVyeVBhcmFtZXRlciA9IGZ1bmN0aW9uKHVybCwga2V5LCB2YWx1ZSkge1xuICAvLyBEZXRlcm1pbmUgZGVsaW1pdGVyIGJhc2VkIG9uIGlmIHRoZSBVUkwgYWxyZWFkeSBHRVQgcGFyYW1ldGVycyBpbiBpdC5cbiAgdmFyIGRlbGltaXRlciA9ICh1cmwuaW5kZXhPZignPycpIDwgMCA/ICc/JyA6ICcmJyk7XG4gIHVybCArPSBkZWxpbWl0ZXIgKyBrZXkgKyAnPScgKyB2YWx1ZTtcbiAgcmV0dXJuIHVybDtcbn07XG5cbi8vIEZyb20gaHR0cDovL2dvby5nbC80V1gzdGdcblV0aWwuZ2V0UXVlcnlQYXJhbWV0ZXIgPSBmdW5jdGlvbihuYW1lKSB7XG4gIG5hbWUgPSBuYW1lLnJlcGxhY2UoL1tcXFtdLywgXCJcXFxcW1wiKS5yZXBsYWNlKC9bXFxdXS8sIFwiXFxcXF1cIik7XG4gIHZhciByZWdleCA9IG5ldyBSZWdFeHAoXCJbXFxcXD8mXVwiICsgbmFtZSArIFwiPShbXiYjXSopXCIpLFxuICAgICAgcmVzdWx0cyA9IHJlZ2V4LmV4ZWMobG9jYXRpb24uc2VhcmNoKTtcbiAgcmV0dXJuIHJlc3VsdHMgPT09IG51bGwgPyBcIlwiIDogZGVjb2RlVVJJQ29tcG9uZW50KHJlc3VsdHNbMV0ucmVwbGFjZSgvXFwrL2csIFwiIFwiKSk7XG59O1xuXG5VdGlsLmlzTGFuZHNjYXBlTW9kZSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gKHdpbmRvdy5vcmllbnRhdGlvbiA9PSA5MCB8fCB3aW5kb3cub3JpZW50YXRpb24gPT0gLTkwKTtcbn07XG5cblV0aWwuZ2V0U2NyZWVuV2lkdGggPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIE1hdGgubWF4KHdpbmRvdy5zY3JlZW4ud2lkdGgsIHdpbmRvdy5zY3JlZW4uaGVpZ2h0KSAqXG4gICAgICB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbztcbn07XG5cblV0aWwuZ2V0U2NyZWVuSGVpZ2h0ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBNYXRoLm1pbih3aW5kb3cuc2NyZWVuLndpZHRoLCB3aW5kb3cuc2NyZWVuLmhlaWdodCkgKlxuICAgICAgd2luZG93LmRldmljZVBpeGVsUmF0aW87XG59O1xuXG4vKipcbiAqIFV0aWxpdHkgdG8gY29udmVydCB0aGUgcHJvamVjdGlvbiBtYXRyaXggdG8gYSB2ZWN0b3IgYWNjZXB0ZWQgYnkgdGhlIHNoYWRlci5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0X3BhcmFtcyBBIHJlY3RhbmdsZSB0byBzY2FsZSB0aGlzIHZlY3RvciBieS5cbiAqL1xuVXRpbC5wcm9qZWN0aW9uTWF0cml4VG9WZWN0b3JfID0gZnVuY3Rpb24obWF0cml4LCBvcHRfcGFyYW1zKSB7XG4gIHZhciBwYXJhbXMgPSBvcHRfcGFyYW1zIHx8IHt9O1xuICB2YXIgeFNjYWxlID0gcGFyYW1zLnhTY2FsZSB8fCAxO1xuICB2YXIgeVNjYWxlID0gcGFyYW1zLnlTY2FsZSB8fCAxO1xuICB2YXIgeFRyYW5zID0gcGFyYW1zLnhUcmFucyB8fCAwO1xuICB2YXIgeVRyYW5zID0gcGFyYW1zLnlUcmFucyB8fCAwO1xuXG4gIHZhciBlbGVtZW50cyA9IG1hdHJpeC5lbGVtZW50cztcbiAgdmFyIHZlYyA9IG5ldyBUSFJFRS5WZWN0b3I0KCk7XG4gIHZlYy5zZXQoZWxlbWVudHNbNCowICsgMF0gKiB4U2NhbGUsXG4gICAgICAgICAgZWxlbWVudHNbNCoxICsgMV0gKiB5U2NhbGUsXG4gICAgICAgICAgZWxlbWVudHNbNCoyICsgMF0gLSAxIC0geFRyYW5zLFxuICAgICAgICAgIGVsZW1lbnRzWzQqMiArIDFdIC0gMSAtIHlUcmFucykuZGl2aWRlU2NhbGFyKDIpO1xuICByZXR1cm4gdmVjO1xufTtcblxuVXRpbC5sZWZ0UHJvamVjdGlvblZlY3RvclRvUmlnaHRfID0gZnVuY3Rpb24obGVmdCkge1xuICAvL3Byb2plY3Rpb25MZWZ0ICsgdmVjNCgwLjAsIDAuMCwgMS4wLCAwLjApKSAqIHZlYzQoMS4wLCAxLjAsIC0xLjAsIDEuMCk7XG4gIHZhciBvdXQgPSBuZXcgVEhSRUUuVmVjdG9yNCgwLCAwLCAxLCAwKTtcbiAgb3V0LmFkZChsZWZ0KTsgLy8gb3V0ID0gbGVmdCArICgwLCAwLCAxLCAwKS5cbiAgb3V0LnogKj0gLTE7IC8vIEZsaXAgei5cblxuICByZXR1cm4gb3V0O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBVdGlsO1xuIiwiLypcbiAqIENvcHlyaWdodCAyMDE1IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxudmFyIEJ1dHRvbk1hbmFnZXIgPSByZXF1aXJlKCcuL2J1dHRvbi1tYW5hZ2VyLmpzJyk7XG52YXIgRW1pdHRlciA9IHJlcXVpcmUoJy4vZW1pdHRlci5qcycpO1xudmFyIE1vZGVzID0gcmVxdWlyZSgnLi9tb2Rlcy5qcycpO1xudmFyIFV0aWwgPSByZXF1aXJlKCcuL3V0aWwuanMnKTtcblxuLyoqXG4gKiBIZWxwZXIgZm9yIGdldHRpbmcgaW4gYW5kIG91dCBvZiBWUiBtb2RlLlxuICovXG5mdW5jdGlvbiBXZWJWUk1hbmFnZXIocmVuZGVyZXIsIGVmZmVjdCwgcGFyYW1zKSB7XG4gIHRoaXMucGFyYW1zID0gcGFyYW1zIHx8IHt9O1xuXG4gIHRoaXMubW9kZSA9IE1vZGVzLlVOS05PV047XG5cbiAgLy8gU2V0IG9wdGlvbiB0byBoaWRlIHRoZSBidXR0b24uXG4gIHRoaXMuaGlkZUJ1dHRvbiA9IHRoaXMucGFyYW1zLmhpZGVCdXR0b24gfHwgZmFsc2U7XG4gIC8vIFdoZXRoZXIgb3Igbm90IHRoZSBGT1Ygc2hvdWxkIGJlIGRpc3RvcnRlZCBvciB1bi1kaXN0b3J0ZWQuIEJ5IGRlZmF1bHQsIGl0XG4gIC8vIHNob3VsZCBiZSBkaXN0b3J0ZWQsIGJ1dCBpbiB0aGUgY2FzZSBvZiB2ZXJ0ZXggc2hhZGVyIGJhc2VkIGRpc3RvcnRpb24sXG4gIC8vIGVuc3VyZSB0aGF0IHdlIHVzZSB1bmRpc3RvcnRlZCBwYXJhbWV0ZXJzLlxuICB0aGlzLnByZWRpc3RvcnRlZCA9ICEhdGhpcy5wYXJhbXMucHJlZGlzdG9ydGVkO1xuXG4gIC8vIFNhdmUgdGhlIFRIUkVFLmpzIHJlbmRlcmVyIGFuZCBlZmZlY3QgZm9yIGxhdGVyLlxuICB0aGlzLnJlbmRlcmVyID0gcmVuZGVyZXI7XG4gIHRoaXMuZWZmZWN0ID0gZWZmZWN0O1xuICB2YXIgcG9seWZpbGxXcmFwcGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLndlYnZyLXBvbHlmaWxsLWZ1bGxzY3JlZW4td3JhcHBlcicpO1xuICB0aGlzLmJ1dHRvbiA9IG5ldyBCdXR0b25NYW5hZ2VyKHBvbHlmaWxsV3JhcHBlcik7XG5cbiAgdGhpcy5pc0Z1bGxzY3JlZW5EaXNhYmxlZCA9ICEhVXRpbC5nZXRRdWVyeVBhcmFtZXRlcignbm9fZnVsbHNjcmVlbicpO1xuICB0aGlzLnN0YXJ0TW9kZSA9IE1vZGVzLk5PUk1BTDtcbiAgdmFyIHN0YXJ0TW9kZVBhcmFtID0gcGFyc2VJbnQoVXRpbC5nZXRRdWVyeVBhcmFtZXRlcignc3RhcnRfbW9kZScpKTtcbiAgaWYgKCFpc05hTihzdGFydE1vZGVQYXJhbSkpIHtcbiAgICB0aGlzLnN0YXJ0TW9kZSA9IHN0YXJ0TW9kZVBhcmFtO1xuICB9XG5cbiAgaWYgKHRoaXMuaGlkZUJ1dHRvbikge1xuICAgIHRoaXMuYnV0dG9uLnNldFZpc2liaWxpdHkoZmFsc2UpO1xuICB9XG5cbiAgLy8gQ2hlY2sgaWYgdGhlIGJyb3dzZXIgaXMgY29tcGF0aWJsZSB3aXRoIFdlYlZSLlxuICB0aGlzLmdldERldmljZUJ5VHlwZV8oVlJEaXNwbGF5KS50aGVuKGZ1bmN0aW9uKGhtZCkge1xuICAgIHRoaXMuaG1kID0gaG1kO1xuXG4gICAgLy8gT25seSBlbmFibGUgVlIgbW9kZSBpZiB0aGVyZSdzIGEgVlIgZGV2aWNlIGF0dGFjaGVkIG9yIHdlIGFyZSBydW5uaW5nIHRoZVxuICAgIC8vIHBvbHlmaWxsIG9uIG1vYmlsZS5cbiAgICB0aGlzLmlzVlJDb21wYXRpYmxlID0gICFobWQuaXNQb2x5ZmlsbGVkIHx8IFV0aWwuaXNNb2JpbGUoKTtcblxuICAgIHN3aXRjaCAodGhpcy5zdGFydE1vZGUpIHtcbiAgICAgIGNhc2UgTW9kZXMuTUFHSUNfV0lORE9XOlxuICAgICAgICB0aGlzLnNldE1vZGVfKE1vZGVzLk1BR0lDX1dJTkRPVyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBNb2Rlcy5WUjpcbiAgICAgICAgdGhpcy5lbnRlclZSTW9kZV8oKTtcbiAgICAgICAgdGhpcy5zZXRNb2RlXyhNb2Rlcy5WUik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhpcy5zZXRNb2RlXyhNb2Rlcy5OT1JNQUwpO1xuICAgIH1cblxuICAgIHRoaXMuZW1pdCgnaW5pdGlhbGl6ZWQnKTtcbiAgfS5iaW5kKHRoaXMpKTtcblxuICAvLyBIb29rIHVwIGJ1dHRvbiBsaXN0ZW5lcnMuXG4gIHRoaXMuYnV0dG9uLm9uKCdmcycsIHRoaXMub25GU0NsaWNrXy5iaW5kKHRoaXMpKTtcbiAgdGhpcy5idXR0b24ub24oJ3ZyJywgdGhpcy5vblZSQ2xpY2tfLmJpbmQodGhpcykpO1xuXG4gIC8vIEJpbmQgdG8gZnVsbHNjcmVlbiBldmVudHMuXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3dlYmtpdGZ1bGxzY3JlZW5jaGFuZ2UnLFxuICAgICAgdGhpcy5vbkZ1bGxzY3JlZW5DaGFuZ2VfLmJpbmQodGhpcykpO1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3pmdWxsc2NyZWVuY2hhbmdlJyxcbiAgICAgIHRoaXMub25GdWxsc2NyZWVuQ2hhbmdlXy5iaW5kKHRoaXMpKTtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbXNmdWxsc2NyZWVuY2hhbmdlJyxcbiAgICAgIHRoaXMub25GdWxsc2NyZWVuQ2hhbmdlXy5iaW5kKHRoaXMpKTtcblxuICAvLyBCaW5kIHRvIFZSKiBzcGVjaWZpYyBldmVudHMuXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCd2cmRpc3BsYXlwcmVzZW50Y2hhbmdlJyxcbiAgICAgIHRoaXMub25WUkRpc3BsYXlQcmVzZW50Q2hhbmdlXy5iaW5kKHRoaXMpKTtcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3ZyZGlzcGxheWRldmljZXBhcmFtc2NoYW5nZScsXG4gICAgICB0aGlzLm9uVlJEaXNwbGF5RGV2aWNlUGFyYW1zQ2hhbmdlXy5iaW5kKHRoaXMpKTtcbn1cblxuV2ViVlJNYW5hZ2VyLnByb3RvdHlwZSA9IG5ldyBFbWl0dGVyKCk7XG5cbi8vIEV4cG9zZSB0aGVzZSB2YWx1ZXMgZXh0ZXJuYWxseS5cbldlYlZSTWFuYWdlci5Nb2RlcyA9IE1vZGVzO1xuXG4vKipcbiAqIFByb21pc2UgcmV0dXJucyB0cnVlIGlmIHRoZXJlIGlzIGF0IGxlYXN0IG9uZSBITUQgZGV2aWNlIGF2YWlsYWJsZS5cbiAqL1xuV2ViVlJNYW5hZ2VyLnByb3RvdHlwZS5nZXREZXZpY2VCeVR5cGVfID0gZnVuY3Rpb24odHlwZSkge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgbmF2aWdhdG9yLmdldFZSRGlzcGxheXMoKS50aGVuKGZ1bmN0aW9uKGRpc3BsYXlzKSB7XG4gICAgICAvLyBQcm9taXNlIHN1Y2NlZWRzLCBidXQgY2hlY2sgaWYgdGhlcmUgYXJlIGFueSBkaXNwbGF5cyBhY3R1YWxseS5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGlzcGxheXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGRpc3BsYXlzW2ldIGluc3RhbmNlb2YgdHlwZSkge1xuICAgICAgICAgIHJlc29sdmUoZGlzcGxheXNbaV0pO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXNvbHZlKG51bGwpO1xuICAgIH0sIGZ1bmN0aW9uKCkge1xuICAgICAgLy8gTm8gZGlzcGxheXMgYXJlIGZvdW5kLlxuICAgICAgcmVzb2x2ZShudWxsKTtcbiAgICB9KTtcbiAgfSk7XG59O1xuXG5XZWJWUk1hbmFnZXIucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uKHNjZW5lLCBjYW1lcmEsIHRpbWVzdGFtcCkge1xuICAvLyBTY2VuZSBtYXkgYmUgYW4gYXJyYXkgb2YgdHdvIHNjZW5lcywgb25lIGZvciBlYWNoIGV5ZS5cbiAgaWYgKHNjZW5lIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICB0aGlzLmVmZmVjdC5yZW5kZXIoc2NlbmVbMF0sIGNhbWVyYSk7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5lZmZlY3QucmVuZGVyKHNjZW5lLCBjYW1lcmEpO1xuICB9XG59O1xuXG4vKipcbiAqIEhlbHBlciBmb3IgZW50ZXJpbmcgVlIgbW9kZS5cbiAqL1xuV2ViVlJNYW5hZ2VyLnByb3RvdHlwZS5lbnRlclZSTW9kZV8gPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5obWQucmVxdWVzdFByZXNlbnQoe1xuICAgIHNvdXJjZTogdGhpcy5yZW5kZXJlci5kb21FbGVtZW50LFxuICAgIHByZWRpc3RvcnRlZDogdGhpcy5wcmVkaXN0b3J0ZWRcbiAgfSk7XG59O1xuXG5XZWJWUk1hbmFnZXIucHJvdG90eXBlLnNldE1vZGVfID0gZnVuY3Rpb24obW9kZSkge1xuICB2YXIgb2xkTW9kZSA9IHRoaXMubW9kZTtcbiAgaWYgKG1vZGUgPT0gdGhpcy5tb2RlKSB7XG4gICAgY29uc29sZS53YXJuKCdOb3QgY2hhbmdpbmcgbW9kZXMsIGFscmVhZHkgaW4gJXMnLCBtb2RlKTtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc29sZS5sb2coJ01vZGUgY2hhbmdlOiAlcyA9PiAlcycsIHRoaXMubW9kZSwgbW9kZSk7XG4gIHRoaXMubW9kZSA9IG1vZGU7XG4gIHRoaXMuYnV0dG9uLnNldE1vZGUobW9kZSwgdGhpcy5pc1ZSQ29tcGF0aWJsZSk7XG5cbiAgLy8gRW1pdCBhbiBldmVudCBpbmRpY2F0aW5nIHRoZSBtb2RlIGNoYW5nZWQuXG4gIHRoaXMuZW1pdCgnbW9kZWNoYW5nZScsIG1vZGUsIG9sZE1vZGUpO1xufTtcblxuLyoqXG4gKiBNYWluIGJ1dHRvbiB3YXMgY2xpY2tlZC5cbiAqL1xuV2ViVlJNYW5hZ2VyLnByb3RvdHlwZS5vbkZTQ2xpY2tfID0gZnVuY3Rpb24oKSB7XG4gIHN3aXRjaCAodGhpcy5tb2RlKSB7XG4gICAgY2FzZSBNb2Rlcy5OT1JNQUw6XG4gICAgICAvLyBUT0RPOiBSZW1vdmUgdGhpcyBoYWNrIGlmL3doZW4gaU9TIGdldHMgcmVhbCBmdWxsc2NyZWVuIG1vZGUuXG4gICAgICAvLyBJZiB0aGlzIGlzIGFuIGlmcmFtZSBvbiBpT1MsIGJyZWFrIG91dCBhbmQgb3BlbiBpbiBub19mdWxsc2NyZWVuIG1vZGUuXG4gICAgICBpZiAoVXRpbC5pc0lPUygpICYmIFV0aWwuaXNJRnJhbWUoKSkge1xuICAgICAgICB2YXIgdXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG4gICAgICAgIHVybCA9IFV0aWwuYXBwZW5kUXVlcnlQYXJhbWV0ZXIodXJsLCAnbm9fZnVsbHNjcmVlbicsICd0cnVlJyk7XG4gICAgICAgIHVybCA9IFV0aWwuYXBwZW5kUXVlcnlQYXJhbWV0ZXIodXJsLCAnc3RhcnRfbW9kZScsIE1vZGVzLk1BR0lDX1dJTkRPVyk7XG4gICAgICAgIHRvcC5sb2NhdGlvbi5ocmVmID0gdXJsO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0aGlzLnNldE1vZGVfKE1vZGVzLk1BR0lDX1dJTkRPVyk7XG4gICAgICB0aGlzLnJlcXVlc3RGdWxsc2NyZWVuXygpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBNb2Rlcy5NQUdJQ19XSU5ET1c6XG4gICAgICBpZiAodGhpcy5pc0Z1bGxzY3JlZW5EaXNhYmxlZCkge1xuICAgICAgICB3aW5kb3cuaGlzdG9yeS5iYWNrKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHRoaXMuc2V0TW9kZV8oTW9kZXMuTk9STUFMKTtcbiAgICAgIHRoaXMuZXhpdEZ1bGxzY3JlZW5fKCk7XG4gICAgICBicmVhaztcbiAgfVxufTtcblxuLyoqXG4gKiBUaGUgVlIgYnV0dG9uIHdhcyBjbGlja2VkLlxuICovXG5XZWJWUk1hbmFnZXIucHJvdG90eXBlLm9uVlJDbGlja18gPSBmdW5jdGlvbigpIHtcbiAgLy8gVE9ETzogUmVtb3ZlIHRoaXMgaGFjayB3aGVuIGlPUyBoYXMgZnVsbHNjcmVlbiBtb2RlLlxuICAvLyBJZiB0aGlzIGlzIGFuIGlmcmFtZSBvbiBpT1MsIGJyZWFrIG91dCBhbmQgb3BlbiBpbiBub19mdWxsc2NyZWVuIG1vZGUuXG4gIGlmICh0aGlzLm1vZGUgPT0gTW9kZXMuTk9STUFMICYmIFV0aWwuaXNJT1MoKSAmJiBVdGlsLmlzSUZyYW1lKCkpIHtcbiAgICB2YXIgdXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG4gICAgdXJsID0gVXRpbC5hcHBlbmRRdWVyeVBhcmFtZXRlcih1cmwsICdub19mdWxsc2NyZWVuJywgJ3RydWUnKTtcbiAgICB1cmwgPSBVdGlsLmFwcGVuZFF1ZXJ5UGFyYW1ldGVyKHVybCwgJ3N0YXJ0X21vZGUnLCBNb2Rlcy5WUik7XG4gICAgdG9wLmxvY2F0aW9uLmhyZWYgPSB1cmw7XG4gICAgcmV0dXJuO1xuICB9XG4gIHRoaXMuZW50ZXJWUk1vZGVfKCk7XG59O1xuXG5XZWJWUk1hbmFnZXIucHJvdG90eXBlLnJlcXVlc3RGdWxsc2NyZWVuXyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgY2FudmFzID0gZG9jdW1lbnQuYm9keTtcbiAgLy92YXIgY2FudmFzID0gdGhpcy5yZW5kZXJlci5kb21FbGVtZW50O1xuICBpZiAoY2FudmFzLnJlcXVlc3RGdWxsc2NyZWVuKSB7XG4gICAgY2FudmFzLnJlcXVlc3RGdWxsc2NyZWVuKCk7XG4gIH0gZWxzZSBpZiAoY2FudmFzLm1velJlcXVlc3RGdWxsU2NyZWVuKSB7XG4gICAgY2FudmFzLm1velJlcXVlc3RGdWxsU2NyZWVuKCk7XG4gIH0gZWxzZSBpZiAoY2FudmFzLndlYmtpdFJlcXVlc3RGdWxsc2NyZWVuKSB7XG4gICAgY2FudmFzLndlYmtpdFJlcXVlc3RGdWxsc2NyZWVuKCk7XG4gIH0gZWxzZSBpZiAoY2FudmFzLm1zUmVxdWVzdEZ1bGxzY3JlZW4pIHtcbiAgICBjYW52YXMubXNSZXF1ZXN0RnVsbHNjcmVlbigpO1xuICB9XG59O1xuXG5XZWJWUk1hbmFnZXIucHJvdG90eXBlLmV4aXRGdWxsc2NyZWVuXyA9IGZ1bmN0aW9uKCkge1xuICBpZiAoZG9jdW1lbnQuZXhpdEZ1bGxzY3JlZW4pIHtcbiAgICBkb2N1bWVudC5leGl0RnVsbHNjcmVlbigpO1xuICB9IGVsc2UgaWYgKGRvY3VtZW50Lm1vekNhbmNlbEZ1bGxTY3JlZW4pIHtcbiAgICBkb2N1bWVudC5tb3pDYW5jZWxGdWxsU2NyZWVuKCk7XG4gIH0gZWxzZSBpZiAoZG9jdW1lbnQud2Via2l0RXhpdEZ1bGxzY3JlZW4pIHtcbiAgICBkb2N1bWVudC53ZWJraXRFeGl0RnVsbHNjcmVlbigpO1xuICB9IGVsc2UgaWYgKGRvY3VtZW50Lm1zRXhpdEZ1bGxzY3JlZW4pIHtcbiAgICBkb2N1bWVudC5tc0V4aXRGdWxsc2NyZWVuKCk7XG4gIH1cbn07XG5cbldlYlZSTWFuYWdlci5wcm90b3R5cGUub25WUkRpc3BsYXlQcmVzZW50Q2hhbmdlXyA9IGZ1bmN0aW9uKGUpIHtcbiAgY29uc29sZS5sb2coJ29uVlJEaXNwbGF5UHJlc2VudENoYW5nZV8nLCBlKTtcbiAgaWYgKHRoaXMuaG1kLmlzUHJlc2VudGluZykge1xuICAgIHRoaXMuc2V0TW9kZV8oTW9kZXMuVlIpO1xuICB9IGVsc2Uge1xuICAgIHRoaXMuc2V0TW9kZV8oTW9kZXMuTk9STUFMKTtcbiAgfVxufTtcblxuV2ViVlJNYW5hZ2VyLnByb3RvdHlwZS5vblZSRGlzcGxheURldmljZVBhcmFtc0NoYW5nZV8gPSBmdW5jdGlvbihlKSB7XG4gIGNvbnNvbGUubG9nKCdvblZSRGlzcGxheURldmljZVBhcmFtc0NoYW5nZV8nLCBlKTtcbn07XG5cbldlYlZSTWFuYWdlci5wcm90b3R5cGUub25GdWxsc2NyZWVuQ2hhbmdlXyA9IGZ1bmN0aW9uKGUpIHtcbiAgLy8gSWYgd2UgbGVhdmUgZnVsbC1zY3JlZW4sIGdvIGJhY2sgdG8gbm9ybWFsIG1vZGUuXG4gIGlmIChkb2N1bWVudC53ZWJraXRGdWxsc2NyZWVuRWxlbWVudCA9PT0gbnVsbCB8fFxuICAgICAgZG9jdW1lbnQubW96RnVsbFNjcmVlbkVsZW1lbnQgPT09IG51bGwpIHtcbiAgICB0aGlzLnNldE1vZGVfKE1vZGVzLk5PUk1BTCk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gV2ViVlJNYW5hZ2VyO1xuIl19
