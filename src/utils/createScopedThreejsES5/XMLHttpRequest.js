"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _EventTarget2 = _interopRequireDefault(require("./EventTarget.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } Object.defineProperty(subClass, "prototype", { value: Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }), writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
var _requestHeader = new WeakMap();
var _responseHeader = new WeakMap();
var _requestTask = new WeakMap();
function _triggerEvent(type) {
  var event = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  event.target = event.target || this;
  if (typeof this["on".concat(type)] === 'function') {
    this["on".concat(type)].call(this, event);
  }
}
function _changeReadyState(readyState) {
  var event = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  this.readyState = readyState;
  event.readyState = readyState;
  _triggerEvent.call(this, 'readystatechange', event);
}
function _isRelativePath(url) {
  return !/^(http|https|ftp|wxfile):\/\/.*/i.test(url);
}
var XMLHttpRequest = exports.default = /*#__PURE__*/function (_EventTarget) {
  _inherits(XMLHttpRequest, _EventTarget);
  var _super = _createSuper(XMLHttpRequest);
  function XMLHttpRequest() {
    var _this;
    _classCallCheck(this, XMLHttpRequest);
    _this = _super.call(this);

    /*
     * TODO 这一批事件应该是在 XMLHttpRequestEventTarget.prototype 上面的
     */
    _this.onabort = null;
    _this.onerror = null;
    _this.onload = null;
    _this.onloadstart = null;
    _this.onprogress = null;
    _this.ontimeout = null;
    _this.onloadend = null;
    _this.onreadystatechange = null;
    _this.readyState = 0;
    _this.response = null;
    _this.responseText = null;
    _this.responseType = 'text';
    _this.dataType = 'string';
    _this.responseXML = null;
    _this.status = 0;
    _this.statusText = '';
    _this.upload = {};
    _this.withCredentials = false;
    _requestHeader.set(_assertThisInitialized(_this), {
      'content-type': 'application/x-www-form-urlencoded'
    });
    _responseHeader.set(_assertThisInitialized(_this), {});
    return _this;
  }
  _createClass(XMLHttpRequest, [{
    key: "abort",
    value: function abort() {
      var myRequestTask = _requestTask.get(this);
      if (myRequestTask) {
        myRequestTask.abort();
      }
    }
  }, {
    key: "getAllResponseHeaders",
    value: function getAllResponseHeaders() {
      var responseHeader = _responseHeader.get(this);
      return Object.keys(responseHeader).map(function (header) {
        return "".concat(header, ": ").concat(responseHeader[header]);
      }).join('\n');
    }
  }, {
    key: "getResponseHeader",
    value: function getResponseHeader(header) {
      return _responseHeader.get(this)[header];
    }
  }, {
    key: "open",
    value: function open(method, url /* async, user, password 这几个参数在小程序内不支持*/) {
      this._method = method;
      this._url = url;
      _changeReadyState.call(this, XMLHttpRequest.OPENED);
    }
  }, {
    key: "overrideMimeType",
    value: function overrideMimeType() {}
  }, {
    key: "send",
    value: function send() {
      var _this2 = this;
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      if (this.readyState !== XMLHttpRequest.OPENED) {
        throw new Error("Failed to execute 'send' on 'XMLHttpRequest': The object's state must be OPENED.");
      } else {
        var url = this._url;
        var header = _requestHeader.get(this);
        var responseType = this.responseType;
        var dataType = this.dataType;
        var relative = _isRelativePath(url);
        var encoding;
        if (responseType === 'arraybuffer') {
          // encoding = 'binary'
        } else {
          encoding = 'utf8';
        }
        delete this.response;
        this.response = null;
        var onSuccess = function onSuccess(_ref) {
          var data = _ref.data,
            statusCode = _ref.statusCode,
            header = _ref.header;
          statusCode = statusCode === undefined ? 200 : statusCode;
          if (typeof data !== 'string' && !(data instanceof ArrayBuffer)) {
            try {
              data = JSON.stringify(data);
            } catch (e) {}
          }
          _this2.status = statusCode;
          if (header) {
            _responseHeader.set(_this2, header);
          }
          _triggerEvent.call(_this2, 'loadstart');
          _changeReadyState.call(_this2, XMLHttpRequest.HEADERS_RECEIVED);
          _changeReadyState.call(_this2, XMLHttpRequest.LOADING);
          _this2.response = data;
          if (data instanceof ArrayBuffer) {
            Object.defineProperty(_this2, 'responseText', {
              enumerable: true,
              configurable: true,
              get: function get() {
                throw "InvalidStateError : responseType is " + this.responseType;
              }
            });
          } else {
            _this2.responseText = data;
          }
          _changeReadyState.call(_this2, XMLHttpRequest.DONE);
          _triggerEvent.call(_this2, 'load');
          _triggerEvent.call(_this2, 'loadend');
        };
        var onFail = function onFail(_ref2) {
          var errMsg = _ref2.errMsg;
          // TODO 规范错误

          if (errMsg.indexOf('abort') !== -1) {
            _triggerEvent.call(_this2, 'abort');
          } else {
            _triggerEvent.call(_this2, 'error', {
              message: errMsg
            });
          }
          _triggerEvent.call(_this2, 'loadend');
          if (relative) {
            // 用户即使没监听error事件, 也给出相应的警告
            console.warn(errMsg);
          }
        };
        if (relative) {
          var fs = wx.getFileSystemManager();
          var options = {
            'filePath': url,
            'success': onSuccess,
            'fail': onFail
          };
          if (encoding) {
            options['encoding'] = encoding;
          }
          fs.readFile(options);
          return;
        }
        wx.request({
          data: data,
          url: url,
          method: this._method,
          header: header,
          dataType: dataType,
          responseType: responseType,
          success: onSuccess,
          fail: onFail
        });
      }
    }
  }, {
    key: "setRequestHeader",
    value: function setRequestHeader(header, value) {
      var myHeader = _requestHeader.get(this);
      myHeader[header] = value;
      _requestHeader.set(this, myHeader);
    }
  }, {
    key: "addEventListener",
    value: function addEventListener(type, listener) {
      var _this3 = this;
      if (typeof listener !== 'function') {
        return;
      }
      this['on' + type] = function () {
        var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        event.target = event.target || _this3;
        listener.call(_this3, event);
      };
    }
  }, {
    key: "removeEventListener",
    value: function removeEventListener(type, listener) {
      if (this['on' + type] === listener) {
        this['on' + type] = null;
      }
    }
  }]);
  return XMLHttpRequest;
}(_EventTarget2.default); // TODO 没法模拟 HEADERS_RECEIVED 和 LOADING 两个状态
XMLHttpRequest.UNSEND = 0;
XMLHttpRequest.OPENED = 1;
XMLHttpRequest.HEADERS_RECEIVED = 2;
XMLHttpRequest.LOADING = 3;
XMLHttpRequest.DONE = 4;