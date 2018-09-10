import {
  baseUrl,
  readResponseAsJSON,
  validateJsonResponse,
} from './utils.js';

// Check if user is signed in
const userData = JSON.parse(localStorage.getItem('user'));
if (!userData) {
  window.location.replace('../signin.html');
}


const postQUrl = `${baseUrl}/questions`;

/**
* Redirects to question page
* @param {object} res - response object containing question id
* @returns {void}
*/
const redirectToQuestionPage = (res) => {
  window.location.replace(`../question.html?id=${res.id}`);
};

const titleText = document.getElementById('question_title');
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
  titleText.value = '';
  bodyText.value = '';
  window.history.back();
};

document.getElementById('post_question_btn').addEventListener('click', postQuestion);
document.getElementById('cancel_post_btn').addEventListener('click', cancelQuestion);
