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
    return fetch(`${process.env.REACT_APP_SERVER}/api/${location}`, Object.assign({}, this.FETCH_OPTIONS, {
        method: 'GET'
      }))
      .then(response => response.json())
      .then(response => {
        if (response.error) {
          throw new Error(response.error);
        }
        return response;
      })
      .catch(e => {
        throw e;
      });
  }
  static post(location, data) {
    const options = Object.assign({}, this.FETCH_OPTIONS, {
        method: 'POST',
        body: JSON.stringify(data)
      });
      console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", options);
    return fetch(`${process.env.REACT_APP_SERVER}/api/${location}`, Object.assign({}, this.FETCH_OPTIONS, {
        method: 'POST',
        body: JSON.stringify(data)
      }))
      .then(response => response.json())
      .then(response => {
        if (response.error) {
          throw new Error(response.error);
        }
        return response;
      })
      .catch(e => {
        throw e;
      });
  }
}
