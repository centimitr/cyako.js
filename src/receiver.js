export class CyakoReceiver{
	constructor(queue){
		this.queue = queue;
	}
	resolve(response){
		let id = response.id;
		let task = this.queue.get(id);
		if (task) {
			task.onresolve();
			if (!task.expectMultiResponses()) {
				this.queue.setFinished(id);
			}
		}
	};
}