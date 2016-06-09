export class CyakoQueue{
	constructor{
		this.unsent = new Map();
		this.sent = new Map();
		// this.finished = new Map();
	}
	// _addTask()
	// addSingleRespTask(task){}
	// removeSingleRespTask(){}
	// addMultiRespTask(){}
	// removeMultiRespTask(){}
	// addTask(){}
	// removeTask(){}
	// resolveResp(){}
	// clean()
	add(task){
		this.unsent.set(task.id,task);
	}
	get(taskId){
		return this.sent.get(taskId);
	}
	setSent(taskId){
		if (this.unsent.has(taskId)){
			this.sent.set(taskId,this.unsent.get(taskId));
			this.unsent.delete(taskId)
		}
	}
	setFinished(taskId){
		if (this.sent.has(taskId)) {
			this.sent.delete(taskId)
		}
	}
	clean(){
		let timeout = 10000;
		let op = (sent) => {
			let entries = sent.entries(); 
			let item = entries.next();
			while(!item.done){
				let task = item.value;
				if (task.isTimeout()) {
					sent.delete(item.key)
				}
				item = entries.next();
			}
		};
		setTimeout(()=>{
			op();
		},timeout)
	}
}