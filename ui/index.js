import {
  baseUrl,
  validateResponseStatus,
  readResponseAsJSON,
  resolveDate,
} from './utils.js';

const getAllUrl = `${baseUrl}/questions`;

/**
* Retrieves array of questions from JSON
* @param {JSON} data - JSON containing the array of questions
* @returns {array} The array of question objects
*/
const getQuestionArray = data => data.questions;

/**
* Creates question HTML elements
* @param {object} question - Question object
* @returns {object} questionDiv - HTML element for a question
*/
const createQuestionHtmlDiv = (question) => {
  const displayDate = resolveDate(question.created_at);
  let questionDiv = `
    <div class="question_summary" onclick="location.href = 'question.html?id=${question.id}'">
      <div class="summary_stats">
        <div class="stat_answers">
          <div class="answer_count">${question.answer_count}</div>
          <h5>answers</h5> 
        </div>
        <div class="stat_score">
          <div class="score">${question.score}</div>
          <h5>score</h5>
        </div>      
      </div>

      <div class="summary_body">
        <h3>${question.title}</h3>
        <div class="summary_details">
          <a href="" id="details_date">${displayDate}</a>
          by
          <a href="" id="details_user">${question.username}</a>          
        </div>
      </div>

      `;

  // TODO: make icons clickable. parent div click trumps atm
  // check if question belongs to logged in user
  if (question.username !== localStorage.user.username) {
    questionDiv += `
      <div class="summary_options">
          <a id="commentIcon" onclick="location.href = 'question.html?id=${question.id}&focus=answer'"></a>
        </div>
    </div>`;
  } else {
    questionDiv += `
      <div class="summary_options">
          <a id="commentIcon" onclick="location.href = 'question.html?id=${question.id}&focus=answer'"></a>
          <a id="deleteIcon" href="#" id="question_delete_btn"></a>
        </div>
    </div>`;
  }

  return questionDiv;
};

/**
* Adds question HTML Div to questions List
* @param {array} questionsArray - Array containing question objects
* @returns {void}
*/
const addQuestionToQuestionList = (questionsArray) => {
  const questionList = document.getElementById('question_list');
  questionsArray.map((question) => {
    console.log(question);
    const questionDiv = createQuestionHtmlDiv(question);
    questionList.innerHTML += questionDiv;
    return 7;
  });
};


/**
* Retrieves all questions from API and populates in question list
* @param {string} url - The url to GET all questions
* @returns {void}
*/
const fetchAllQuestions = (url) => {
  fetch(url)
    .then(validateResponseStatus)
    .then(readResponseAsJSON)
    .then(getQuestionArray)
    .then(addQuestionToQuestionList)
    .catch((error) => {
      console.log(error);
    });
};

fetchAllQuestions(getAllUrl);
