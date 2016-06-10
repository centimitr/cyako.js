import {CyakoRequest} from "./request";
import {CyakoTask} from "./task";
import {CyakoQueue} from "./queue";
import {CyakoSender} from "./sender";
import {CyakoReceiver} from "./receiver";
import {CyakoSocket} from "./socket";

export class CyakoInstance {
    // public websocket;
    public url: string;
    public queue: CyakoQueue;
    public receiver: CyakoReceiver;
    public sender: CyakoSender;
    public socket: CyakoSocket;
    constructor(url:string) {
        this.url=url;
    	this.queue = new CyakoQueue();
    	// this.socket = new socket((socket)=>{this.websocket = socket;});
    	this.receiver = new CyakoReceiver(this.queue);
    	this.socket = new CyakoSocket(this.url,this.receiver);
    	this.sender = new CyakoSender(this.queue,this.socket);
    };

    // API
    fetch(method:string,params:Object,data:Object){
    	let request = new CyakoRequest(method,params,data);
    	return new Promise((resolve,rejecct) => {
    		let task = new CyakoTask('single',request,resolve,rejecct);
    		this.queue.add(task);
    		this.sender.send();
    	});
    }
    
    listen(method: string, params: Object, data: Object) {
    	let request = new CyakoRequest(method,params,data);
    	return new Promise((resolve,rejecct) => {
            let task = new CyakoTask('multiple', request, resolve, rejecct);
            this.queue.add(task);
    		this.sender.send()
    	});
    }
}