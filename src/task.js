// import {CyakoRequest} from "./request"

export class CyakoTask{
	constructor(type,request,resolve,reject){
		this.id = request.id;
		this.type = type;
		this.request = request;
		this.onresolve = resolve;
		this.onreject = reject;
		// this.time = new Date().now();
	}
	expectMultiResponses(){
		return this.type === 'multiple';
	}
	isTimeout(){
		return false;
	}
}