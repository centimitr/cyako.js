import {CyakoRequest} from './request';
import {CyakoResponse} from './response';

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