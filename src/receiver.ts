import {CyakoQueue} from "./queue";
import {CyakoTask} from "./task";


export class CyakoReceiver{
	public queue: CyakoQueue;
	constructor(queue:CyakoQueue){
		this.queue = queue;
	}
	resolve(response:CyakoResponse){
		let id = response.id;
		let task: CyakoTask;
		task = this.queue.get(id);
		if(task) {
			task.handle(response);
			console.log(typeof task);
		}
		// if (task) {
		// 	if (task.expectDefaultResponse()){
		// 		task.onresolve(response)
		// 		task.responseTimes++;
		// 		if (!task.expectExtraResponse()) {
		// 			this.queue.setFinished(id);
		// 		}
		// 	}else if (task.expectExtraResponse() && task.acceptExtraResponse) {
		// 		console.log("Stream Received.");
		// 		console.log(task.extraOnresolve);
		// 		task.responseTimes++;
		// 		task.extraOnresolve(response);
		// 	}
		// }
	};
}

export interface CyakoResponse{
	id:string
}