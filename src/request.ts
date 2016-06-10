export class CyakoRequest{
	public id: string;
	public method: string;
	public params: Object;
	public data: Object;
	constructor(method:string, params:Object, data:Object){
		this.method = method,
		this.params = params,
		this.data = data
	}
	setId(id:string){
		this.id = id;
	}
}