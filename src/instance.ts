import {CyakoRequest} from './request';
import {CyakoFetchTask,CyakoListenTask} from './task';
import {CyakoQueue} from './queue';
import {CyakoSender} from './sender';
import {CyakoReceiver} from './receiver';
import {CyakoSocket} from './socket';

export class CyakoInstance {
    // public websocket;
    public url: string;
    private queue: CyakoQueue;
    private receiver: CyakoReceiver;
    private sender: CyakoSender;
    private socket: CyakoSocket;
    private index: number;
    constructor(url:string) {
        this.url=url;
    	this.queue = new CyakoQueue();
    	this.receiver = new CyakoReceiver(this.queue);
    	this.socket = new CyakoSocket(this.url,this.receiver);
    	this.sender = new CyakoSender(this.queue,this.socket);
        this.index = 0;
    };

    // API
    fetch(method:string,params:Object,data:Object){
        let request = new CyakoRequest(method,params,data);
        request.setId('#' + this.index++ + ':' + method);
        return new Promise((resolve, reject) => {
            let task = new CyakoFetchTask(request, resolve, reject);
            this.queue.add(task);
            this.sender.send();
        });
    }

    listen(method: string, params: Object, data: Object) {
        let request = new CyakoRequest(method, params, data);
        request.setId('#' + this.index++ + ':' + method);
        return new CyakoListenHandler(this.queue, (ack: Function, resolve: Function, reject: Function) => {
            let task = new CyakoListenTask(request, ack, resolve, reject);
            this.queue.add(task);
            this.sender.send();
            return task;
        })
    }
}

class CyakoListenHandler{
    public queue: CyakoQueue;
    public task: CyakoListenTask;
    public fn: Function;
    constructor(queue:CyakoQueue,fn:Function){
        this.queue = queue;
        this.fn = fn;
    }
    then(ack:Function,resolve:Function,reject:Function){
        // remove the previos task from the queue
        this.cancel();
        this.task = this.fn(ack,resolve,reject);
    }
    pause(){
        this.task && this.task.pause();
    }
    resume(){
        this.task && this.task.resume();
    }
    cancel(){
        this.task && this.queue.setFinished(this.task.id);
    }
}