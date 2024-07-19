"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createScopedThreejs = createScopedThreejs;
var _abab = require("abab");
var _XMLHttpRequest2 = _interopRequireDefault(require("./XMLHttpRequest"));
var _copyProperties = _interopRequireDefault(require("./copyProperties"));
var _EventTarget = _interopRequireDefault(require("./EventTarget"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function createScopedThreejs(canvas) {
  // adapt canvas
  // canvas.style = {width: canvas.width + 'px', height: canvas.height + 'px'}
  // canvas.clientHeight = canvas.height
  // canvas.clientWidth = canvas.width

  Object.defineProperty(canvas, 'style', {
    get: function get() {
      return {
        width: this.width + 'px',
        height: this.height + 'px'
      };
    }
  });
  Object.defineProperty(canvas, 'clientHeight', {
    get: function get() {
      return this.height;
    }
  });
  Object.defineProperty(canvas, 'clientWidth', {
    get: function get() {
      return this.width;
    }
  });
  (0, _copyProperties.default)(canvas.constructor.prototype, _EventTarget.default.prototype);

  // eslint-disable-next-line
  var document = {
    createElementNS: function createElementNS(_, type) {
      if (type === 'canvas') return canvas;
      if (type === 'img') return canvas.createImage();
    }
  };
  (0, _copyProperties.default)(document.constructor.prototype, _EventTarget.default.prototype);

  // eslint-disable-next-line
  var window = {
    AudioContext: function AudioContext() {},
    URL: {}
  };
  (0, _copyProperties.default)(window.constructor.prototype, _EventTarget.default.prototype);

  // eslint-disable-next-line
  var atob = function atob(a) {
    return (0, _abab.atob)(a);
  };

  // eslint-disable-next-line
  var XMLHttpRequest = _XMLHttpRequest2.default;
  var exports = {};

  // eslint-disable-next-line
  var HTMLCanvasElement = undefined;

  // three.js source code will be injected here
  // eslint-disable-next-line
  // __INJECT_THREE__;
  return exports;
}