import {CyakoReceiver} from './receiver';
import {CyakoRequest} from './request';

export class CyakoSocket{
	public url: string;
	private receiver: CyakoReceiver;
	private websocket: WebSocket;
	constructor(url:string,receiver:CyakoReceiver){
		this.url = url;
		this.receiver = receiver;
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
    			this.websocket.onclose = () =>{
					console.info("Closed.")
    			};
   		    	this.websocket.onerror = () =>{
					console.info("Errord.")
   		    	};
				this.websocket.onopen = () => {
					console.info("Connected.")
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