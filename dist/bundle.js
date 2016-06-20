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
	        this.index = 0;
	    }
	    ;
	    // API
	    // fetch(method:string,params:Object,data:Object){
	    // 	let request = new CyakoRequest(method,params,data);
	    //     request.setId("#" + this.index++ + ":" + method);
	    // 	return new Promise((resolve,rejecct) => {
	    // 		let task = new CyakoTask('single',request,resolve,rejecct);
	    // 		this.queue.add(task);
	    // 		this.sender.send();
	    // 	});
	    // }
	    // listen(method: string, params: Object, data: Object) {
	    // 	let request = new CyakoRequest(method,params,data);
	    //     request.setId("#" + this.index++ + ":" + method);
	    //     return new Listener(this.queue,this.sender,request);
	    // }
	    CyakoInstance.prototype.fetch = function (method, params, data) {
	        var _this = this;
	        var request = new request_1.CyakoRequest(method, params, data);
	        request.setId("#" + this.index++ + ":" + method);
	        return new Promise(function (resolve, reject) {
	            var task = new task_1.CyakoFetchTask(request, resolve, reject);
	            _this.queue.add(task);
	            _this.sender.send();
	        });
	    };
	    CyakoInstance.prototype.listen = function (method, params, data) {
	        var _this = this;
	        var request = new request_1.CyakoRequest(method, params, data);
	        request.setId("#" + this.index++ + ":" + method);
	        return new CyakoHandler(this.queue, function (resolve, reject) {
	            var task = new task_1.CyakoListenTask(request, resolve, reject);
	            _this.queue.add(task);
	            _this.sender.send();
	            return task;
	        });
	    };
	    return CyakoInstance;
	}());
	exports.CyakoInstance = CyakoInstance;
	var CyakoHandler = (function () {
	    function CyakoHandler(queue, fn) {
	        this.fn = fn;
	    }
	    CyakoHandler.prototype.then = function (resolve, reject) {
	        this.fn(resolve, reject);
	    };
	    CyakoHandler.prototype.pause = function () {
	        this.task.pause();
	    };
	    CyakoHandler.prototype.resume = function () {
	        this.task.resume();
	    };
	    CyakoHandler.prototype.cancel = function () {
	        this.queue.setFinished(this.task.id);
	    };
	    return CyakoHandler;
	}());
	// class Stream {
	//     public onresolve: Function;
	//     public onreject: Function;
	//     constructor() {
	//         this.onresolve = () => { }
	//         this.onreject = () => { }
	//     }
	//     resolve(){
	//         console.log("Stream Resolved");
	//         console.log(this.onresolve);
	//         this.onresolve();
	//     }
	//     reject(){
	//         this.onreject();
	//     }
	//     then(resolve:Function,reject:Function){
	//         console.log(this.onresolve,this.onreject);
	//         this.onresolve = resolve;
	//         this.onreject = reject;
	//     }
	// }
	// class Listener{
	//     public promise: any;
	//     public stream: Stream;
	//     public isPause: boolean;
	//     public task: CyakoTask;
	//     public queue: CyakoQueue;
	//     public sender: CyakoSender;
	//     constructor(queue:CyakoQueue,sender:CyakoSender,request:CyakoRequest){
	//         this.queue = queue;
	//         this.sender = sender;
	//         this.isPause = false;
	//         this.stream = new Stream();
	//         this.promise = new Promise((resolve, rejecct) => {
	//             this.task = new CyakoTask('multiple', request, resolve, rejecct,this.stream.onresolve, this.stream.onreject);
	//             this.queue.add(this.task);
	//             this.sender.send();
	//         });
	//     }
	//     pause(){
	//         this.task.pause();
	//     }
	//     continue(){
	//         this.task.continue();
	//     }
	//     cancel(){
	//         this.queue.setFinished(this.task.id);
	//     }
	// }


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
	    function CyakoListenTask(request, resolve, reject) {
	        this.id = request.id;
	        this.request = request;
	        this.onresolve = resolve;
	        this.onreject = reject;
	        this.expectAck = true;
	        this.accecptResponse = true;
	    }
	    CyakoListenTask.prototype.handle = function (response) {
	        if (this.accecptResponse) {
	            if (this.expectAck) {
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
	                _this.websocket.onclose = function () {
	                    console.info("Closed.");
	                };
	                _this.websocket.onerror = function () {
	                    console.info("Errord.");
	                };
	                _this.websocket.onopen = function () {
	                    // this.socketCallback(this.websocket)
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