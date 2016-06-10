import {CyakoTask} from "./task";

export class CyakoQueue{
	public unsent: any;
	public sent: any;
	constructor(){
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
	add(task:CyakoTask){
		this.unsent.set(task.id,task);
	}
	get(taskId:string){
		return this.sent.get(taskId);
	}
	setSent(taskId:string){
		if (this.unsent.has(taskId)){
			this.sent.set(taskId,this.unsent.get(taskId));
			this.unsent.delete(taskId)
		}
	}
	setFinished(taskId:string){
		if (this.sent.has(taskId)) {
			this.sent.delete(taskId)
		}
	}
	clean(){
		let timeout = 10000;
		let op = (sent:any) => {
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
			op(this.sent);
		},timeout)
	}
}