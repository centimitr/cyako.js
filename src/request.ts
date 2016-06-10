export class CyakoRequest{
	public id: string;
	public method: string;
	public params: Object;
	public data: Object;
	constructor(method:string, params:Object, data:Object){
		// this.id = id || Date.now().toString();
		// this.params = JSON.stringify(params || {}),
		// this.data = JSON.stringify(data || {})
		this.method = method,
		this.params = params,
		this.data = data
	}
}