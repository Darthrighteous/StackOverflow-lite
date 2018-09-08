import {
  authenticateUser,
} from './utils.js';

// hide signup button
// document.getElementById('signupbutton').style.display = 'none';

const signUpUrl = 'https://vast-waters-81120.herokuapp.com/v2/auth/signup';
// const signUpUrl = 'http://localhost:4001/v2/auth/signup';

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
