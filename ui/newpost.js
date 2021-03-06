import {
  baseUrl,
  readResponseAsJSON,
  validateJsonResponse,
} from './utils.js';

// Check if user is signed in
const userData = JSON.parse(localStorage.getItem('user'));
if (!userData) {
  window.location.replace('/pages/signin.html');
}


const postQUrl = `${baseUrl}/questions`;

/**
* increments user question count and Redirects to question page
* @param {object} res - response object containing question id
* @returns {void}
*/
const redirectToQuestionPage = (res) => {
  userData.question_count += 1;
  localStorage.setItem('user', JSON.stringify(userData));
  window.location.replace(`/pages/question.html?id=${res.id}`);
};

const titleText = document.getElementById('question_title');
titleText.focus();
const bodyText = document.getElementById('question_body');

/**
* Post a question
* @returns {void}
*/
const postQuestion = () => {
  const question = {};
  question.title = titleText.value;
  question.body = bodyText.value;

  const init = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: localStorage.jwt,
    },
    body: JSON.stringify(question),
  };

  fetch(postQUrl, init)
    .then(readResponseAsJSON)
    .then(validateJsonResponse)
    .then(redirectToQuestionPage)
    .catch((error) => {
      console.log(error);
    });
};

/**
* Clear text areas and go back
* @returns {void}
*/
const cancelQuestion = () => {
  if (titleText.value.trim() !== '' || bodyText.value.trim() !== '') {
    if (confirm('are you sure you want to cancel your new question')) {
      titleText.value = '';
      bodyText.value = '';
      window.history.back();
    }
  }
  window.history.back();
};

document.getElementById('post_question_btn').addEventListener('click', postQuestion);
document.getElementById('cancel_post_btn').addEventListener('click', cancelQuestion);
