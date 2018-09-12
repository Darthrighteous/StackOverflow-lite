// export const baseUrl = 'https://vast-waters-81120.herokuapp.com/v2';
export const baseUrl = 'http://localhost:4001/v2';

/**
* Checks if response status is between 200-299
* @param {object} res - the response to be checked
* @returns {object} res - the okay response
*/
export const validateResponseStatus = (res) => {
  if (!res.ok) {
    throw Error(res.statusText);
  }
  return res;
};

/**
* Parses the response body as JSON
* @param {promise} response - The response to be parsed
* @returns {promise} The result of parsing the body as JSON
*/
export const readResponseAsJSON = response => response.json();

/**
* Resolves a date string to a user friendly string
* @param {string} dateString - Date to be resolved
* @returns {string} user friendly string to display
*/
export const resolveDate = (dateString) => {
  const dateCreated = new Date(dateString);
  const currentDate = new Date();
  const diffSecs = (currentDate.getTime() - dateCreated.getTime()) / 1000;
  const diffMins = Math.round(diffSecs / 60);
  const diffHours = Math.round(diffSecs / 3600);
  const diffDays = Math.round(diffSecs / 86400);

  if (diffSecs < 60) {
    return `${Math.round(diffSecs)} seconds ago`;
  }
  if (diffMins < 60) {
    return `about ${diffMins} minutes ago`;
  }
  if (diffHours < 24) {
    if (diffHours <= 6) {
      return `about ${diffHours} hours ago`;
    }
    return `today at ${dateCreated.getHours()}:${dateCreated.getMinutes()}`;
  }
  if (diffDays < 3) {
    return `yesterday at ${dateCreated.getHours()}:${dateCreated.getMinutes()}`;
  }
  return `${dateCreated.toDateString()} at ${dateCreated.getHours()}:${dateCreated.getMinutes()}`;
};

/**
* Saves the token returned in the response to local storage
* @param {object} res - object containing the user object with the token
* @returns {void}
*/
const saveToken = (res) => {
  if (window.localStorage) {
    localStorage.removeItem('jwt');
    localStorage.setItem('jwt', res.user.token);
    localStorage.setItem('user', JSON.stringify(res.user));
  } else {
    console.log('no local storage');
  }
};


/**
* Validates a JSON response, throws if errored
* @param {object} res - JSON response object
* @returns {object} JSON user object
*/
export const validateJsonResponse = (res) => {
  alert(`${res.status}: ${res.message}`);
  if (res.status !== 'success') {
    throw Error(res.message);
  }
  console.log(res);
  return res;
};

/**
* Signs Up or Logs In a user and redirects to profile page
* @param {string} url - auth route url
* @param {object} userData - object containing form data
* @returns {void}
*/
export const authenticateUser = (url, userData) => {
  const init = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  };

  fetch(url, init)
    .then(readResponseAsJSON)
    .then(validateJsonResponse)
    .then(saveToken)
    .then(() => {
      window.location.replace('../profile.html');
    })
    .catch((error) => {
      console.log(error);
    });
};
