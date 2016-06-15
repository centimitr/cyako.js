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
    private index: number;
    constructor(url:string) {
        this.url=url;
    	this.queue = new CyakoQueue();
    	// this.socket = new socket((socket)=>{this.websocket = socket;});
    	this.receiver = new CyakoReceiver(this.queue);
    	this.socket = new CyakoSocket(this.url,this.receiver);
    	this.sender = new CyakoSender(this.queue,this.socket);
        this.index = 0;
    };

    // API
    fetch(method:string,params:Object,data:Object){
    	let request = new CyakoRequest(method,params,data);
        request.setId("#" + this.index++ + ":" + method);
    	return new Promise((resolve,rejecct) => {
    		let task = new CyakoTask('single',request,resolve,rejecct);
    		this.queue.add(task);
    		this.sender.send();
    	});
    }
    
    listen(method: string, params: Object, data: Object) {
    	let request = new CyakoRequest(method,params,data);
        request.setId("#" + this.index++ + ":" + method);
        return new Listener(this.queue,this.sender,request);
    }
}

class Stream {
    public onresolve: Function;
    public onreject: Function;
    constructor() { }
    then(resolve?:Function,reject?:Function){
        this.onresolve = resolve;
        this.onreject = reject;
    }
}

class Listener{
    public promise: any;
    public stream: Stream;
    public isPause: boolean;
    public task: CyakoTask;
    public queue: CyakoQueue;
    public sender: CyakoSender;
    constructor(queue:CyakoQueue,sender:CyakoSender,request:CyakoRequest){
        this.queue = queue;
        this.sender = sender;
        this.isPause = false;
        this.stream = new Stream()
        this.promise = new Promise((resolve, rejecct) => {
            this.task = new CyakoTask('multiple', request, resolve, rejecct,this.stream.onresolve, this.stream.onreject);
            this.queue.add(this.task);
            this.sender.send();
        });
    }
    pause(){
        this.task.pause();
    }
    continue(){
        this.task.continue();
    }
    cancel(){
        this.queue.setFinished(this.task.id);
    }
}
