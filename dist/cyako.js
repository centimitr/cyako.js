/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	window.Cyako = __webpack_require__(1).Cyako;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Cyako = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _queue = __webpack_require__(2);

	var _task = __webpack_require__(3);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Cyako = exports.Cyako = function () {
	    function Cyako(url) {
	        _classCallCheck(this, Cyako);

	        this.url = url;
	        this.websocket;
	        this.queue = [];
	        this.queue.queuedNum = function () {
	            var num = 0;
	            var _iteratorNormalCompletion = true;
	            var _didIteratorError = false;
	            var _iteratorError = undefined;

	            try {
	                for (var _iterator = this[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                    var item = _step.value;

	                    if (item.isQueued()) {
	                        num++;
	                    }
	                }
	            } catch (err) {
	                _didIteratorError = true;
	                _iteratorError = err;
	            } finally {
	                try {
	                    if (!_iteratorNormalCompletion && _iterator.return) {
	                        _iterator.return();
	                    }
	                } finally {
	                    if (_didIteratorError) {
	                        throw _iteratorError;
	                    }
	                }
	            }

	            return num;
	        };
	        this.queue.sentNum = function () {
	            var num = 0;
	            var _iteratorNormalCompletion2 = true;
	            var _didIteratorError2 = false;
	            var _iteratorError2 = undefined;

	            try {
	                for (var _iterator2 = this[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	                    var item = _step2.value;

	                    if (item.isSent()) {
	                        num++;
	                    }
	                }
	            } catch (err) {
	                _didIteratorError2 = true;
	                _iteratorError2 = err;
	            } finally {
	                try {
	                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
	                        _iterator2.return();
	                    }
	                } finally {
	                    if (_didIteratorError2) {
	                        throw _iteratorError2;
	                    }
	                }
	            }

	            return num;
	        };
	        this.queue.getFirstQueued = function () {
	            var _iteratorNormalCompletion3 = true;
	            var _didIteratorError3 = false;
	            var _iteratorError3 = undefined;

	            try {
	                for (var _iterator3 = this[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	                    var item = _step3.value;

	                    if (item.isQueued()) {
	                        return item;
	                    }
	                }
	            } catch (err) {
	                _didIteratorError3 = true;
	                _iteratorError3 = err;
	            } finally {
	                try {
	                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
	                        _iterator3.return();
	                    }
	                } finally {
	                    if (_didIteratorError3) {
	                        throw _iteratorError3;
	                    }
	                }
	            }
	        };
	        this.queue.clear = function () {
	            this.splice(0, this.queue.length);
	        };
	        this.queue.clearResolveAndReject = function () {
	            var num = this.length;
	            while (num--) {
	                var item = this.pop();
	                if (!item.isResolve() && !item.isReject()) {
	                    this.push(item);
	                }
	            }
	        };
	        this.listenIdList = [];
	        this._requestOrder = 0;
	        this.MAX_WAITING_NUM = 64;
	        this.CONTINUE_SEND_REST_DELAY = 10;
	        this.CONTINUE_SEND_REST_RATIO = 0.6;
	        this.REQUEST_TIMEOUT = 150;
	        this.PROMISE_TIMEOUT = 6400;
	        // this.CONNECTION_TIMEOUT = 4000;
	        this._connect();
	    }

	    _createClass(Cyako, [{
	        key: "_isConnected",
	        value: function _isConnected() {
	            return this.websocket && this.websocket.readyState === 1;
	        }
	    }, {
	        key: "_sendQueueRequests",
	        value: function _sendQueueRequests() {
	            if (this._isConnected()) {
	                if (this.queue.sentNum() <= this.MAX_WAITING_NUM * this.CONTINUE_SEND_REST_RATIO) {
	                    var sendNum = Math.min(this.queue.queuedNum(), this.MAX_WAITING_NUM - this.queue.sentNum());
	                    while (sendNum--) {
	                        var w = this.queue.getFirstQueued();
	                        this.websocket.send(JSON.stringify(w.request));
	                        w.startTiming(this.REQUEST_TIMEOUT);
	                        w.setSent();
	                    }
	                }
	                if (this.queue.queuedNum() > 0) {
	                    this._continueSendRest();
	                }
	            } else {
	                this._connect();
	            }
	        }
	    }, {
	        key: "_continueSendRest",
	        value: function _continueSendRest() {
	            var _this = this;

	            //console.log('RETRY');
	            setTimeout(function () {
	                _this._sendQueueRequests();
	            }, this.CONTINUE_SEND_REST_DELAY);
	        }
	    }, {
	        key: "fetch",
	        value: function fetch(method, params, data) {
	            var _this2 = this;

	            return new Promise(function (resolve, reject) {
	                // add new task.
	                var w = new _task.CyakoTask(_this2._requestOrder++ + '.' + method, method, params, data);
	                w.onreceive = function (data) {
	                    w.setResolve();
	                    data.params = JSON.parse(data.params);
	                    while (typeof data.data === "string") {
	                        data.data = JSON.parse(data.data);
	                    }
	                    resolve(data);
	                    return;
	                };
	                //console.log('METHOD: Send.');
	                _this2.queue.push(w);
	                // do task in queue
	                _this2._sendQueueRequests();
	                // timeout
	                w.ontimeout = function () {
	                    w.setReject();
	                    reject('Request Timeout.');
	                };
	                setTimeout(function () {
	                    w.setReject();
	                    reject('Promise Timeout.');
	                }, _this2.PROMISE_TIMEOUT);
	            });
	        }
	    }, {
	        key: "on",
	        value: function on(id, callback) {
	            this.listenIdList.push({
	                id: id,
	                onreceive: callback
	            });
	        }
	    }, {
	        key: "clear",
	        value: function clear() {
	            this.queue.clear();
	        }
	    }, {
	        key: "_connect",


	        // connection
	        value: function _connect() {
	            var _this3 = this;

	            // if no websocket has been initialed or the websocket has been closed
	            if (!this.websocket || this.websocket.readyState === 3) {
	                //console.log('SOCKET: Try to connect.');
	                this.websocket = new WebSocket(this.url);
	                this.websocket.onopen = function (event) {
	                    //console.log('SOCKET: Open.');
	                    // send all requests in queue
	                    //console.log('SOCKET: Start Clearing the Queue.');
	                    _this3._sendQueueRequests();
	                };
	                this.websocket.onmessage = function (event) {
	                    var data = JSON.parse(event.data);
	                    //console.log('SOCKET: Message.', data.id);
	                    // match and clear 1 request.
	                    var havntMatch = true;
	                    _this3.queue.map(function (w, i) {
	                        if (havntMatch && w.isSent() && w.id === data.id) {
	                            //console.log("METHOD: Catch matched response: " + w.id);
	                            w.onreceive(data);
	                            havntMatch = false;
	                        }
	                    });
	                    _this3.listenIdList.forEach(function (item, i) {
	                        if (item.id === data.id) {
	                            item.onreceive();
	                        }
	                    });
	                };
	                this.websocket.onclose = function () {};
	                this.websocket.onerror = function () {};
	            }
	        }
	    }, {
	        key: "disconnect",
	        value: function disconnect() {
	            if (this._isConnected()) {
	                this.websocket.close();
	                //console.log('SOCKET: Close.');
	            }
	        }
	    }]);

	    return Cyako;
	}();

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var CyakoQueue = exports.CyakoQueue = function () {
	    function CyakoQueue() {
	        _classCallCheck(this, CyakoQueue);
	    }

	    _createClass(CyakoQueue, [{
	        key: "queuedNum",
	        value: function queuedNum() {
	            var num = 0;
	            var _iteratorNormalCompletion = true;
	            var _didIteratorError = false;
	            var _iteratorError = undefined;

	            try {
	                for (var _iterator = this[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                    var item = _step.value;

	                    if (item.isQueued()) {
	                        num++;
	                    }
	                }
	            } catch (err) {
	                _didIteratorError = true;
	                _iteratorError = err;
	            } finally {
	                try {
	                    if (!_iteratorNormalCompletion && _iterator.return) {
	                        _iterator.return();
	                    }
	                } finally {
	                    if (_didIteratorError) {
	                        throw _iteratorError;
	                    }
	                }
	            }

	            return num;
	        }
	    }, {
	        key: "sentNum",
	        value: function sentNum() {
	            var num = 0;
	            var _iteratorNormalCompletion2 = true;
	            var _didIteratorError2 = false;
	            var _iteratorError2 = undefined;

	            try {
	                for (var _iterator2 = this[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	                    var item = _step2.value;

	                    if (item.isSent()) {
	                        num++;
	                    }
	                }
	            } catch (err) {
	                _didIteratorError2 = true;
	                _iteratorError2 = err;
	            } finally {
	                try {
	                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
	                        _iterator2.return();
	                    }
	                } finally {
	                    if (_didIteratorError2) {
	                        throw _iteratorError2;
	                    }
	                }
	            }

	            return num;
	        }
	    }, {
	        key: "getFirstQueued",
	        value: function getFirstQueued() {
	            var _iteratorNormalCompletion3 = true;
	            var _didIteratorError3 = false;
	            var _iteratorError3 = undefined;

	            try {
	                for (var _iterator3 = this[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	                    var item = _step3.value;

	                    if (item.isQueued()) {
	                        return item;
	                    }
	                }
	            } catch (err) {
	                _didIteratorError3 = true;
	                _iteratorError3 = err;
	            } finally {
	                try {
	                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
	                        _iterator3.return();
	                    }
	                } finally {
	                    if (_didIteratorError3) {
	                        throw _iteratorError3;
	                    }
	                }
	            }
	        }
	    }]);

	    return CyakoQueue;
	}();

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var CyakoTask = exports.CyakoTask = function () {
		function CyakoTask(id, method, params, data) {
			_classCallCheck(this, CyakoTask);

			this.id = id || Date.now();
			this.status = 'queued';
			this.request = {
				id: this.id,
				// session: session,
				method: method,
				params: JSON.stringify(params || {}),
				data: JSON.stringify(data || {})
			};
		}

		_createClass(CyakoTask, [{
			key: 'isQueued',
			value: function isQueued() {
				return this.status === 'queued';
			}
		}, {
			key: 'isSent',
			value: function isSent() {
				return this.status === 'sent';
			}
		}, {
			key: 'setSent',
			value: function setSent() {
				this.status = 'sent';
			}
		}, {
			key: 'setReject',
			value: function setReject() {
				this.status = 'reject';
			}
		}, {
			key: 'setResolve',
			value: function setResolve() {
				this.status = 'resolve';
			}
		}, {
			key: 'startTiming',
			value: function startTiming(delay) {
				var _this = this;

				setTimeout(function () {
					if (_this.isSent()) {
						_this.ontimeout();
					}
				}, delay);
			}
		}, {
			key: 'onreceive',
			value: function onreceive() {}
		}, {
			key: 'ontimeout',
			value: function ontimeout() {}
		}]);

		return CyakoTask;
	}();

/***/ }
/******/ ]);