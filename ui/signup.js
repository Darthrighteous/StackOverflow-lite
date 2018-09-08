import {
  readResponseAsJSON,
  saveToken,
} from './utils.js';

const url = 'https://vast-waters-81120.herokuapp.com/v2/auth/signup';
// const url = 'http://localhost:4001/v2/auth/signup';

const form = document.getElementById('signup_form');

/**
* Validates the JSON response from sign up
* @param {object} jsonresponse - JSON response object
* @returns {object} JSON user object
*/
const validateSignUpJson = (jsonresponse) => {
  alert(jsonresponse.message);
  if (jsonresponse.status !== 'success') {
    throw Error(jsonresponse.message);
  }
  return jsonresponse.user;
};


/**
* Creates a user and redirects to profile page
* @param {object} userData - object containing sign up form data
* @returns {void}
*/
const createUser = (userData) => {
  const signUpInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  };

  fetch(url, signUpInit)
    .then(readResponseAsJSON)
    .then(validateSignUpJson)
    .then(saveToken)
    .then(() => {
      redirect: window.location.replace('../profile.html');
    })
    .catch((error) => {
      console.log(error);
    });
};

/**
* addEventListener call back function
* Passes form data to createUser function
* @param {object} event - event object from which function was called
* @returns {void}
*/
const signUp = (event) => {
  event.preventDefault();

  const user = {};
  user.email = form.email.value;
  user.username = form.username.value;
  user.password = form.pwd.value;

  createUser(user);
};

// form submit event listener
form.addEventListener('submit', signUp);
