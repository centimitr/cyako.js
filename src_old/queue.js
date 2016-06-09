export class CyakoQueue {
	constructor() {

	}
    queuedNum(){
    	let num = 0;
    	for (let item of this){
    		if (item.isQueued()) {
    			num++;
    		}
    	}
    	return num;
    };
    sentNum(){
    	let num = 0;
    	for (let item of this){
    		if (item.isSent()) {
    			num++;
    		}
    	}
    	return num;
    };
    getFirstQueued() {
        for (let item of this) {
            if (item.isQueued()) {
                return item;
            }
        }
    };
}