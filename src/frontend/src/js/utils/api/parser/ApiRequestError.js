export class ApiRequestError {
	constructor(response, error) {
		this.status = error.status ?? null;
		this.statusText = null;
		this.message = error.message ?? null;
		
		// if (!response.ok) {
		// 	this.status = response.status;
		// 	this.statusText = response.statusText;
		// 	this.message = data;
		// } else {
		// 	return null;
		// }
	}
}