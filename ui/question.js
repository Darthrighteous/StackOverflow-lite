import {
  baseUrl,
  validateResponseStatus,
  validateJsonResponse,
  readResponseAsJSON,
  resolveDate,
} from './utils.js';

const pageUrl = new URL(window.location.href);
const questionId = pageUrl.searchParams.get('id');

const getUrl = `${baseUrl}/questions/${questionId}`;

/**
* Retrieves a single from reponse
* @param {object} data - JSON object containing the question object
* @returns {object} The question object
*/
const getQuestion = data => data.question;

/**
* Adds a string to an element
* @param {string} string - the string to be added
* @param {string} elementId - the id of the element
* @returns {void}
*/
const addStringToElement = (string, elementId) => {
  document.getElementById(elementId).innerHTML += string;
};

/**
*
* Creates answer HTML elements
* @param {object} answer - Answer object
* @returns {object} answerDiv - HTML element for an answer
*/
const createAnswerHtmlDiv = (answer) => {
  const displayDate = resolveDate(answer.created_at);
  const answerDiv = `
    <div id="answerPost1" class="post_layout">
      <div class="vote_cell">
        <div class="vote">
          <a class="up_vote"></a>
          <span class="score_count" >${answer.score}</span>
          <a class="down_vote" href="#"></a>
        </div>
      </div>

      <div class="post_cell">
        <div class="post_text">${answer.body}</div>
        <div class="post_author">
          <div class="post_date">
            <span>${displayDate}</span>
          </div>
          by
          <div class="author_details">
            <a href="#">${answer.username}</a>
          </div>
        </div>
      </div>

      <div class="comment_cell">
        <div class="comment_list">
          <ul>
            <li>This is an English only site. Op should please translate<span> - by morpheus 24/03/2003</span></li>
            <li>the balance of power will be restored!<span> - by Kassadin 24/03/2003</span></li>
          </ul>
          
        </div>
        <div class="add_comment">
          <div class="new_comment">
            <textarea maxlength="150" rows="1" placeholder="type comment here"></textarea>
            <button>Add Comment</button>
          </div>
          
        </div>
      </div>
    </div>
  `;
  return answerDiv;
};

/**
* populates HTML elements with question details
* @param {object} question - the question object
* @returns {void}
*/
const populateElements = (question) => {
  console.log(question);
  const displayDate = resolveDate(question.created_at);

  // Question Elements
  addStringToElement(question.score, 'question_score');
  addStringToElement(question.body, 'question_body');
  addStringToElement(question.title, 'question_title');
  addStringToElement(displayDate, 'question_date');
  addStringToElement(question.username, 'question_author');
  if (question.answer_count === 1) {
    addStringToElement(`${question.answer_count} answer`, 'answer_count');
  } else {
    addStringToElement(`${question.answer_count} answer(s)`, 'answer_count');
  }

  // Answer Elements
  const answerList = document.getElementById('answer_list');

  if (question.answers[0].id !== null) {
    question.answers.map((answer) => {
      console.log(answer);
      const answerDiv = createAnswerHtmlDiv(answer);
      answerList.innerHTML += answerDiv;
      return 7;
    });
  } else {
    document.getElementById('answer_sort_dropdown').style.display = 'none';
  }
};

/**
* Retrieves a single questions from API and populates in question list
* @param {string} url - The url to GET all questions
* @returns {void}
*/
const fetchQuestion = (url) => {
  fetch(url)
    .then(validateResponseStatus)
    .then(readResponseAsJSON)
    .then(getQuestion)
    .then(populateElements)
    .catch((error) => {
      console.log(error);
    });
};

// fetch the question
fetchQuestion(getUrl);

/* POST AN ANSWER */
const postAUrl = `${baseUrl}/questions/${questionId}/answers`;

/**
* Posts an answer to the question
* @returns {void}
*/
const postAnswer = () => {
  const answer = {};
  answer.body = document.getElementById('answer_body').value;

  const init = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: localStorage.jwt,
    },
    body: JSON.stringify(answer),
  };

  fetch(postAUrl, init)
    .then(readResponseAsJSON)
    .then(validateJsonResponse)
    .then(window.location.reload())
    .catch((error) => {
      console.log(error);
    });
};


document.getElementById('post_answer_btn').addEventListener('click', postAnswer);

const voteCells = document.getElementsByClassName('vote_cell');
for (let i = 0; i < voteCells.length; i += 1) {
  const upBtns = voteCells[i].getElementsByClassName('up_vote');
  const currentUpButton = upBtns[0];
  currentUpButton.addEventListener('click', () => {
    currentUpButton.classList.toggle('activeup');
  });

  const downBtns = voteCells[i].getElementsByClassName('down_vote');
  const currentDownButton = downBtns[0];
  currentDownButton.addEventListener('click', () => {
    currentDownButton.classList.toggle('activedown');
  });
}
