(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

var Emitter = require('./emitter.js');
var Modes = require('./modes.js');
var Util = require('./util.js');

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

},{"./emitter.js":2,"./modes.js":4,"./util.js":5}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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

var WebVRManager = require('./webvr-manager.js');

window.WebVRConfig = window.WebVRConfig || {};
window.WebVRManager = WebVRManager;

},{"./webvr-manager.js":6}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

var ButtonManager = require('./button-manager.js');
var Emitter = require('./emitter.js');
var Modes = require('./modes.js');
var Util = require('./util.js');

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
  this.isUndistorted = !!this.params.isUndistorted;

  // Save the THREE.js renderer and effect for later.
  this.renderer = renderer;
  this.effect = effect;
  var polyfillWrapper = document.querySelector('.webvr-polyfill-fullscreen-wrapper');
  this.button = new ButtonManager(polyfillWrapper);

  // Only enable VR mode if we're on a mobile device.
  this.isVRCompatible = Util.isMobile();

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

    this.emit('initialized');
  }.bind(this));

  switch (this.startMode) {
    case Modes.MAGIC_WINDOW:
      this.setMode_(Modes.MAGIC_WINDOW);
      break;
    case Modes.VR:
      this.setMode_(Modes.VR);
      break;
    default:
      this.setMode_(Modes.NORMAL);
  }

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
    navigator.getVRDisplays().then(function(devices) {
      // Promise succeeds, but check if there are any devices actually.
      for (var i = 0; i < devices.length; i++) {
        if (devices[i] instanceof type) {
          resolve(devices[i]);
          break;
        }
      }
      resolve(null);
    }, function() {
      // No devices are found.
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

WebVRManager.prototype.setMode_ = function(mode) {
  var oldMode = this.mode;
  if (mode == this.mode) {
    console.error('Not changing modes, already in %s', mode);
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
  this.hmd.requestPresent({source: this.renderer.domElement});
  this.setMode_(Modes.VR);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWVicmV3L2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9idXR0b24tbWFuYWdlci5qcyIsInNyYy9lbWl0dGVyLmpzIiwic3JjL21haW4uanMiLCJzcmMvbW9kZXMuanMiLCJzcmMvdXRpbC5qcyIsInNyYy93ZWJ2ci1tYW5hZ2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKlxuICogQ29weXJpZ2h0IDIwMTUgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG52YXIgRW1pdHRlciA9IHJlcXVpcmUoJy4vZW1pdHRlci5qcycpO1xudmFyIE1vZGVzID0gcmVxdWlyZSgnLi9tb2Rlcy5qcycpO1xudmFyIFV0aWwgPSByZXF1aXJlKCcuL3V0aWwuanMnKTtcblxuLyoqXG4gKiBFdmVyeXRoaW5nIGhhdmluZyB0byBkbyB3aXRoIHRoZSBXZWJWUiBidXR0b24uXG4gKiBFbWl0cyBhICdjbGljaycgZXZlbnQgd2hlbiBpdCdzIGNsaWNrZWQuXG4gKi9cbmZ1bmN0aW9uIEJ1dHRvbk1hbmFnZXIob3B0X3Jvb3QpIHtcbiAgdmFyIHJvb3QgPSBvcHRfcm9vdCB8fCBkb2N1bWVudC5ib2R5O1xuICB0aGlzLmxvYWRJY29uc18oKTtcblxuICAvLyBNYWtlIHRoZSBmdWxsc2NyZWVuIGJ1dHRvbi5cbiAgdmFyIGZzQnV0dG9uID0gdGhpcy5jcmVhdGVCdXR0b24oKTtcbiAgZnNCdXR0b24uc3JjID0gdGhpcy5JQ09OUy5mdWxsc2NyZWVuO1xuICBmc0J1dHRvbi50aXRsZSA9ICdGdWxsc2NyZWVuIG1vZGUnO1xuICB2YXIgcyA9IGZzQnV0dG9uLnN0eWxlO1xuICBzLmJvdHRvbSA9IDA7XG4gIHMucmlnaHQgPSAwO1xuICBmc0J1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuY3JlYXRlQ2xpY2tIYW5kbGVyXygnZnMnKSk7XG4gIHJvb3QuYXBwZW5kQ2hpbGQoZnNCdXR0b24pO1xuICB0aGlzLmZzQnV0dG9uID0gZnNCdXR0b247XG5cbiAgLy8gTWFrZSB0aGUgVlIgYnV0dG9uLlxuICB2YXIgdnJCdXR0b24gPSB0aGlzLmNyZWF0ZUJ1dHRvbigpO1xuICB2ckJ1dHRvbi5zcmMgPSB0aGlzLklDT05TLmNhcmRib2FyZDtcbiAgdnJCdXR0b24udGl0bGUgPSAnVmlydHVhbCByZWFsaXR5IG1vZGUnO1xuICB2YXIgcyA9IHZyQnV0dG9uLnN0eWxlO1xuICBzLmJvdHRvbSA9IDA7XG4gIHMucmlnaHQgPSAnNDhweCc7XG4gIHZyQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5jcmVhdGVDbGlja0hhbmRsZXJfKCd2cicpKTtcbiAgcm9vdC5hcHBlbmRDaGlsZCh2ckJ1dHRvbik7XG4gIHRoaXMudnJCdXR0b24gPSB2ckJ1dHRvbjtcblxuICB0aGlzLmlzVmlzaWJsZSA9IHRydWU7XG5cbn1cbkJ1dHRvbk1hbmFnZXIucHJvdG90eXBlID0gbmV3IEVtaXR0ZXIoKTtcblxuQnV0dG9uTWFuYWdlci5wcm90b3R5cGUuY3JlYXRlQnV0dG9uID0gZnVuY3Rpb24oKSB7XG4gIHZhciBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgYnV0dG9uLmNsYXNzTmFtZSA9ICd3ZWJ2ci1idXR0b24nO1xuICB2YXIgcyA9IGJ1dHRvbi5zdHlsZTtcbiAgcy5wb3NpdGlvbiA9ICdmaXhlZCc7XG4gIHMud2lkdGggPSAnMjRweCdcbiAgcy5oZWlnaHQgPSAnMjRweCc7XG4gIHMuYmFja2dyb3VuZFNpemUgPSAnY292ZXInO1xuICBzLmJhY2tncm91bmRDb2xvciA9ICd0cmFuc3BhcmVudCc7XG4gIHMuYm9yZGVyID0gMDtcbiAgcy51c2VyU2VsZWN0ID0gJ25vbmUnO1xuICBzLndlYmtpdFVzZXJTZWxlY3QgPSAnbm9uZSc7XG4gIHMuTW96VXNlclNlbGVjdCA9ICdub25lJztcbiAgcy5jdXJzb3IgPSAncG9pbnRlcic7XG4gIHMucGFkZGluZyA9ICcxMnB4JztcbiAgcy56SW5kZXggPSAxO1xuICBzLmRpc3BsYXkgPSAnbm9uZSc7XG5cbiAgLy8gUHJldmVudCBidXR0b24gZnJvbSBiZWluZyBzZWxlY3RlZCBhbmQgZHJhZ2dlZC5cbiAgYnV0dG9uLmRyYWdnYWJsZSA9IGZhbHNlO1xuICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignZHJhZ3N0YXJ0JywgZnVuY3Rpb24oZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgfSk7XG5cbiAgLy8gU3R5bGUgaXQgb24gaG92ZXIuXG4gIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgZnVuY3Rpb24oZSkge1xuICAgIHMuZmlsdGVyID0gcy53ZWJraXRGaWx0ZXIgPSAnZHJvcC1zaGFkb3coMCAwIDVweCByZ2JhKDI1NSwyNTUsMjU1LDEpKSc7XG4gIH0pO1xuICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIGZ1bmN0aW9uKGUpIHtcbiAgICBzLmZpbHRlciA9IHMud2Via2l0RmlsdGVyID0gJyc7XG4gIH0pO1xuICByZXR1cm4gYnV0dG9uO1xufTtcblxuQnV0dG9uTWFuYWdlci5wcm90b3R5cGUuc2V0TW9kZSA9IGZ1bmN0aW9uKG1vZGUsIGlzVlJDb21wYXRpYmxlKSB7XG4gIGlzVlJDb21wYXRpYmxlID0gaXNWUkNvbXBhdGlibGUgfHwgV2ViVlJDb25maWcuRk9SQ0VfRU5BQkxFX1ZSO1xuICBpZiAoIXRoaXMuaXNWaXNpYmxlKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHN3aXRjaCAobW9kZSkge1xuICAgIGNhc2UgTW9kZXMuTk9STUFMOlxuICAgICAgdGhpcy5mc0J1dHRvbi5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgIHRoaXMuZnNCdXR0b24uc3JjID0gdGhpcy5JQ09OUy5mdWxsc2NyZWVuO1xuICAgICAgdGhpcy52ckJ1dHRvbi5zdHlsZS5kaXNwbGF5ID0gKGlzVlJDb21wYXRpYmxlID8gJ2Jsb2NrJyA6ICdub25lJyk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIE1vZGVzLk1BR0lDX1dJTkRPVzpcbiAgICAgIHRoaXMuZnNCdXR0b24uc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICB0aGlzLmZzQnV0dG9uLnNyYyA9IHRoaXMuSUNPTlMuZXhpdEZ1bGxzY3JlZW47XG4gICAgICB0aGlzLnZyQnV0dG9uLnN0eWxlLmRpc3BsYXkgPSAoaXNWUkNvbXBhdGlibGUgPyAnYmxvY2snIDogJ25vbmUnKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgTW9kZXMuVlI6XG4gICAgICB0aGlzLmZzQnV0dG9uLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICB0aGlzLnZyQnV0dG9uLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICBicmVhaztcbiAgfVxuXG4gIC8vIEhhY2sgZm9yIFNhZmFyaSBNYWMvaU9TIHRvIGZvcmNlIHJlbGF5b3V0IChzdmctc3BlY2lmaWMgaXNzdWUpXG4gIC8vIGh0dHA6Ly9nb28uZ2wvaGpnUjZyXG4gIHZhciBvbGRWYWx1ZSA9IHRoaXMuZnNCdXR0b24uc3R5bGUuZGlzcGxheTtcbiAgdGhpcy5mc0J1dHRvbi5zdHlsZS5kaXNwbGF5ID0gJ2lubGluZS1ibG9jayc7XG4gIHRoaXMuZnNCdXR0b24ub2Zmc2V0SGVpZ2h0O1xuICB0aGlzLmZzQnV0dG9uLnN0eWxlLmRpc3BsYXkgPSBvbGRWYWx1ZTtcbn07XG5cbkJ1dHRvbk1hbmFnZXIucHJvdG90eXBlLnNldFZpc2liaWxpdHkgPSBmdW5jdGlvbihpc1Zpc2libGUpIHtcbiAgdGhpcy5pc1Zpc2libGUgPSBpc1Zpc2libGU7XG4gIHRoaXMuZnNCdXR0b24uc3R5bGUuZGlzcGxheSA9IGlzVmlzaWJsZSA/ICdibG9jaycgOiAnbm9uZSc7XG4gIHRoaXMudnJCdXR0b24uc3R5bGUuZGlzcGxheSA9IGlzVmlzaWJsZSA/ICdibG9jaycgOiAnbm9uZSc7XG59O1xuXG5CdXR0b25NYW5hZ2VyLnByb3RvdHlwZS5jcmVhdGVDbGlja0hhbmRsZXJfID0gZnVuY3Rpb24oZXZlbnROYW1lKSB7XG4gIHJldHVybiBmdW5jdGlvbihlKSB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGhpcy5lbWl0KGV2ZW50TmFtZSk7XG4gIH0uYmluZCh0aGlzKTtcbn07XG5cbkJ1dHRvbk1hbmFnZXIucHJvdG90eXBlLmxvYWRJY29uc18gPSBmdW5jdGlvbigpIHtcbiAgLy8gUHJlbG9hZCBzb21lIGhhcmQtY29kZWQgU1ZHLlxuICB0aGlzLklDT05TID0ge307XG4gIHRoaXMuSUNPTlMuY2FyZGJvYXJkID0gVXRpbC5iYXNlNjQoJ2ltYWdlL3N2Zyt4bWwnLCAnUEhOMlp5QjRiV3h1Y3owaWFIUjBjRG92TDNkM2R5NTNNeTV2Y21jdk1qQXdNQzl6ZG1jaUlIZHBaSFJvUFNJeU5IQjRJaUJvWldsbmFIUTlJakkwY0hnaUlIWnBaWGRDYjNnOUlqQWdNQ0F5TkNBeU5DSWdabWxzYkQwaUkwWkdSa1pHUmlJK0NpQWdJQ0E4Y0dGMGFDQmtQU0pOTWpBdU56UWdOa2d6TGpJeFF6SXVOVFVnTmlBeUlEWXVOVGNnTWlBM0xqSTRkakV3TGpRMFl6QWdMamN1TlRVZ01TNHlPQ0F4TGpJeklERXVNamhvTkM0M09XTXVOVElnTUNBdU9UWXRMak16SURFdU1UUXRMamM1YkRFdU5DMHpMalE0WXk0eU15MHVOVGt1TnprdE1TNHdNU0F4TGpRMExURXVNREZ6TVM0eU1TNDBNaUF4TGpRMUlERXVNREZzTVM0ek9TQXpMalE0WXk0eE9TNDBOaTQyTXk0M09TQXhMakV4TGpjNWFEUXVOemxqTGpjeElEQWdNUzR5TmkwdU5UY2dNUzR5TmkweExqSTRWamN1TWpoak1DMHVOeTB1TlRVdE1TNHlPQzB4TGpJMkxURXVNamg2VFRjdU5TQXhOQzQyTW1NdE1TNHhOeUF3TFRJdU1UTXRMamsxTFRJdU1UTXRNaTR4TWlBd0xURXVNVGN1T1RZdE1pNHhNeUF5TGpFekxUSXVNVE1nTVM0eE9DQXdJREl1TVRJdU9UWWdNaTR4TWlBeUxqRXpjeTB1T1RVZ01pNHhNaTB5TGpFeUlESXVNVEo2YlRrZ01HTXRNUzR4TnlBd0xUSXVNVE10TGprMUxUSXVNVE10TWk0eE1pQXdMVEV1TVRjdU9UWXRNaTR4TXlBeUxqRXpMVEl1TVROek1pNHhNaTQ1TmlBeUxqRXlJREl1TVRNdExqazFJREl1TVRJdE1pNHhNaUF5TGpFeWVpSXZQZ29nSUNBZ1BIQmhkR2dnWm1sc2JEMGlibTl1WlNJZ1pEMGlUVEFnTUdneU5IWXlORWd3VmpCNklpOCtDand2YzNablBnbz0nKTtcbiAgdGhpcy5JQ09OUy5mdWxsc2NyZWVuID0gVXRpbC5iYXNlNjQoJ2ltYWdlL3N2Zyt4bWwnLCAnUEhOMlp5QjRiV3h1Y3owaWFIUjBjRG92TDNkM2R5NTNNeTV2Y21jdk1qQXdNQzl6ZG1jaUlIZHBaSFJvUFNJeU5IQjRJaUJvWldsbmFIUTlJakkwY0hnaUlIWnBaWGRDYjNnOUlqQWdNQ0F5TkNBeU5DSWdabWxzYkQwaUkwWkdSa1pHUmlJK0NpQWdJQ0E4Y0dGMGFDQmtQU0pOTUNBd2FESTBkakkwU0RCNklpQm1hV3hzUFNKdWIyNWxJaTgrQ2lBZ0lDQThjR0YwYUNCa1BTSk5OeUF4TkVnMWRqVm9OWFl0TWtnM2RpMHplbTB0TWkwMGFESldOMmd6VmpWSU5YWTFlbTB4TWlBM2FDMHpkakpvTlhZdE5XZ3RNbll6ZWsweE5DQTFkakpvTTNZemFESldOV2d0TlhvaUx6NEtQQzl6ZG1jK0NnPT0nKTtcbiAgdGhpcy5JQ09OUy5leGl0RnVsbHNjcmVlbiA9IFV0aWwuYmFzZTY0KCdpbWFnZS9zdmcreG1sJywgJ1BITjJaeUI0Yld4dWN6MGlhSFIwY0RvdkwzZDNkeTUzTXk1dmNtY3ZNakF3TUM5emRtY2lJSGRwWkhSb1BTSXlOSEI0SWlCb1pXbG5hSFE5SWpJMGNIZ2lJSFpwWlhkQ2IzZzlJakFnTUNBeU5DQXlOQ0lnWm1sc2JEMGlJMFpHUmtaR1JpSStDaUFnSUNBOGNHRjBhQ0JrUFNKTk1DQXdhREkwZGpJMFNEQjZJaUJtYVd4c1BTSnViMjVsSWk4K0NpQWdJQ0E4Y0dGMGFDQmtQU0pOTlNBeE5tZ3pkak5vTW5ZdE5VZzFkako2YlRNdE9FZzFkakpvTlZZMVNEaDJNM3B0TmlBeE1XZ3lkaTB6YUROMkxUSm9MVFYyTlhwdE1pMHhNVlkxYUMweWRqVm9OVlk0YUMwemVpSXZQZ284TDNOMlp6NEsnKTtcbiAgdGhpcy5JQ09OUy5zZXR0aW5ncyA9IFV0aWwuYmFzZTY0KCdpbWFnZS9zdmcreG1sJywgJ1BITjJaeUI0Yld4dWN6MGlhSFIwY0RvdkwzZDNkeTUzTXk1dmNtY3ZNakF3TUM5emRtY2lJSGRwWkhSb1BTSXlOSEI0SWlCb1pXbG5hSFE5SWpJMGNIZ2lJSFpwWlhkQ2IzZzlJakFnTUNBeU5DQXlOQ0lnWm1sc2JEMGlJMFpHUmtaR1JpSStDaUFnSUNBOGNHRjBhQ0JrUFNKTk1DQXdhREkwZGpJMFNEQjZJaUJtYVd4c1BTSnViMjVsSWk4K0NpQWdJQ0E4Y0dGMGFDQmtQU0pOTVRrdU5ETWdNVEl1T1RoakxqQTBMUzR6TWk0d055MHVOalF1TURjdExqazRjeTB1TURNdExqWTJMUzR3TnkwdU9UaHNNaTR4TVMweExqWTFZeTR4T1MwdU1UVXVNalF0TGpReUxqRXlMUzQyTkd3dE1pMHpMalEyWXkwdU1USXRMakl5TFM0ek9TMHVNeTB1TmpFdExqSXliQzB5TGpRNUlERmpMUzQxTWkwdU5DMHhMakE0TFM0M015MHhMalk1TFM0NU9Hd3RMak00TFRJdU5qVkRNVFF1TkRZZ01pNHhPQ0F4TkM0eU5TQXlJREUwSURKb0xUUmpMUzR5TlNBd0xTNDBOaTR4T0MwdU5Ea3VOREpzTFM0ek9DQXlMalkxWXkwdU5qRXVNalV0TVM0eE55NDFPUzB4TGpZNUxqazRiQzB5TGpRNUxURmpMUzR5TXkwdU1Ea3RMalE1SURBdExqWXhMakl5YkMweUlETXVORFpqTFM0eE15NHlNaTB1TURjdU5Ea3VNVEl1TmpSc01pNHhNU0F4TGpZMVl5MHVNRFF1TXpJdExqQTNMalkxTFM0d055NDVPSE11TURNdU5qWXVNRGN1T1Roc0xUSXVNVEVnTVM0Mk5XTXRMakU1TGpFMUxTNHlOQzQwTWkwdU1USXVOalJzTWlBekxqUTJZeTR4TWk0eU1pNHpPUzR6TGpZeExqSXliREl1TkRrdE1XTXVOVEl1TkNBeExqQTRMamN6SURFdU5qa3VPVGhzTGpNNElESXVOalZqTGpBekxqSTBMakkwTGpReUxqUTVMalF5YURSakxqSTFJREFnTGpRMkxTNHhPQzQwT1MwdU5ESnNMak00TFRJdU5qVmpMall4TFM0eU5TQXhMakUzTFM0MU9TQXhMalk1TFM0NU9Hd3lMalE1SURGakxqSXpMakE1TGpRNUlEQWdMall4TFM0eU1td3lMVE11TkRaakxqRXlMUzR5TWk0d055MHVORGt0TGpFeUxTNDJOR3d0TWk0eE1TMHhMalkxZWsweE1pQXhOUzQxWXkweExqa3pJREF0TXk0MUxURXVOVGN0TXk0MUxUTXVOWE14TGpVM0xUTXVOU0F6TGpVdE15NDFJRE11TlNBeExqVTNJRE11TlNBekxqVXRNUzQxTnlBekxqVXRNeTQxSURNdU5Yb2lMejRLUEM5emRtYytDZz09Jyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJ1dHRvbk1hbmFnZXI7XG4iLCIvKlxuICogQ29weXJpZ2h0IDIwMTUgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5mdW5jdGlvbiBFbWl0dGVyKCkge1xuICB0aGlzLmNhbGxiYWNrcyA9IHt9O1xufVxuXG5FbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24oZXZlbnROYW1lKSB7XG4gIHZhciBjYWxsYmFja3MgPSB0aGlzLmNhbGxiYWNrc1tldmVudE5hbWVdO1xuICBpZiAoIWNhbGxiYWNrcykge1xuICAgIC8vY29uc29sZS5sb2coJ05vIHZhbGlkIGNhbGxiYWNrIHNwZWNpZmllZC4nKTtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gIC8vIEVsaW1pbmF0ZSB0aGUgZmlyc3QgcGFyYW0gKHRoZSBjYWxsYmFjaykuXG4gIGFyZ3Muc2hpZnQoKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYWxsYmFja3MubGVuZ3RoOyBpKyspIHtcbiAgICBjYWxsYmFja3NbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gIH1cbn07XG5cbkVtaXR0ZXIucHJvdG90eXBlLm9uID0gZnVuY3Rpb24oZXZlbnROYW1lLCBjYWxsYmFjaykge1xuICBpZiAoZXZlbnROYW1lIGluIHRoaXMuY2FsbGJhY2tzKSB7XG4gICAgdGhpcy5jYWxsYmFja3NbZXZlbnROYW1lXS5wdXNoKGNhbGxiYWNrKTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLmNhbGxiYWNrc1tldmVudE5hbWVdID0gW2NhbGxiYWNrXTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBFbWl0dGVyO1xuIiwiLypcbiAqIENvcHlyaWdodCAyMDE1IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxudmFyIFdlYlZSTWFuYWdlciA9IHJlcXVpcmUoJy4vd2VidnItbWFuYWdlci5qcycpO1xuXG53aW5kb3cuV2ViVlJDb25maWcgPSB3aW5kb3cuV2ViVlJDb25maWcgfHwge307XG53aW5kb3cuV2ViVlJNYW5hZ2VyID0gV2ViVlJNYW5hZ2VyO1xuIiwiLypcbiAqIENvcHlyaWdodCAyMDE1IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxudmFyIE1vZGVzID0ge1xuICBVTktOT1dOOiAwLFxuICAvLyBOb3QgZnVsbHNjcmVlbiwganVzdCB0cmFja2luZy5cbiAgTk9STUFMOiAxLFxuICAvLyBNYWdpYyB3aW5kb3cgaW1tZXJzaXZlIG1vZGUuXG4gIE1BR0lDX1dJTkRPVzogMixcbiAgLy8gRnVsbCBzY3JlZW4gc3BsaXQgc2NyZWVuIFZSIG1vZGUuXG4gIFZSOiAzLFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBNb2RlcztcbiIsIi8qXG4gKiBDb3B5cmlnaHQgMjAxNSBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbnZhciBVdGlsID0ge307XG5cblV0aWwuYmFzZTY0ID0gZnVuY3Rpb24obWltZVR5cGUsIGJhc2U2NCkge1xuICByZXR1cm4gJ2RhdGE6JyArIG1pbWVUeXBlICsgJztiYXNlNjQsJyArIGJhc2U2NDtcbn07XG5cblV0aWwuaXNNb2JpbGUgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGNoZWNrID0gZmFsc2U7XG4gIChmdW5jdGlvbihhKXtpZigvKGFuZHJvaWR8YmJcXGQrfG1lZWdvKS4rbW9iaWxlfGF2YW50Z298YmFkYVxcL3xibGFja2JlcnJ5fGJsYXplcnxjb21wYWx8ZWxhaW5lfGZlbm5lY3xoaXB0b3B8aWVtb2JpbGV8aXAoaG9uZXxvZCl8aXJpc3xraW5kbGV8bGdlIHxtYWVtb3xtaWRwfG1tcHxtb2JpbGUuK2ZpcmVmb3h8bmV0ZnJvbnR8b3BlcmEgbShvYnxpbilpfHBhbG0oIG9zKT98cGhvbmV8cChpeGl8cmUpXFwvfHBsdWNrZXJ8cG9ja2V0fHBzcHxzZXJpZXMoNHw2KTB8c3ltYmlhbnx0cmVvfHVwXFwuKGJyb3dzZXJ8bGluayl8dm9kYWZvbmV8d2FwfHdpbmRvd3MgY2V8eGRhfHhpaW5vL2kudGVzdChhKXx8LzEyMDd8NjMxMHw2NTkwfDNnc298NHRocHw1MFsxLTZdaXw3NzBzfDgwMnN8YSB3YXxhYmFjfGFjKGVyfG9vfHNcXC0pfGFpKGtvfHJuKXxhbChhdnxjYXxjbyl8YW1vaXxhbihleHxueXx5dyl8YXB0dXxhcihjaHxnbyl8YXModGV8dXMpfGF0dHd8YXUoZGl8XFwtbXxyIHxzICl8YXZhbnxiZShja3xsbHxucSl8YmkobGJ8cmQpfGJsKGFjfGF6KXxicihlfHYpd3xidW1ifGJ3XFwtKG58dSl8YzU1XFwvfGNhcGl8Y2N3YXxjZG1cXC18Y2VsbHxjaHRtfGNsZGN8Y21kXFwtfGNvKG1wfG5kKXxjcmF3fGRhKGl0fGxsfG5nKXxkYnRlfGRjXFwtc3xkZXZpfGRpY2F8ZG1vYnxkbyhjfHApb3xkcygxMnxcXC1kKXxlbCg0OXxhaSl8ZW0obDJ8dWwpfGVyKGljfGswKXxlc2w4fGV6KFs0LTddMHxvc3x3YXx6ZSl8ZmV0Y3xmbHkoXFwtfF8pfGcxIHV8ZzU2MHxnZW5lfGdmXFwtNXxnXFwtbW98Z28oXFwud3xvZCl8Z3IoYWR8dW4pfGhhaWV8aGNpdHxoZFxcLShtfHB8dCl8aGVpXFwtfGhpKHB0fHRhKXxocCggaXxpcCl8aHNcXC1jfGh0KGMoXFwtfCB8X3xhfGd8cHxzfHQpfHRwKXxodShhd3x0Yyl8aVxcLSgyMHxnb3xtYSl8aTIzMHxpYWMoIHxcXC18XFwvKXxpYnJvfGlkZWF8aWcwMXxpa29tfGltMWt8aW5ub3xpcGFxfGlyaXN8amEodHx2KWF8amJyb3xqZW11fGppZ3N8a2RkaXxrZWppfGtndCggfFxcLyl8a2xvbnxrcHQgfGt3Y1xcLXxreW8oY3xrKXxsZShub3x4aSl8bGcoIGd8XFwvKGt8bHx1KXw1MHw1NHxcXC1bYS13XSl8bGlid3xseW54fG0xXFwtd3xtM2dhfG01MFxcL3xtYSh0ZXx1aXx4byl8bWMoMDF8MjF8Y2EpfG1cXC1jcnxtZShyY3xyaSl8bWkobzh8b2F8dHMpfG1tZWZ8bW8oMDF8MDJ8Yml8ZGV8ZG98dChcXC18IHxvfHYpfHp6KXxtdCg1MHxwMXx2ICl8bXdicHxteXdhfG4xMFswLTJdfG4yMFsyLTNdfG4zMCgwfDIpfG41MCgwfDJ8NSl8bjcoMCgwfDEpfDEwKXxuZSgoY3xtKVxcLXxvbnx0Znx3Znx3Z3x3dCl8bm9rKDZ8aSl8bnpwaHxvMmltfG9wKHRpfHd2KXxvcmFufG93ZzF8cDgwMHxwYW4oYXxkfHQpfHBkeGd8cGcoMTN8XFwtKFsxLThdfGMpKXxwaGlsfHBpcmV8cGwoYXl8dWMpfHBuXFwtMnxwbyhja3xydHxzZSl8cHJveHxwc2lvfHB0XFwtZ3xxYVxcLWF8cWMoMDd8MTJ8MjF8MzJ8NjB8XFwtWzItN118aVxcLSl8cXRla3xyMzgwfHI2MDB8cmFrc3xyaW05fHJvKHZlfHpvKXxzNTVcXC98c2EoZ2V8bWF8bW18bXN8bnl8dmEpfHNjKDAxfGhcXC18b298cFxcLSl8c2RrXFwvfHNlKGMoXFwtfDB8MSl8NDd8bWN8bmR8cmkpfHNnaFxcLXxzaGFyfHNpZShcXC18bSl8c2tcXC0wfHNsKDQ1fGlkKXxzbShhbHxhcnxiM3xpdHx0NSl8c28oZnR8bnkpfHNwKDAxfGhcXC18dlxcLXx2ICl8c3koMDF8bWIpfHQyKDE4fDUwKXx0NigwMHwxMHwxOCl8dGEoZ3R8bGspfHRjbFxcLXx0ZGdcXC18dGVsKGl8bSl8dGltXFwtfHRcXC1tb3x0byhwbHxzaCl8dHMoNzB8bVxcLXxtM3xtNSl8dHhcXC05fHVwKFxcLmJ8ZzF8c2kpfHV0c3R8djQwMHx2NzUwfHZlcml8dmkocmd8dGUpfHZrKDQwfDVbMC0zXXxcXC12KXx2bTQwfHZvZGF8dnVsY3x2eCg1Mnw1M3w2MHw2MXw3MHw4MHw4MXw4M3w4NXw5OCl8dzNjKFxcLXwgKXx3ZWJjfHdoaXR8d2koZyB8bmN8bncpfHdtbGJ8d29udXx4NzAwfHlhc1xcLXx5b3VyfHpldG98enRlXFwtL2kudGVzdChhLnN1YnN0cigwLDQpKSljaGVjayA9IHRydWV9KShuYXZpZ2F0b3IudXNlckFnZW50fHxuYXZpZ2F0b3IudmVuZG9yfHx3aW5kb3cub3BlcmEpO1xuICByZXR1cm4gY2hlY2s7XG59O1xuXG5VdGlsLmlzRmlyZWZveCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gL2ZpcmVmb3gvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xufTtcblxuVXRpbC5pc0lPUyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gLyhpUGFkfGlQaG9uZXxpUG9kKS9nLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XG59O1xuXG5VdGlsLmlzSUZyYW1lID0gZnVuY3Rpb24oKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIHdpbmRvdy5zZWxmICE9PSB3aW5kb3cudG9wO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn07XG5cblV0aWwuYXBwZW5kUXVlcnlQYXJhbWV0ZXIgPSBmdW5jdGlvbih1cmwsIGtleSwgdmFsdWUpIHtcbiAgLy8gRGV0ZXJtaW5lIGRlbGltaXRlciBiYXNlZCBvbiBpZiB0aGUgVVJMIGFscmVhZHkgR0VUIHBhcmFtZXRlcnMgaW4gaXQuXG4gIHZhciBkZWxpbWl0ZXIgPSAodXJsLmluZGV4T2YoJz8nKSA8IDAgPyAnPycgOiAnJicpO1xuICB1cmwgKz0gZGVsaW1pdGVyICsga2V5ICsgJz0nICsgdmFsdWU7XG4gIHJldHVybiB1cmw7XG59O1xuXG4vLyBGcm9tIGh0dHA6Ly9nb28uZ2wvNFdYM3RnXG5VdGlsLmdldFF1ZXJ5UGFyYW1ldGVyID0gZnVuY3Rpb24obmFtZSkge1xuICBuYW1lID0gbmFtZS5yZXBsYWNlKC9bXFxbXS8sIFwiXFxcXFtcIikucmVwbGFjZSgvW1xcXV0vLCBcIlxcXFxdXCIpO1xuICB2YXIgcmVnZXggPSBuZXcgUmVnRXhwKFwiW1xcXFw/Jl1cIiArIG5hbWUgKyBcIj0oW14mI10qKVwiKSxcbiAgICAgIHJlc3VsdHMgPSByZWdleC5leGVjKGxvY2F0aW9uLnNlYXJjaCk7XG4gIHJldHVybiByZXN1bHRzID09PSBudWxsID8gXCJcIiA6IGRlY29kZVVSSUNvbXBvbmVudChyZXN1bHRzWzFdLnJlcGxhY2UoL1xcKy9nLCBcIiBcIikpO1xufTtcblxuVXRpbC5pc0xhbmRzY2FwZU1vZGUgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuICh3aW5kb3cub3JpZW50YXRpb24gPT0gOTAgfHwgd2luZG93Lm9yaWVudGF0aW9uID09IC05MCk7XG59O1xuXG5VdGlsLmdldFNjcmVlbldpZHRoID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBNYXRoLm1heCh3aW5kb3cuc2NyZWVuLndpZHRoLCB3aW5kb3cuc2NyZWVuLmhlaWdodCkgKlxuICAgICAgd2luZG93LmRldmljZVBpeGVsUmF0aW87XG59O1xuXG5VdGlsLmdldFNjcmVlbkhlaWdodCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gTWF0aC5taW4od2luZG93LnNjcmVlbi53aWR0aCwgd2luZG93LnNjcmVlbi5oZWlnaHQpICpcbiAgICAgIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvO1xufTtcblxuLyoqXG4gKiBVdGlsaXR5IHRvIGNvbnZlcnQgdGhlIHByb2plY3Rpb24gbWF0cml4IHRvIGEgdmVjdG9yIGFjY2VwdGVkIGJ5IHRoZSBzaGFkZXIuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdF9wYXJhbXMgQSByZWN0YW5nbGUgdG8gc2NhbGUgdGhpcyB2ZWN0b3IgYnkuXG4gKi9cblV0aWwucHJvamVjdGlvbk1hdHJpeFRvVmVjdG9yXyA9IGZ1bmN0aW9uKG1hdHJpeCwgb3B0X3BhcmFtcykge1xuICB2YXIgcGFyYW1zID0gb3B0X3BhcmFtcyB8fCB7fTtcbiAgdmFyIHhTY2FsZSA9IHBhcmFtcy54U2NhbGUgfHwgMTtcbiAgdmFyIHlTY2FsZSA9IHBhcmFtcy55U2NhbGUgfHwgMTtcbiAgdmFyIHhUcmFucyA9IHBhcmFtcy54VHJhbnMgfHwgMDtcbiAgdmFyIHlUcmFucyA9IHBhcmFtcy55VHJhbnMgfHwgMDtcblxuICB2YXIgZWxlbWVudHMgPSBtYXRyaXguZWxlbWVudHM7XG4gIHZhciB2ZWMgPSBuZXcgVEhSRUUuVmVjdG9yNCgpO1xuICB2ZWMuc2V0KGVsZW1lbnRzWzQqMCArIDBdICogeFNjYWxlLFxuICAgICAgICAgIGVsZW1lbnRzWzQqMSArIDFdICogeVNjYWxlLFxuICAgICAgICAgIGVsZW1lbnRzWzQqMiArIDBdIC0gMSAtIHhUcmFucyxcbiAgICAgICAgICBlbGVtZW50c1s0KjIgKyAxXSAtIDEgLSB5VHJhbnMpLmRpdmlkZVNjYWxhcigyKTtcbiAgcmV0dXJuIHZlYztcbn07XG5cblV0aWwubGVmdFByb2plY3Rpb25WZWN0b3JUb1JpZ2h0XyA9IGZ1bmN0aW9uKGxlZnQpIHtcbiAgLy9wcm9qZWN0aW9uTGVmdCArIHZlYzQoMC4wLCAwLjAsIDEuMCwgMC4wKSkgKiB2ZWM0KDEuMCwgMS4wLCAtMS4wLCAxLjApO1xuICB2YXIgb3V0ID0gbmV3IFRIUkVFLlZlY3RvcjQoMCwgMCwgMSwgMCk7XG4gIG91dC5hZGQobGVmdCk7IC8vIG91dCA9IGxlZnQgKyAoMCwgMCwgMSwgMCkuXG4gIG91dC56ICo9IC0xOyAvLyBGbGlwIHouXG5cbiAgcmV0dXJuIG91dDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVXRpbDtcbiIsIi8qXG4gKiBDb3B5cmlnaHQgMjAxNSBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbnZhciBCdXR0b25NYW5hZ2VyID0gcmVxdWlyZSgnLi9idXR0b24tbWFuYWdlci5qcycpO1xudmFyIEVtaXR0ZXIgPSByZXF1aXJlKCcuL2VtaXR0ZXIuanMnKTtcbnZhciBNb2RlcyA9IHJlcXVpcmUoJy4vbW9kZXMuanMnKTtcbnZhciBVdGlsID0gcmVxdWlyZSgnLi91dGlsLmpzJyk7XG5cbi8qKlxuICogSGVscGVyIGZvciBnZXR0aW5nIGluIGFuZCBvdXQgb2YgVlIgbW9kZS5cbiAqL1xuZnVuY3Rpb24gV2ViVlJNYW5hZ2VyKHJlbmRlcmVyLCBlZmZlY3QsIHBhcmFtcykge1xuICB0aGlzLnBhcmFtcyA9IHBhcmFtcyB8fCB7fTtcblxuICB0aGlzLm1vZGUgPSBNb2Rlcy5VTktOT1dOO1xuXG4gIC8vIFNldCBvcHRpb24gdG8gaGlkZSB0aGUgYnV0dG9uLlxuICB0aGlzLmhpZGVCdXR0b24gPSB0aGlzLnBhcmFtcy5oaWRlQnV0dG9uIHx8IGZhbHNlO1xuICAvLyBXaGV0aGVyIG9yIG5vdCB0aGUgRk9WIHNob3VsZCBiZSBkaXN0b3J0ZWQgb3IgdW4tZGlzdG9ydGVkLiBCeSBkZWZhdWx0LCBpdFxuICAvLyBzaG91bGQgYmUgZGlzdG9ydGVkLCBidXQgaW4gdGhlIGNhc2Ugb2YgdmVydGV4IHNoYWRlciBiYXNlZCBkaXN0b3J0aW9uLFxuICAvLyBlbnN1cmUgdGhhdCB3ZSB1c2UgdW5kaXN0b3J0ZWQgcGFyYW1ldGVycy5cbiAgdGhpcy5pc1VuZGlzdG9ydGVkID0gISF0aGlzLnBhcmFtcy5pc1VuZGlzdG9ydGVkO1xuXG4gIC8vIFNhdmUgdGhlIFRIUkVFLmpzIHJlbmRlcmVyIGFuZCBlZmZlY3QgZm9yIGxhdGVyLlxuICB0aGlzLnJlbmRlcmVyID0gcmVuZGVyZXI7XG4gIHRoaXMuZWZmZWN0ID0gZWZmZWN0O1xuICB2YXIgcG9seWZpbGxXcmFwcGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLndlYnZyLXBvbHlmaWxsLWZ1bGxzY3JlZW4td3JhcHBlcicpO1xuICB0aGlzLmJ1dHRvbiA9IG5ldyBCdXR0b25NYW5hZ2VyKHBvbHlmaWxsV3JhcHBlcik7XG5cbiAgLy8gT25seSBlbmFibGUgVlIgbW9kZSBpZiB3ZSdyZSBvbiBhIG1vYmlsZSBkZXZpY2UuXG4gIHRoaXMuaXNWUkNvbXBhdGlibGUgPSBVdGlsLmlzTW9iaWxlKCk7XG5cbiAgdGhpcy5pc0Z1bGxzY3JlZW5EaXNhYmxlZCA9ICEhVXRpbC5nZXRRdWVyeVBhcmFtZXRlcignbm9fZnVsbHNjcmVlbicpO1xuICB0aGlzLnN0YXJ0TW9kZSA9IE1vZGVzLk5PUk1BTDtcbiAgdmFyIHN0YXJ0TW9kZVBhcmFtID0gcGFyc2VJbnQoVXRpbC5nZXRRdWVyeVBhcmFtZXRlcignc3RhcnRfbW9kZScpKTtcbiAgaWYgKCFpc05hTihzdGFydE1vZGVQYXJhbSkpIHtcbiAgICB0aGlzLnN0YXJ0TW9kZSA9IHN0YXJ0TW9kZVBhcmFtO1xuICB9XG5cbiAgaWYgKHRoaXMuaGlkZUJ1dHRvbikge1xuICAgIHRoaXMuYnV0dG9uLnNldFZpc2liaWxpdHkoZmFsc2UpO1xuICB9XG5cbiAgLy8gQ2hlY2sgaWYgdGhlIGJyb3dzZXIgaXMgY29tcGF0aWJsZSB3aXRoIFdlYlZSLlxuICB0aGlzLmdldERldmljZUJ5VHlwZV8oVlJEaXNwbGF5KS50aGVuKGZ1bmN0aW9uKGhtZCkge1xuICAgIHRoaXMuaG1kID0gaG1kO1xuXG4gICAgdGhpcy5lbWl0KCdpbml0aWFsaXplZCcpO1xuICB9LmJpbmQodGhpcykpO1xuXG4gIHN3aXRjaCAodGhpcy5zdGFydE1vZGUpIHtcbiAgICBjYXNlIE1vZGVzLk1BR0lDX1dJTkRPVzpcbiAgICAgIHRoaXMuc2V0TW9kZV8oTW9kZXMuTUFHSUNfV0lORE9XKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgTW9kZXMuVlI6XG4gICAgICB0aGlzLnNldE1vZGVfKE1vZGVzLlZSKTtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aGlzLnNldE1vZGVfKE1vZGVzLk5PUk1BTCk7XG4gIH1cblxuICAvLyBIb29rIHVwIGJ1dHRvbiBsaXN0ZW5lcnMuXG4gIHRoaXMuYnV0dG9uLm9uKCdmcycsIHRoaXMub25GU0NsaWNrXy5iaW5kKHRoaXMpKTtcbiAgdGhpcy5idXR0b24ub24oJ3ZyJywgdGhpcy5vblZSQ2xpY2tfLmJpbmQodGhpcykpO1xuXG4gIC8vIEJpbmQgdG8gZnVsbHNjcmVlbiBldmVudHMuXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3dlYmtpdGZ1bGxzY3JlZW5jaGFuZ2UnLFxuICAgICAgdGhpcy5vbkZ1bGxzY3JlZW5DaGFuZ2VfLmJpbmQodGhpcykpO1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3pmdWxsc2NyZWVuY2hhbmdlJyxcbiAgICAgIHRoaXMub25GdWxsc2NyZWVuQ2hhbmdlXy5iaW5kKHRoaXMpKTtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbXNmdWxsc2NyZWVuY2hhbmdlJyxcbiAgICAgIHRoaXMub25GdWxsc2NyZWVuQ2hhbmdlXy5iaW5kKHRoaXMpKTtcblxuICAvLyBCaW5kIHRvIFZSKiBzcGVjaWZpYyBldmVudHMuXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCd2cmRpc3BsYXlwcmVzZW50Y2hhbmdlJyxcbiAgICAgIHRoaXMub25WUkRpc3BsYXlQcmVzZW50Q2hhbmdlXy5iaW5kKHRoaXMpKTtcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3ZyZGlzcGxheWRldmljZXBhcmFtc2NoYW5nZScsXG4gICAgICB0aGlzLm9uVlJEaXNwbGF5RGV2aWNlUGFyYW1zQ2hhbmdlXy5iaW5kKHRoaXMpKTtcbn1cblxuV2ViVlJNYW5hZ2VyLnByb3RvdHlwZSA9IG5ldyBFbWl0dGVyKCk7XG5cbi8vIEV4cG9zZSB0aGVzZSB2YWx1ZXMgZXh0ZXJuYWxseS5cbldlYlZSTWFuYWdlci5Nb2RlcyA9IE1vZGVzO1xuXG4vKipcbiAqIFByb21pc2UgcmV0dXJucyB0cnVlIGlmIHRoZXJlIGlzIGF0IGxlYXN0IG9uZSBITUQgZGV2aWNlIGF2YWlsYWJsZS5cbiAqL1xuV2ViVlJNYW5hZ2VyLnByb3RvdHlwZS5nZXREZXZpY2VCeVR5cGVfID0gZnVuY3Rpb24odHlwZSkge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgbmF2aWdhdG9yLmdldFZSRGlzcGxheXMoKS50aGVuKGZ1bmN0aW9uKGRldmljZXMpIHtcbiAgICAgIC8vIFByb21pc2Ugc3VjY2VlZHMsIGJ1dCBjaGVjayBpZiB0aGVyZSBhcmUgYW55IGRldmljZXMgYWN0dWFsbHkuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRldmljZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGRldmljZXNbaV0gaW5zdGFuY2VvZiB0eXBlKSB7XG4gICAgICAgICAgcmVzb2x2ZShkZXZpY2VzW2ldKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmVzb2x2ZShudWxsKTtcbiAgICB9LCBmdW5jdGlvbigpIHtcbiAgICAgIC8vIE5vIGRldmljZXMgYXJlIGZvdW5kLlxuICAgICAgcmVzb2x2ZShudWxsKTtcbiAgICB9KTtcbiAgfSk7XG59O1xuXG5XZWJWUk1hbmFnZXIucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uKHNjZW5lLCBjYW1lcmEsIHRpbWVzdGFtcCkge1xuICAvLyBTY2VuZSBtYXkgYmUgYW4gYXJyYXkgb2YgdHdvIHNjZW5lcywgb25lIGZvciBlYWNoIGV5ZS5cbiAgaWYgKHNjZW5lIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICB0aGlzLmVmZmVjdC5yZW5kZXIoc2NlbmVbMF0sIGNhbWVyYSk7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5lZmZlY3QucmVuZGVyKHNjZW5lLCBjYW1lcmEpO1xuICB9XG59O1xuXG5XZWJWUk1hbmFnZXIucHJvdG90eXBlLnNldE1vZGVfID0gZnVuY3Rpb24obW9kZSkge1xuICB2YXIgb2xkTW9kZSA9IHRoaXMubW9kZTtcbiAgaWYgKG1vZGUgPT0gdGhpcy5tb2RlKSB7XG4gICAgY29uc29sZS5lcnJvcignTm90IGNoYW5naW5nIG1vZGVzLCBhbHJlYWR5IGluICVzJywgbW9kZSk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbnNvbGUubG9nKCdNb2RlIGNoYW5nZTogJXMgPT4gJXMnLCB0aGlzLm1vZGUsIG1vZGUpO1xuICB0aGlzLm1vZGUgPSBtb2RlO1xuICB0aGlzLmJ1dHRvbi5zZXRNb2RlKG1vZGUsIHRoaXMuaXNWUkNvbXBhdGlibGUpO1xuXG4gIC8vIEVtaXQgYW4gZXZlbnQgaW5kaWNhdGluZyB0aGUgbW9kZSBjaGFuZ2VkLlxuICB0aGlzLmVtaXQoJ21vZGVjaGFuZ2UnLCBtb2RlLCBvbGRNb2RlKTtcbn07XG5cbi8qKlxuICogTWFpbiBidXR0b24gd2FzIGNsaWNrZWQuXG4gKi9cbldlYlZSTWFuYWdlci5wcm90b3R5cGUub25GU0NsaWNrXyA9IGZ1bmN0aW9uKCkge1xuICBzd2l0Y2ggKHRoaXMubW9kZSkge1xuICAgIGNhc2UgTW9kZXMuTk9STUFMOlxuICAgICAgLy8gVE9ETzogUmVtb3ZlIHRoaXMgaGFjayBpZi93aGVuIGlPUyBnZXRzIHJlYWwgZnVsbHNjcmVlbiBtb2RlLlxuICAgICAgLy8gSWYgdGhpcyBpcyBhbiBpZnJhbWUgb24gaU9TLCBicmVhayBvdXQgYW5kIG9wZW4gaW4gbm9fZnVsbHNjcmVlbiBtb2RlLlxuICAgICAgaWYgKFV0aWwuaXNJT1MoKSAmJiBVdGlsLmlzSUZyYW1lKCkpIHtcbiAgICAgICAgdmFyIHVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuICAgICAgICB1cmwgPSBVdGlsLmFwcGVuZFF1ZXJ5UGFyYW1ldGVyKHVybCwgJ25vX2Z1bGxzY3JlZW4nLCAndHJ1ZScpO1xuICAgICAgICB1cmwgPSBVdGlsLmFwcGVuZFF1ZXJ5UGFyYW1ldGVyKHVybCwgJ3N0YXJ0X21vZGUnLCBNb2Rlcy5NQUdJQ19XSU5ET1cpO1xuICAgICAgICB0b3AubG9jYXRpb24uaHJlZiA9IHVybDtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdGhpcy5zZXRNb2RlXyhNb2Rlcy5NQUdJQ19XSU5ET1cpO1xuICAgICAgdGhpcy5yZXF1ZXN0RnVsbHNjcmVlbl8oKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgTW9kZXMuTUFHSUNfV0lORE9XOlxuICAgICAgaWYgKHRoaXMuaXNGdWxsc2NyZWVuRGlzYWJsZWQpIHtcbiAgICAgICAgd2luZG93Lmhpc3RvcnkuYmFjaygpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0aGlzLnNldE1vZGVfKE1vZGVzLk5PUk1BTCk7XG4gICAgICB0aGlzLmV4aXRGdWxsc2NyZWVuXygpO1xuICAgICAgYnJlYWs7XG4gIH1cbn07XG5cbi8qKlxuICogVGhlIFZSIGJ1dHRvbiB3YXMgY2xpY2tlZC5cbiAqL1xuV2ViVlJNYW5hZ2VyLnByb3RvdHlwZS5vblZSQ2xpY2tfID0gZnVuY3Rpb24oKSB7XG4gIC8vIFRPRE86IFJlbW92ZSB0aGlzIGhhY2sgd2hlbiBpT1MgaGFzIGZ1bGxzY3JlZW4gbW9kZS5cbiAgLy8gSWYgdGhpcyBpcyBhbiBpZnJhbWUgb24gaU9TLCBicmVhayBvdXQgYW5kIG9wZW4gaW4gbm9fZnVsbHNjcmVlbiBtb2RlLlxuICBpZiAodGhpcy5tb2RlID09IE1vZGVzLk5PUk1BTCAmJiBVdGlsLmlzSU9TKCkgJiYgVXRpbC5pc0lGcmFtZSgpKSB7XG4gICAgdmFyIHVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuICAgIHVybCA9IFV0aWwuYXBwZW5kUXVlcnlQYXJhbWV0ZXIodXJsLCAnbm9fZnVsbHNjcmVlbicsICd0cnVlJyk7XG4gICAgdXJsID0gVXRpbC5hcHBlbmRRdWVyeVBhcmFtZXRlcih1cmwsICdzdGFydF9tb2RlJywgTW9kZXMuVlIpO1xuICAgIHRvcC5sb2NhdGlvbi5ocmVmID0gdXJsO1xuICAgIHJldHVybjtcbiAgfVxuICB0aGlzLmhtZC5yZXF1ZXN0UHJlc2VudCh7c291cmNlOiB0aGlzLnJlbmRlcmVyLmRvbUVsZW1lbnR9KTtcbiAgdGhpcy5zZXRNb2RlXyhNb2Rlcy5WUik7XG59O1xuXG5XZWJWUk1hbmFnZXIucHJvdG90eXBlLnJlcXVlc3RGdWxsc2NyZWVuXyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgY2FudmFzID0gZG9jdW1lbnQuYm9keTtcbiAgLy92YXIgY2FudmFzID0gdGhpcy5yZW5kZXJlci5kb21FbGVtZW50O1xuICBpZiAoY2FudmFzLnJlcXVlc3RGdWxsc2NyZWVuKSB7XG4gICAgY2FudmFzLnJlcXVlc3RGdWxsc2NyZWVuKCk7XG4gIH0gZWxzZSBpZiAoY2FudmFzLm1velJlcXVlc3RGdWxsU2NyZWVuKSB7XG4gICAgY2FudmFzLm1velJlcXVlc3RGdWxsU2NyZWVuKCk7XG4gIH0gZWxzZSBpZiAoY2FudmFzLndlYmtpdFJlcXVlc3RGdWxsc2NyZWVuKSB7XG4gICAgY2FudmFzLndlYmtpdFJlcXVlc3RGdWxsc2NyZWVuKCk7XG4gIH0gZWxzZSBpZiAoY2FudmFzLm1zUmVxdWVzdEZ1bGxzY3JlZW4pIHtcbiAgICBjYW52YXMubXNSZXF1ZXN0RnVsbHNjcmVlbigpO1xuICB9XG59O1xuXG5XZWJWUk1hbmFnZXIucHJvdG90eXBlLmV4aXRGdWxsc2NyZWVuXyA9IGZ1bmN0aW9uKCkge1xuICBpZiAoZG9jdW1lbnQuZXhpdEZ1bGxzY3JlZW4pIHtcbiAgICBkb2N1bWVudC5leGl0RnVsbHNjcmVlbigpO1xuICB9IGVsc2UgaWYgKGRvY3VtZW50Lm1vekNhbmNlbEZ1bGxTY3JlZW4pIHtcbiAgICBkb2N1bWVudC5tb3pDYW5jZWxGdWxsU2NyZWVuKCk7XG4gIH0gZWxzZSBpZiAoZG9jdW1lbnQud2Via2l0RXhpdEZ1bGxzY3JlZW4pIHtcbiAgICBkb2N1bWVudC53ZWJraXRFeGl0RnVsbHNjcmVlbigpO1xuICB9IGVsc2UgaWYgKGRvY3VtZW50Lm1zRXhpdEZ1bGxzY3JlZW4pIHtcbiAgICBkb2N1bWVudC5tc0V4aXRGdWxsc2NyZWVuKCk7XG4gIH1cbn07XG5cbldlYlZSTWFuYWdlci5wcm90b3R5cGUub25WUkRpc3BsYXlQcmVzZW50Q2hhbmdlXyA9IGZ1bmN0aW9uKGUpIHtcbiAgY29uc29sZS5sb2coJ29uVlJEaXNwbGF5UHJlc2VudENoYW5nZV8nLCBlKTtcbiAgaWYgKHRoaXMuaG1kLmlzUHJlc2VudGluZykge1xuICAgIHRoaXMuc2V0TW9kZV8oTW9kZXMuVlIpO1xuICB9IGVsc2Uge1xuICAgIHRoaXMuc2V0TW9kZV8oTW9kZXMuTk9STUFMKTtcbiAgfVxufTtcblxuV2ViVlJNYW5hZ2VyLnByb3RvdHlwZS5vblZSRGlzcGxheURldmljZVBhcmFtc0NoYW5nZV8gPSBmdW5jdGlvbihlKSB7XG4gIGNvbnNvbGUubG9nKCdvblZSRGlzcGxheURldmljZVBhcmFtc0NoYW5nZV8nLCBlKTtcbn07XG5cbldlYlZSTWFuYWdlci5wcm90b3R5cGUub25GdWxsc2NyZWVuQ2hhbmdlXyA9IGZ1bmN0aW9uKGUpIHtcbiAgLy8gSWYgd2UgbGVhdmUgZnVsbC1zY3JlZW4sIGdvIGJhY2sgdG8gbm9ybWFsIG1vZGUuXG4gIGlmIChkb2N1bWVudC53ZWJraXRGdWxsc2NyZWVuRWxlbWVudCA9PT0gbnVsbCB8fFxuICAgICAgZG9jdW1lbnQubW96RnVsbFNjcmVlbkVsZW1lbnQgPT09IG51bGwpIHtcbiAgICB0aGlzLnNldE1vZGVfKE1vZGVzLk5PUk1BTCk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gV2ViVlJNYW5hZ2VyO1xuIl19
