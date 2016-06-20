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
	handle(response:CyakoResponse):any;
}

export class CyakoFetchTask implements CyakoTask{
	public id: string;
	public request: CyakoRequest;
	public onresolve: Function;
	public onreject: Function;
	constructor(request: CyakoRequest, resolve: Function, reject: Function) {
		this.id = request.id;
		this.request = request;
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
	public onack: Function;
	public expectAck: boolean;
	public accecptResponse: boolean;
	constructor(request: CyakoRequest,ack: Function, resolve: Function, reject: Function) {
		this.id = request.id;
		this.request = request;
		this.onresolve = resolve;
		this.onreject = reject;
		this.onack = ack;
		this.expectAck = true;
		this.accecptResponse = true;
	}
	handle(response: CyakoResponse) {
		if(this.accecptResponse) {
			if (this.expectAck) {
				this.onack(response);
				this.expectAck = false;
				// if (response.isAckOk === 'ok') {	
				// }
			} else {
				this.onresolve(response);
			}
		}
	}
	pause() {
		this.accecptResponse = false;
	}
	resume() {
		this.accecptResponse = false;
	}
}