import {CyakoQueue} from "./queue";

export class CyakoReceiver{
	public queue: CyakoQueue;
	constructor(queue:CyakoQueue){
		this.queue = queue;
	}
	resolve(response:Response){
		let id = response.id;
		let task = this.queue.get(id);
		if (task) {
			if (task.expectDefaultResponse()){
				task.onresolve(response)
				task.responseTimes++;
				if (!task.expectExtraResponse()) {
					this.queue.setFinished(id);
				}
			}else if (task.expectExtraResponse() && task.acceptExtraResponse) {
				console.log("Stream Received.");
				console.log(task.extraOnresolve);
				task.responseTimes++;
				task.extraOnresolve(response);
			}
		}
	};
}

interface Response{
	id:string
}