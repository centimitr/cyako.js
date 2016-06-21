import {CyakoQueue} from "./queue";
import {CyakoSocket} from "./socket";

export class CyakoSender {
	private queue: CyakoQueue;
	private socket: CyakoSocket;
	constructor(queue:CyakoQueue,socket:CyakoSocket){
		this.queue = queue;
		this.socket = socket;
	}
	send(){
		let sendUnsent = () => {
			let entries = this.queue.unsent.entries();
			let item = entries.next();
			while(!item.done){
				let task = item.value[1];
				this.socket.send(task.request);
				this.queue.setSent(task.id);
				item = entries.next();
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
