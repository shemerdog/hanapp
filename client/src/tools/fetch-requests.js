export const callApi = async (url) => {
	const response = await fetch( url );
	const body = await response.json();
	if ( response.status !== 200) throw Error( body.message );
	return body;
};

export const postRequest = function(url, data) {
	fetch(url, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data)
	})
};