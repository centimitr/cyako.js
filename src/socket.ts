import {CyakoReceiver} from "./receiver";
import {CyakoRequest} from "./request";

export class CyakoSocket{
	public url: string;
	public receiver: CyakoReceiver;
	public websocket: WebSocket;
	// constructor(url,callback){
	constructor(url:string,receiver:CyakoReceiver){
		this.url = url;
		this.receiver = receiver;
		// this.socketCallback = callback;
		// this.websocket;
	}
	send(request:CyakoRequest){
		if (this.isConnected){
			this.websocket.send(JSON.stringify(request));
		}
	}
	connect(){
		return new Promise((resolve,reject) => {
			if (!this.websocket || this.websocket.readyState===3){
				this.websocket = new WebSocket(this.url);
				interface ReceivedData {
					data:string
				}
				this.websocket.onmessage = (data:ReceivedData) =>{
					let response = JSON.parse(data.data);
   		 			this.receiver.resolve(response);
				}	
    			// this.websocket.onclose = () =>{};
   		    	// this.websocket.onerror = () =>{};
				this.websocket.onopen = () => {
					// this.socketCallback(this.websocket)
					resolve();
				}
  		  	}else{
  		  		reject();
  		  	};
		});
	}
	isConnected(){
		return this.websocket && this.websocket.readyState === 1;
	}
}