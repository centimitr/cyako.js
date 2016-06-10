export class CyakoSender{
	constructor(queue,socket){
		this.queue = queue;
		this.socket = socket;
	}
	send(){
		let sendUnsent = () => {
			let entries = this.queue.unsent.entries();
			let item = entries.next();
			while(!item.done){
				let request = item.value.request;
				this.socket.send(request)
			}
		};
		if (this.socket.isConnected()){
			sendUnsent();
		}else{
			this.socket.connect().then(ok=>{
				sendUnsent();
			},err=>{});
		}
	}
}
