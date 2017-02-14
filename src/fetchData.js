export default class getData {
    static FETCH_OPTIONS = {
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };
    static get(location) {
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        return fetch(`${process.env.REACT_APP_SERVER}/api/${location}`, {
            method: 'GET',
            headers
        })
        .then(response => {
            return response.json()
        })
        .then(response => {
            if (response.error) {
                throw new Error(response.error);
            }
            return response;
        });
    }
    static post(location, data ){
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        return fetch(`${process.env.REACT_APP_SERVER}/api/${location}`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data)
        })
        .then(response => {
            return response.json()
        })
        .then(response => {
            if (response.error) {
                throw new Error(response.error);
            }
            return response;
        });
    }
}