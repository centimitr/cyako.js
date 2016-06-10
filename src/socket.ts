export class CyakoSocket(){
	// constructor(url,callback){
	constructor(url,receiver){
		this.url = url;
		this.receiver = receiver;
		// this.socketCallback = callback;
		this.websocket;
	}
	send(request){
		if (this.isConnected){
			this.websocket.send(JSON.stringify(request));
		}
	}
	connect(){
		return new Promise((resolve,reject) => {
			if (!this.websocket || this.websocket.readyState===3){
				this.websocket = new Websocket(url);
				this.websocket.onmessage = (data) =>{
					let response = JSON.parse(data.data);
   		 			this.receiver.resolve(response);
				}	
    			// this.websocket.onclose = () =>{};
   		    	// this.websocket.onerror = () =>{};
				this.websocket.onconnect = () => {
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