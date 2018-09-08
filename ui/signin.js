import {
  authenticateUser,
} from './utils.js';

// hide login button
// document.getElementById('loginbutton').style.display = 'none';

const logInUrl = 'https://vast-waters-81120.herokuapp.com/v2/auth/login';
// const logInUrl = 'http://localhost:4001/v2/auth/login';

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
