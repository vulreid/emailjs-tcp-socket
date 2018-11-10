'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ramda = require('ramda');

var _net = require('net');

var _net2 = _interopRequireDefault(_net);

var _tls = require('tls');

var _tls2 = _interopRequireDefault(_tls);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TCPSocket = function () {
  _createClass(TCPSocket, null, [{
    key: 'open',
    value: function open(host, port) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var tlsOptions = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

      return new TCPSocket({ host: host, port: port, options: options, tlsOptions: tlsOptions });
    }
  }]);

  function TCPSocket(_ref) {
    var _this = this;

    var host = _ref.host,
        port = _ref.port,
        options = _ref.options,
        tlsOptions = _ref.tlsOptions;

    _classCallCheck(this, TCPSocket);

    this.host = host;
    this.port = port;
    this.ssl = (0, _ramda.propOr)(false, 'useSecureTransport')(options);
    this.bufferedAmount = 0;
    this.readyState = 'connecting';
    this.binaryType = (0, _ramda.propOr)('arraybuffer', 'binaryType')(options);
    this.tlsOptions = tlsOptions;

    if (this.binaryType !== 'arraybuffer') {
      throw new Error('Only arraybuffers are supported!');
    }

    this._socket = this.ssl ? _tls2.default.connect(this.port, this.host, this.tlsOptions, function () {
      return _this._emit('open');
    }) : _net2.default.connect(this.port, this.host, function () {
      return _this._emit('open');
    });

    // add all event listeners to the new socket
    this._attachListeners();
  }

  _createClass(TCPSocket, [{
    key: '_attachListeners',
    value: function _attachListeners() {
      var _this2 = this;

      this._socket.on('data', function (nodeBuf) {
        return _this2._emit('data', nodeBuffertoArrayBuffer(nodeBuf));
      });
      this._socket.on('error', function (error) {
        // Ignore ECONNRESET errors. For the app this is the same as normal close
        if (error.code !== 'ECONNRESET') {
          _this2._emit('error', error);
        }
        _this2.close();
      });

      this._socket.on('end', function () {
        return _this2._emit('close');
      });
    }
  }, {
    key: '_removeListeners',
    value: function _removeListeners() {
      this._socket.removeAllListeners('data');
      this._socket.removeAllListeners('end');
      this._socket.removeAllListeners('error');
    }
  }, {
    key: '_emit',
    value: function _emit(type, data) {
      var target = this;
      switch (type) {
        case 'open':
          this.readyState = 'open';
          this.onopen && this.onopen({ target: target, type: type, data: data });
          break;
        case 'error':
          this.onerror && this.onerror({ target: target, type: type, data: data });
          break;
        case 'data':
          this.ondata && this.ondata({ target: target, type: type, data: data });
          break;
        case 'drain':
          this.ondrain && this.ondrain({ target: target, type: type, data: data });
          break;
        case 'close':
          this.readyState = 'closed';
          this.onclose && this.onclose({ target: target, type: type, data: data });
          break;
      }
    }

    //
    // API
    //

  }, {
    key: 'close',
    value: function close() {
      this.readyState = 'closing';
      this._socket.end();
    }
  }, {
    key: 'send',
    value: function send(data) {
      // convert data to string or node buffer
      this._socket.write(arrayBufferToNodeBuffer(data), this._emit.bind(this, 'drain'));
    }
  }, {
    key: 'upgradeToSecure',
    value: function upgradeToSecure() {
      var _this3 = this;

      if (this.ssl) return;

      this._removeListeners();
      this._socket = _tls2.default.connect({ socket: this._socket }, function () {
        _this3.ssl = true;
      });
      this._attachListeners();
    }
  }]);

  return TCPSocket;
}();

exports.default = TCPSocket;


