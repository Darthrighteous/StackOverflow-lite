import {
  baseUrl,
  addStringToElement,
  fetchAllQuestions,
  dropDownListenerInit,
} from './utils.js';

const userData = JSON.parse(localStorage.getItem('user'));
if (!userData) {
  window.location.replace('../signin.html');
}

const container = document.getElementById('profile_name_container');
container.innerHTML += `
  <span>${userData.firstname} ${userData.lastname}</span>
  <a href="#">${userData.username}</a>
`;
addStringToElement(userData.question_count, 'question_count');
addStringToElement(userData.answer_count, 'answer_count');
addStringToElement(userData.comment_count, 'comment_count');

const url = `${baseUrl}/questions?sort=date&user=${userData.username}`;
fetchAllQuestions(url);

// user's questions sort dropdown setup
const profileSortUrl = `${baseUrl}/questions?user=${userData.username}&`;
dropDownListenerInit('profileDropdown', profileSortUrl);

/**
* Clears user data and jwt and redirects to homepage
* @returns {void}
*/
const logOut = () => {
  localStorage.removeItem('jwt');
  localStorage.removeItem('user');
  window.location.replace('../index.html');
};

document.getElementById('log_out_btn').addEventListener('click', logOut);
