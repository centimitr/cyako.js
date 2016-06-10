/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	window.Cyako = __webpack_require__(1).CyakoInstance;
	window.cyako = __webpack_require__(1).CyakoInstance;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var request_1 = __webpack_require__(2);
	var task_1 = __webpack_require__(3);
	var queue_1 = __webpack_require__(4);
	var sender_1 = __webpack_require__(5);
	var receiver_1 = __webpack_require__(6);
	var socket_1 = __webpack_require__(7);
	var CyakoInstance = (function () {
	    function CyakoInstance(url) {
	        this.url = url;
	        this.queue = new queue_1.CyakoQueue();
	        // this.socket = new socket((socket)=>{this.websocket = socket;});
	        this.receiver = new receiver_1.CyakoReceiver(this.queue);
	        this.socket = new socket_1.CyakoSocket(this.url, this.receiver);
	        this.sender = new sender_1.CyakoSender(this.queue, this.socket);
	    }
	    ;
	    // API
	    CyakoInstance.prototype.fetch = function (method, params, data) {
	        var _this = this;
	        var request = new request_1.CyakoRequest(method, params, data);
	        return new Promise(function (resolve, rejecct) {
	            var task = new task_1.CyakoTask('single', request, resolve, rejecct);
	            _this.queue.add(task);
	            _this.sender.send();
	        });
	    };
	    CyakoInstance.prototype.listen = function (method, params, data) {
	        var _this = this;
	        var request = new request_1.CyakoRequest(method, params, data);
	        return new Promise(function (resolve, rejecct) {
	            var task = new task_1.CyakoTask('multiple', request, resolve, rejecct);
	            _this.queue.add(task);
	            _this.sender.send();
	        });
	    };
	    return CyakoInstance;
	}());
	exports.CyakoInstance = CyakoInstance;


/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	var CyakoRequest = (function () {
	    function CyakoRequest(method, params, data) {
	        // this.id = id || Date.now().toString();
	        // this.params = JSON.stringify(params || {}),
	        // this.data = JSON.stringify(data || {})
	        this.method = method,
	            this.params = params,
	            this.data = data;
	    }
	    return CyakoRequest;
	}());
	exports.CyakoRequest = CyakoRequest;


/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	var CyakoTask = (function () {
	    function CyakoTask(type, request, resolve, reject) {
	        this.id = request.id;
	        this.type = type;
	        this.request = request;
	        this.onresolve = resolve;
	        this.onreject = reject;
	        // this.time = new Date().now();
	    }
	    CyakoTask.prototype.expectMultiResponses = function () {
	        return this.type === 'multiple';
	    };
	    CyakoTask.prototype.isTimeout = function () {
	        return false;
	    };
	    return CyakoTask;
	}());
	exports.CyakoTask = CyakoTask;


/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";
	var CyakoQueue = (function () {
	    function CyakoQueue() {
	        this.unsent = new Map();
	        this.sent = new Map();
	        // this.finished = new Map();
	    }
	    CyakoQueue.prototype.add = function (task) {
	        this.unsent.set(task.id, task);
	    };
	    CyakoQueue.prototype.get = function (taskId) {
	        return this.sent.get(taskId);
	    };
	    CyakoQueue.prototype.setSent = function (taskId) {
	        if (this.unsent.has(taskId)) {
	            this.sent.set(taskId, this.unsent.get(taskId));
	            this.unsent.delete(taskId);
	        }
	    };
	    CyakoQueue.prototype.setFinished = function (taskId) {
	        if (this.sent.has(taskId)) {
	            this.sent.delete(taskId);
	        }
	    };
	    CyakoQueue.prototype.clean = function () {
	        var _this = this;
	        var timeout = 10000;
	        var op = function (sent) {
	            var entries = sent.entries();
	            var item = entries.next();
	            while (!item.done) {
	                var task = item.value;
	                if (task.isTimeout()) {
	                    sent.delete(item.key);
	                }
	                item = entries.next();
	            }
	        };
	        setTimeout(function () {
	            op(_this.sent);
	        }, timeout);
	    };
	    return CyakoQueue;
	}());
	exports.CyakoQueue = CyakoQueue;


/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";
	var CyakoSender = (function () {
	    function CyakoSender(queue, socket) {
	        this.queue = queue;
	        this.socket = socket;
	    }
	    CyakoSender.prototype.send = function () {
	        var _this = this;
	        var sendUnsent = function () {
	            var entries = _this.queue.unsent.entries();
	            var item = entries.next();
	            while (!item.done) {
	                var request = item.value.request;
	                _this.socket.send(request);
	            }
	        };
	        if (this.socket.isConnected()) {
	            sendUnsent();
	        }
	        else {
	            this.socket.connect().then(function (ok) {
	                sendUnsent();
	            }, function (err) { });
	        }
	    };
	    return CyakoSender;
	}());
	exports.CyakoSender = CyakoSender;


/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";
	var CyakoReceiver = (function () {
	    function CyakoReceiver(queue) {
	        this.queue = queue;
	    }
	    CyakoReceiver.prototype.resolve = function (response) {
	        var id = response.id;
	        var task = this.queue.get(id);
	        if (task) {
	            task.onresolve(response);
	            if (!task.expectMultiResponses()) {
	                this.queue.setFinished(id);
	            }
	        }
	    };
	    ;
	    return CyakoReceiver;
	}());
	exports.CyakoReceiver = CyakoReceiver;


/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";
	var CyakoSocket = (function () {
	    // constructor(url,callback){
	    function CyakoSocket(url, receiver) {
	        this.url = url;
	        this.receiver = receiver;
	        // this.socketCallback = callback;
	        // this.websocket;
	    }
	    CyakoSocket.prototype.send = function (request) {
	        if (this.isConnected) {
	            this.websocket.send(JSON.stringify(request));
	        }
	    };
	    CyakoSocket.prototype.connect = function () {
	        var _this = this;
	        return new Promise(function (resolve, reject) {
	            if (!_this.websocket || _this.websocket.readyState === 3) {
	                _this.websocket = new WebSocket(_this.url);
	                _this.websocket.onmessage = function (data) {
	                    var response = JSON.parse(data.data);
	                    _this.receiver.resolve(response);
	                };
	                // this.websocket.onclose = () =>{};
	                // this.websocket.onerror = () =>{};
	                _this.websocket.onopen = function () {
	                    // this.socketCallback(this.websocket)
	                    resolve();
	                };
	            }
	            else {
	                reject();
	            }
	            ;
	        });
	    };
	    CyakoSocket.prototype.isConnected = function () {
	        return this.websocket && this.websocket.readyState === 1;
	    };
	    return CyakoSocket;
	}());
	exports.CyakoSocket = CyakoSocket;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map