var nodeBuffertoArrayBuffer = function nodeBuffertoArrayBuffer(buf) {
  return Uint8Array.from(buf).buffer;
};
var arrayBufferToNodeBuffer = function arrayBufferToNodeBuffer(ab) {
  return Buffer.from(new Uint8Array(ab));
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9ub2RlLXNvY2tldC5qcyJdLCJuYW1lcyI6WyJUQ1BTb2NrZXQiLCJob3N0IiwicG9ydCIsIm9wdGlvbnMiLCJ0bHNPcHRpb25zIiwic3NsIiwiYnVmZmVyZWRBbW91bnQiLCJyZWFkeVN0YXRlIiwiYmluYXJ5VHlwZSIsIkVycm9yIiwiX3NvY2tldCIsInRscyIsImNvbm5lY3QiLCJfZW1pdCIsIm5ldCIsIl9hdHRhY2hMaXN0ZW5lcnMiLCJvbiIsIm5vZGVCdWZmZXJ0b0FycmF5QnVmZmVyIiwibm9kZUJ1ZiIsImVycm9yIiwiY29kZSIsImNsb3NlIiwicmVtb3ZlQWxsTGlzdGVuZXJzIiwidHlwZSIsImRhdGEiLCJ0YXJnZXQiLCJvbm9wZW4iLCJvbmVycm9yIiwib25kYXRhIiwib25kcmFpbiIsIm9uY2xvc2UiLCJlbmQiLCJ3cml0ZSIsImFycmF5QnVmZmVyVG9Ob2RlQnVmZmVyIiwiYmluZCIsIl9yZW1vdmVMaXN0ZW5lcnMiLCJzb2NrZXQiLCJVaW50OEFycmF5IiwiZnJvbSIsImJ1ZiIsImJ1ZmZlciIsImFiIiwiQnVmZmVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOztBQUNBOzs7O0FBQ0E7Ozs7Ozs7O0lBRXFCQSxTOzs7eUJBQ05DLEksRUFBTUMsSSxFQUFxQztBQUFBLFVBQS9CQyxPQUErQix1RUFBckIsRUFBcUI7QUFBQSxVQUFqQkMsVUFBaUIsdUVBQUosRUFBSTs7QUFDdEQsYUFBTyxJQUFJSixTQUFKLENBQWMsRUFBRUMsVUFBRixFQUFRQyxVQUFSLEVBQWNDLGdCQUFkLEVBQXVCQyxzQkFBdkIsRUFBZCxDQUFQO0FBQ0Q7OztBQUVELDJCQUFrRDtBQUFBOztBQUFBLFFBQW5DSCxJQUFtQyxRQUFuQ0EsSUFBbUM7QUFBQSxRQUE3QkMsSUFBNkIsUUFBN0JBLElBQTZCO0FBQUEsUUFBdkJDLE9BQXVCLFFBQXZCQSxPQUF1QjtBQUFBLFFBQWRDLFVBQWMsUUFBZEEsVUFBYzs7QUFBQTs7QUFDaEQsU0FBS0gsSUFBTCxH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QUNBO0FBakJKO0FBbUJEOztBQUVEO0FBQ0E7QUFDQTs7Ozs0QkFFUztBQUNQLFdBQUtqQixVQUFMLEdBQWtCLFNBQWxCO0FBQ0EsV0FBS0csT0FBTCxDQUFhcUIsR0FBYjtBQUNEOzs7eUJBRUtQLEksRUFBTTtBQUNWO0FBQ0EsV0FBS2QsT0FBTCxDQUFhc0IsS0FBYixDQUFtQkMsd0JBQXdCVCxJQUF4QixDQUFuQixFQUFrRCxLQUFLWCxLQUFMLENBQVdxQixJQUFYLENBQWdCLElBQWhCLEVBQXNCLE9BQXRCLENBQWxEO0FBQ0Q7OztzQ0FFa0I7QUFBQTs7QUFDakIsVUFBSSxLQUFLN0IsR0FBVCxFQUFjOztBQUVkLFdBQUs4QixnQkFBTDtBQUNBLFdBQUt6QixPQUFMLEdBQWVDLGNBQUlDLE9BQUosQ0FBWSxFQUFFd0IsUUFBUSxLQUFLMUIsT0FBZixFQUFaLEVBQXNDLFlBQU07QUFBRSxlQUFLTCxHQUFMLEdBQVcsSUFBWDtBQUFpQixPQUEvRCxDQUFmO0FBQ0EsV0FBS1UsZ0JBQUw7QUFDRDs7Ozs7O2tCQXhGa0JmLFM7OztBQTJGckIsSUFBTWlCLDBCQUEwQixTQUExQkEsdUJBQTBCO0FBQUEsU0FBT29CLFdBQVdDLElBQVgsQ0FBZ0JDLEdBQWhCLEVBQXFCQyxNQUE1QjtBQUFBLENBQWhDO0FBQ0EsSUFBTVAsMEJBQTBCLFNBQTFCQSx1QkFBMEIsQ0FBQ1EsRUFBRDtBQUFBLFNBQVFDLE9BQU9KLElBQVAsQ0FBWSxJQUFJRCxVQUFKLENBQWVJLEVBQWYsQ0FBWixDQUFSO0FBQUEsQ0FBaEMiLCJmaWxlIjoibm9kZS1zb2NrZXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBwcm9wT3IgfSBmcm9tICdyYW1kYSdcbmltcG9ydCBuZXQgZnJvbSAnbmV0J1xuaW1wb3J0IHRscyBmcm9tICd0bHMnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRDUFNvY2tldCB7XG4gIHN0YXRpYyBvcGVuIChob3N0LCBwb3J0LCBvcHRpb25zID0ge30sIHRsc09wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiBuZXcgVENQU29ja2V0KHsgaG9zdCwgcG9ydCwgb3B0aW9ucywgdGxzT3B0aW9ucyB9KVxuICB9XG5cbiAgY29uc3RydWN0b3IgKHsgaG9zdCwgcG9ydCwgb3B0aW9ucywgdGxzT3B0aW9ucyB9KSB7XG4gICAgdGhpcy5ob3N0ID0gaG9zdFxuICAgIHRoaXMucG9ydCA9IHBvcnRcbiAgICB0aGlzLnNzbCA9IHByb3BPcihmYWxzZSwgJ3VzZVNlY3VyZVRyYW5zcG9ydCcpKG9wdGlvbnMpXG4gICAgdGhpcy5idWZmZXJlZEFtb3VudCA9IDBcbiAgICB0aGlzLnJlYWR5U3RhdGUgPSAnY29ubmVjdGluZydcbiAgICB0aGlzLmJpbmFyeVR5cGUgPSBwcm9wT3IoJ2FycmF5YnVmZmVyJywgJ2JpbmFyeVR5cGUnKShvcHRpb25zKVxuICAgIHRoaXMudGxzT3B0aW9ucyA9IHRsc09wdGlvbnNcblxuICAgIGlmICh0aGlzLmJpbmFyeVR5cGUgIT09ICdhcnJheWJ1ZmZlcicpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignT25seSBhcnJheWJ1ZmZlcnMgYXJlIHN1cHBvcnRlZCEnKVxuICAgIH1cblxuICAgIHRoaXMuX3NvY2tldCA9IHRoaXMuc3NsXG4gICAgICA/IHRscy5jb25uZWN0KHRoaXMucG9ydCwgdGhpcy5ob3N0LCB0aGlzLnRsc09wdGlvbnMsICgpID0+IHRoaXMuX2VtaXQoJ29wZW4nKSlcbiAgICAgIDogbmV0LmNvbm5lY3QodGhpcy5wb3J0LCB0aGlzLmhvc3QsICgpID0+IHRoaXMuX2VtaXQoJ29wZW4nKSlcblxuICAgIC8vIGFkZCBhbGwgZXZlbnQgbGlzdGVuZXJzIHRvIHRoZSBuZXcgc29ja2V0XG4gICAgdGhpcy5fYXR0YWNoTGlzdGVuZXJzKClcbiAgfVxuXG4gIF9hdHRhY2hMaXN0ZW5lcnMgKCkge1xuICAgIHRoaXMuX3NvY2tldC5vbignZGF0YScsIG5vZGVCdWYgPT4gdGhpcy5fZW1pdCgnZGF0YScsIG5vZGVCdWZmZXJ0b0FycmF5QnVmZmVyKG5vZGVCdWYpKSlcbiAgICB0aGlzLl9zb2NrZXQub24oJ2Vycm9yJywgZXJyb3IgPT4ge1xuICAgICAgLy8gSWdub3JlIEVDT05OUkVTRVQgZXJyb3JzLiBGb3IgdGhlIGFwcCB0aGlzIGlzIHRoZSBzYW1lIGFzIG5vcm1hbCBjbG9zZVxuICAgICAgaWYgKGVycm9yLmNvZGUgIT09ICdFQ09OTlJFU0VUJykge1xuICAgICAgICB0aGlzLl9lbWl0KCdlcnJvcicsIGVycm9yKVxuICAgICAgfVxuICAgICAgdGhpcy5jbG9zZSgpXG4gICAgfSlcblxuICAgIHRoaXMuX3NvY2tldC5vbignZW5kJywgKCkgPT4gdGhpcy5fZW1pdCgnY2xvc2UnKSlcbiAgfVxuXG4gIF9yZW1vdmVMaXN0ZW5lcnMgKCkge1xuICAgIHRoaXMuX3NvY2tldC5yZW1vdmVBbGxMaXN0ZW5lcnMoJ2RhdGEnKVxuICAgIHRoaXMuX3NvY2tldC5yZW1vdmVBbGxMaXN0ZW5lcnMoJ2VuZCcpXG4gICAgdGhpcy5fc29ja2V0LnJlbW92ZUFsbExpc3RlbmVycygnZXJyb3InKVxuICB9XG5cbiAgX2VtaXQgKHR5cGUsIGRhdGEpIHtcbiAgICBjb25zdCB0YXJnZXQgPSB0aGlzXG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICBjYXNlICdvcGVuJzpcbiAgICAgICAgdGhpcy5yZWFkeVN0YXRlID0gJ29wZW4nXG4gICAgICAgIHRoaXMub25vcGVuICYmIHRoaXMub25vcGVuKHsgdGFyZ2V0LCB0eXBlLCBkYXRhIH0pXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlICdlcnJvcic6XG4gICAgICAgIHRoaXMub25lcnJvciAmJiB0aGlzLm9uZXJyb3IoeyB0YXJnZXQsIHR5cGUsIGRhdGEgfSlcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgJ2RhdGEnOlxuICAgICAgICB0aGlzLm9uZGF0YSAmJiB0aGlzLm9uZGF0YSh7IHRhcmdldCwgdHlwZSwgZGF0YSB9KVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAnZHJhaW4nOlxuICAgICAgICB0aGlzLm9uZHJhaW4gJiYgdGhpcy5vbmRyYWluKHsgdGFyZ2V0LCB0eXBlLCBkYXRhIH0pXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlICdjbG9zZSc6XG4gICAgICAgIHRoaXMucmVhZHlTdGF0ZSA9ICdjbG9zZWQnXG4gICAgICAgIHRoaXMub25jbG9zZSAmJiB0aGlzLm9uY2xvc2UoeyB0YXJnZXQsIHR5cGUsIGRhdGEgfSlcbiAgICAgICAgYnJlYWtcbiAgICB9XG4gIH1cblxuICAvL1xuICAvLyBBUElcbiAgLy9cblxuICBjbG9zZSAoKSB7XG4gICAgdGhpcy5yZWFkeVN0YXRlID0gJ2Nsb3NpbmcnXG4gICAgdGhpcy5fc29ja2V0LmVuZCgpXG4gIH1cblxuICBzZW5kIChkYXRhKSB7XG4gICAgLy8gY29udmVydCBkYXRhIHRvIHN0cmluZyBvciBub2RlIGJ1ZmZlclxuICAgIHRoaXMuX3NvY2tldC53cml0ZShhcnJheUJ1ZmZlclRvTm9kZUJ1ZmZlcihkYXRhKSwgdGhpcy5fZW1pdC5iaW5kKHRoaXMsICdkcmFpbicpKVxuICB9XG5cbiAgdXBncmFkZVRvU2VjdXJlICgpIHtcbiAgICBpZiAodGhpcy5zc2wpIHJldHVyblxuXG4gICAgdGhpcy5fcmVtb3ZlTGlzdGVuZXJzKClcbiAgICB0aGlzLl9zb2NrZXQgPSB0bHMuY29ubmVjdCh7IHNvY2tldDogdGhpcy5fc29ja2V0IH0sICgpID0+IHsgdGhpcy5zc2wgPSB0cnVlIH0pXG4gICAgdGhpcy5fYXR0YWNoTGlzdGVuZXJzKClcbiAgfVxufVxuXG5jb25zdCBub2RlQnVmZmVydG9BcnJheUJ1ZmZlciA9IGJ1ZiA9PiBVaW50OEFycmF5LmZyb20oYnVmKS5idWZmZXJcbmNvbnN0IGFycmF5QnVmZmVyVG9Ob2RlQnVmZmVyID0gKGFiKSA9PiBCdWZmZXIuZnJvbShuZXcgVWludDhBcnJheShhYikpXG4iXX0=