import {CyakoQueue} from "./queue";

export class CyakoReceiver{
	public queue: CyakoQueue;
	constructor(queue:CyakoQueue){
		this.queue = queue;
	}
	resolve(response:Response){
		// console.log("RESOLVING:", response.id);
		let id = response.id;
		let task = this.queue.get(id);
		if (task) {
			if (task.expectDefaultResponse()){
				task.onresolve(response)
				if (!task.expectExtraResponse()) {
					this.queue.setFinished(id);
				}
			}else if (task.expectExtraResponse() && task.acceptExtraResponse) {
				task.extraOnresolve(response);
			}
		}
	};
}

interface Response{
	id:string
}