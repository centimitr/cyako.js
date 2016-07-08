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
	        this.receiver = new receiver_1.CyakoReceiver(this.queue);
	        this.socket = new socket_1.CyakoSocket(this.url, this.receiver, this.queue);
	        this.sender = new sender_1.CyakoSender(this.queue, this.socket);
	        this.index = 0;
	    }
	    ;
	    // API
	    CyakoInstance.prototype.fetch = function (method, params, data) {
	        var _this = this;
	        var request = new request_1.CyakoRequest(method, params, data);
	        request.setId('#' + this.index++ + ':' + method);
	        return new Promise(function (resolve, reject) {
	            var task = new task_1.CyakoFetchTask(request, resolve, reject);
	            _this.queue.add(task);
	            _this.sender.send();
	        });
	    };
	    CyakoInstance.prototype.listen = function (method, params, data) {
	        var _this = this;
	        var request = new request_1.CyakoRequest(method, params, data);
	        request.setId('#' + this.index++ + ':' + method);
	        return new CyakoListenHandler(this.queue, function (ack, resolve, reject) {
	            var task = new task_1.CyakoListenTask(request, ack, resolve, reject);
	            _this.queue.add(task);
	            _this.sender.send();
	            return task;
	        });
	    };
	    return CyakoInstance;
	}());
	exports.CyakoInstance = CyakoInstance;
	var CyakoListenHandler = (function () {
	    function CyakoListenHandler(queue, fn) {
	        this.queue = queue;
	        this.fn = fn;
	    }
	    CyakoListenHandler.prototype.then = function (ack, resolve, reject) {
	        // remove the previos task from the queue
	        this.cancel();
	        this.task = this.fn(ack, resolve, reject);
	    };
	    CyakoListenHandler.prototype.pause = function () {
	        this.task && this.task.pause();
	    };
	    CyakoListenHandler.prototype.resume = function () {
	        this.task && this.task.resume();
	    };
	    CyakoListenHandler.prototype.cancel = function () {
	        this.task && this.queue.setFinished(this.task.id);
	    };
	    return CyakoListenHandler;
	}());


/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	var CyakoRequest = (function () {
	    function CyakoRequest(method, params, data) {
	        this.method = method,
	            this.params = params,
	            this.data = data;
	    }
	    CyakoRequest.prototype.setId = function (id) {
	        this.id = id;
	    };
	    return CyakoRequest;
	}());
	exports.CyakoRequest = CyakoRequest;


/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	var CyakoFetchTask = (function () {
	    function CyakoFetchTask(request, resolve, reject) {
	        this.id = request.id;
	        this.request = request;
	        this.onresolve = resolve;
	        this.onreject = reject;
	    }
	    CyakoFetchTask.prototype.handle = function (response) {
	        this.onresolve(response);
	    };
	    return CyakoFetchTask;
	}());
	exports.CyakoFetchTask = CyakoFetchTask;
	var CyakoListenTask = (function () {
	    function CyakoListenTask(request, ack, resolve, reject) {
	        this.id = request.id;
	        this.request = request;
	        this.onresolve = resolve;
	        this.onreject = reject;
	        this.onack = ack;
	        this.expectAck = true;
	        this.accecptResponse = true;
	    }
	    CyakoListenTask.prototype.handle = function (response) {
	        if (this.accecptResponse) {
	            if (this.expectAck) {
	                this.onack(response);
	                this.expectAck = false;
	            }
	            else {
	                this.onresolve(response);
	            }
	        }
	    };
	    CyakoListenTask.prototype.pause = function () {
	        this.accecptResponse = false;
	    };
	    CyakoListenTask.prototype.resume = function () {
	        this.accecptResponse = false;
	    };
	    return CyakoListenTask;
	}());
	exports.CyakoListenTask = CyakoListenTask;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var task_1 = __webpack_require__(3);
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
	    CyakoQueue.prototype.isNeedReconnect = function () {
	        var entries = this.sent.entries();
	        var item = entries.next();
	        while (!item.done) {
	            var task = item.value;
	            if (task instanceof task_1.CyakoListenTask) {
	                return true;
	            }
	        }
	        return false;
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
	                var task = item.value[1];
	                _this.socket.send(task.request);
	                _this.queue.setSent(task.id);
	                item = entries.next();
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
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var task_1 = __webpack_require__(3);
	var CyakoReceiver = (function () {
	    function CyakoReceiver(queue) {
	        this.queue = queue;
	    }
	    CyakoReceiver.prototype.resolve = function (response) {
	        var id = response.id;
	        var task;
	        task = this.queue.get(id);
	        if (task) {
	            task.handle(response);
	            if (task instanceof task_1.CyakoFetchTask) {
	                this.queue.setFinished(task.id);
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
	    function CyakoSocket(url, receiver, queue) {
	        this.url = url;
	        this.receiver = receiver;
	        this.queue = queue;
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
	                _this.websocket.onclose = function () {
	                    console.info("Closed.");
	                    if (_this.queue.isNeedReconnect()) {
	                        _this.connect();
	                    }
	                };
	                _this.websocket.onerror = function () {
	                    console.info("Errord.");
	                };
	                _this.websocket.onopen = function () {
	                    console.info("Connected.");
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