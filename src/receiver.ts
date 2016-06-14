import {CyakoQueue} from "./queue";

export class CyakoReceiver{
	public queue: CyakoQueue;
	constructor(queue:CyakoQueue){
		this.queue = queue;
	}
	resolve(response:Response){
		console.log("RESOLVING:", response.id);
		let id = response.id;
		let task = this.queue.get(id);
		if (task && task.acceptResolve) {
			console.log("START RESOLVE.");
			console.log(task.)
			task.onresolve(response);
			if (!task.expectMultiResponses()) {
				this.queue.setFinished(id);
			}
		}
	};
}

interface Response{
	id:string
}