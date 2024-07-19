"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var _events = new WeakMap();
var Touch = /*#__PURE__*/_createClass(function Touch(touch) {
  _classCallCheck(this, Touch);
  // CanvasTouch{identifier, x, y}
  // Touch{identifier, pageX, pageY, clientX, clientY, force}
  this.identifier = touch.identifier;
  this.force = touch.force === undefined ? 1 : touch.force;
  this.pageX = touch.pageX || touch.x;
  this.pageY = touch.pageY || touch.y;
  this.clientX = touch.clientX || touch.x;
  this.clientY = touch.clientY || touch.y;
  this.screenX = this.pageX;
  this.screenY = this.pageY;
});
var EventTarget = exports.default = /*#__PURE__*/function () {
  function EventTarget() {
    _classCallCheck(this, EventTarget);
    _events.set(this, {});
  }
  _createClass(EventTarget, [{
    key: "addEventListener",
    value: function addEventListener(type, listener) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var events = _events.get(this);
      if (!events) {
        events = {};
        _events.set(this, events);
      }
      if (!events[type]) {
        events[type] = [];
      }
      events[type].push(listener);
      if (options.capture) {
        // console.warn('EventTarget.addEventListener: options.capture is not implemented.')
      }
      if (options.once) {
        // console.warn('EventTarget.addEventListener: options.once is not implemented.')
      }
      if (options.passive) {
        // console.warn('EventTarget.addEventListener: options.passive is not implemented.')
      }
    }
  }, {
    key: "removeEventListener",
    value: function removeEventListener(type, listener) {
      var events = _events.get(this);
      if (events) {
        var listeners = events[type];
        if (listeners && listeners.length > 0) {
          for (var i = listeners.length; i--; i > 0) {
            if (listeners[i] === listener) {
              listeners.splice(i, 1);
              break;
            }
          }
        }
      }
    }
  }, {
    key: "dispatchEvent",
    value: function dispatchEvent() {
      var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      if (typeof event.preventDefault !== 'function') {
        event.preventDefault = function () {};
      }
      if (typeof event.stopPropagation !== 'function') {
        event.stopPropagation = function () {};
      }
      var listeners = _events.get(this)[event.type];
      if (listeners) {
        for (var i = 0; i < listeners.length; i++) {
          listeners[i](event);
        }
      }
    }
  }, {
    key: "dispatchTouchEvent",
    value: function dispatchTouchEvent() {
      var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var target = _objectSpread({}, this);
      var event = {
        changedTouches: e.changedTouches.map(function (touch) {
          return new Touch(touch);
        }),
        touches: e.touches.map(function (touch) {
          return new Touch(touch);
        }),
        targetTouches: Array.prototype.slice.call(e.touches.map(function (touch) {
          return new Touch(touch);
        })),
        timeStamp: e.timeStamp,
        target: target,
        currentTarget: target,
        type: e.type,
        cancelBubble: false,
        cancelable: false
      };
      this.dispatchEvent(event);
    }
  }]);
  return EventTarget;
}();