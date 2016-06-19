import {CyakoRequest} from "./request"
import {CyakoResponse} from "./receiver";


// export class CyakoTask{
// 	public id: string;
// 	public type: string;
// 	public request: CyakoRequest;
// 	public acceptExtraResponse: boolean;
// 	public onresolve: Function;
// 	public onreject: Function;
// 	public extraOnresolve: Function;
// 	public extraOnreject: Function;
// 	public responseTimes: number;
// 	constructor(type: string, request: CyakoRequest, resolve: Function, reject: Function, extraResolve?: Function, extraReject?: Function) {
// 		this.id = request.id;
// 		this.type = type;
// 		this.request = request;
// 		this.acceptExtraResponse = true;
// 		this.onresolve = resolve;
// 		this.onreject = reject;
// 		this.extraOnresolve = extraResolve;
// 		this.extraOnreject = extraReject;
// 		this.responseTimes = 0;
// 		// this.createTime = new Date().toUTCString();
// 	}
// 	expectDefaultResponse() {
// 		return this.responseTimes === 0;
// 	}
// 	expectExtraResponse() {
// 		return this.type === 'multi' || this.type === 'multiple';
// 	}
// 	pause() {
// 		this.acceptExtraResponse = false;
// 	}
// 	continue() {
// 		this.acceptExtraResponse = true;
// 	}
// 	isTimeout(){
// 		return false;
// 	}
// }

export interface CyakoTask{
	// id: string
	// handle()
	id:string;
	handle(response:CyakoResponse);
}

export class CyakoFetchTask implements CyakoTask{
	public id: string;
	public request: CyakoRequest;
	public onresolve: Function;
	public onreject: Function;
	constructor(request: CyakoRequest, resolve: Function, reject: Function) {
		this.id = request.id;
		this.onresolve = resolve;
		this.onreject = reject;
	}
	handle(response:CyakoResponse) {
		this.onresolve(response);
	}
}

export class CyakoListenTask implements CyakoTask{
	public id: string;
	public request: CyakoRequest;
	public onresolve: Function;
	public onreject: Function;
	constructor(request: CyakoRequest, resolve: Function, reject: Function) {
		this.id = request.id;
		this.onresolve = resolve;
		this.onreject = reject;
	} 
	handle(response: CyakoResponse) {
		this.onresolve(response);
	}
	pause() { }
	resume() { }
	cancel() { }
}