import {
  baseUrl,
  authenticateUser,
} from './utils.js';

const signUpUrl = `${baseUrl}/auth/signup`;

const form = document.getElementById('signup_form');

/**
* addEventListener call back function
* Passes form data to authenticateUser function
* @param {object} event - event object from which function was called
* @returns {void}
*/
const signUp = (event) => {
  event.preventDefault();

  const user = {};
  user.firstname = form.firstname.value;
  user.lastname = form.lastname.value;
  user.email = form.email.value;
  user.username = form.username.value;
  user.password = form.pwd.value;

  authenticateUser(signUpUrl, user);
};

// form submit event listener
form.addEventListener('submit', signUp);
