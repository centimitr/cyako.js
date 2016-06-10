export class CyakoRequest{
	constructor(id, method, params, data){
		this.id = id|| Date.now();
		this.method = method,
		this.params = JSON.stringify(params || {}),
		this.data = JSON.stringify(data || {})
	}
}