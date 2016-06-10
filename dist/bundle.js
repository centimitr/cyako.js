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
	// window.cyako = require("./instance").CyakoInstance;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	// import {CyakoConnector} from "./connector";
	var task_1 = __webpack_require__(2);
	var request_1 = __webpack_require__(3);
	var queue_1 = __webpack_require__(4);
	// import {CyakoSender} from "./sender";
	// import {CyakoReceiver} from "./receiver";
	var CyakoInstance = (function () {
	    function CyakoInstance(url) {
	        this.url = url;
	        this.websocket;
	        this.queue = new queue_1.CyakoQueue();
	        // this.socket = new socket((socket)=>{this.websocket = socket;});
	        this.receiver = new CyakoReceiver(this.queue);
	        this.socket = new CyakoSocket(this.url, this.receiver);
	        this.sender = new CyakoSender(this.queue, this.socket);
	        // initial
	        // this.connector.connect().then((ok)=>{
	        // 	this.bindEvents();
	        // },(err)=>{});
	    }
	    ;
	    // API
	    CyakoInstance.prototype.fetch = function (method, params, data) {
	        var _this = this;
	        var request = new request_1.CyakoRequest(method, params, data);
	        return new Promise(function (resolve, rejecct) {
	            var task = new task_1.CyakoTask(type, 'single', request, request, onresolve, resolve, onreject, rejecct);
	            _this.queue.add(task);
	            _this.sender.send();
	        });
	    };
	    CyakoInstance.prototype.listen = function (method, params, data) {
	        var _this = this;
	        var request = new request_1.CyakoRequest(method, params, data);
	        return new Promise(function (resolve, rejecct) {
	            var task = new task_1.CyakoTask(type, 'multiple', request, request, onresolve, resolve, onreject, rejecct);
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

	// import {CyakoRequest} from "./request"
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
/* 3 */
/***/ function(module, exports) {

	"use strict";
	var CyakoRequest = (function () {
	    function CyakoRequest(id, method, params, data) {
	        this.id = id || Date.now();
	        this.method = method,
	            this.params = JSON.stringify(params || {}),
	            this.data = JSON.stringify(data || {});
	    }
	    return CyakoRequest;
	}());
	exports.CyakoRequest = CyakoRequest;


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
	    // _addTask()
	    // addSingleRespTask(task){}
	    // removeSingleRespTask(){}
	    // addMultiRespTask(){}
	    // removeMultiRespTask(){}
	    // addTask(){}
	    // removeTask(){}
	    // resolveResp(){}
	    // clean()
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
	            op();
	        }, timeout);
	    };
	    return CyakoQueue;
	}());
	exports.CyakoQueue = CyakoQueue;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map