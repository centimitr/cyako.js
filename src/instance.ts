// import {CyakoConnector} from "./connector";
import {CyakoTask} from "./task";
import {CyakoRequest} from "./request";
import {CyakoQueue} from "./queue";
// import {CyakoSender} from "./sender";
// import {CyakoReceiver} from "./receiver";

export class CyakoInstance {
    constructor(url) {
    	this.url=url;
    	this.websocket;
    	this.queue = new CyakoQueue();
    	// this.socket = new socket((socket)=>{this.websocket = socket;});
    	this.receiver = new CyakoReceiver(this.queue);
    	this.socket = new CyakoSocket(this.url,this.receiver);
    	this.sender = new CyakoSender(this.queue,this.socket);
    	// initial
    	// this.connector.connect().then((ok)=>{
    	// 	this.bindEvents();
    	// },(err)=>{});
    };

    // API
    fetch(method,params,data){
    	let request = new CyakoRequest(method,params,data);
    	return new Promise((resolve,rejecct) => {
    		let task = new CyakoTask(type:'single',request:request,onresolve:resolve,onreject:rejecct);
    		this.queue.add(task);
    		this.sender.send();
    	});
    }
    
    listen(method,params,data){
    	let request = new CyakoRequest(method,params,data);
    	return new Promise((resolve,rejecct) => {
    		let task = new CyakoTask(type:'multiple',request:request,onresolve:resolve,onreject:rejecct);
    		this.queue.add(task);
    		this.sender.send()
    	});
    }
}