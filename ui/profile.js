import {
  baseUrl,
  addStringToElement,
  fetchAllQuestions,
  dropDownListenerInit,
  validateResponseStatus,
  readResponseAsJSON,
} from './utils.js';

// get username string
const pageUrl = new URL(window.location.href);
const username = pageUrl.searchParams.get('user');

/**
* Populates the profile elements
* @param {object} user - the user object
* @returns {void}
*/
const populateProfile = (user) => {
  const container = document.getElementById('profile_name_container');
  container.innerHTML += `
    <span>${user.firstname} ${user.lastname}</span>
    <a href="#">${user.username}</a>
  `;
  addStringToElement(user.question_count, 'question_count');
  addStringToElement(user.answer_count, 'answer_count');
  addStringToElement(user.comment_count, 'comment_count');

  const url = `${baseUrl}/questions?sort=date&user=${user.username}`;
  fetchAllQuestions(url);

  // user's questions sort dropdown setup
  const profileSortUrl = `${baseUrl}/questions?user=${user.username}&sort`;
  dropDownListenerInit('profileDropdown', profileSortUrl);
};


const myData = JSON.parse(localStorage.getItem('user'));
if (username) {
  if (myData) {
    // user logged in AND public profile
    document.getElementById('auth_options').style.display = 'none';
  } else {
    // user not logged in AND public profile
    document.getElementById('profileOptions').style.display = 'none';
    document.getElementById('log_out_btn').style.display = 'none';
  }
} else {
  // user logged in AND own profile
  document.getElementById('authIn').style.display = 'none';
  document.getElementById('profileOptions').style.display = 'none';
}

let userData;
if (username) {
  // public profile
  const url = `${baseUrl}/users/${username}`;
  fetch(url)
    .then(validateResponseStatus)
    .then(readResponseAsJSON)
    .then((response) => {
      userData = response.user;
      populateProfile(userData);
    })
    .catch((error) => {
      console.log(error);
    });
} else {
  userData = myData;
  if (!userData) {
    window.location.replace('/pages/signin.html');
  }
  populateProfile(userData);
}

/**
* Clears user data and jwt and redirects to homepage
* @returns {void}
*/
const logOut = () => {
  localStorage.removeItem('jwt');
  localStorage.removeItem('user');
  window.location.replace('/pages/index.html');
};

document.getElementById('log_out_btn').addEventListener('click', logOut);
