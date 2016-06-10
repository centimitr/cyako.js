import {CyakoRequest} from "./request"

export class CyakoTask{
	public id: string;
	public type: string;
	public request: CyakoRequest;
	public onresolve: Function;
	public onreject: Function;
	constructor(type :string,request:CyakoRequest,resolve:Function,reject:Function){
		this.id = request.id;
		this.type = type;
		this.request = request;
		this.onresolve = resolve;
		this.onreject = reject;
		// this.createTime = new Date().toUTCString();
	}
	expectMultiResponses(){
		return this.type === 'multiple';
	}
	isTimeout(){
		return false;
	}
}