export class ApiRequestError {
	constructor(response, data) {
		if (!response.ok) {
			this.status = response.status;
			this.statusText = response.statusText;
			this.message = data;
		} else {
			return null;
		}
	}
}