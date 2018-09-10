import {
  baseUrl,
  authenticateUser,
} from './utils.js';

// hide login button
// document.getElementById('loginbutton').style.display = 'none';

const logInUrl = `${baseUrl}/auth/login`;

const form = document.getElementById('login_form');

/**
* addEventListener call back function
* Passes form data to authenticateUser function
* @param {object} event - event object from which function was called
* @returns {void}
*/
const logIn = (event) => {
  event.preventDefault();

  const user = {};
  user.email = form.email.value;
  user.password = form.pwd.value;

  authenticateUser(logInUrl, user);
};

// form submit event listener
form.addEventListener('submit', logIn);
