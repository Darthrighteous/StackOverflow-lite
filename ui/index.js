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
      </div>`;

  // TODO: make icons clickable. parent div click trumps atm
  // check if question belongs to logged in user
  const author = `
      <div class="summary_options">
        <a id="commentIcon" onclick="event.stopPropagation(); location.href = 'question.html?id=${question.id}&focus=answer'"></a>
        <a id="deleteIcon" href="#" id="question_delete_btn"></a>
      </div>
    </div>`;
  const nonAuthor = `
      <div class="summary_options">
        <a id="commentIcon" onclick="event.stopPropagation(); location.href = 'question.html?id=${question.id}&focus=answer'"></a>
      </div>
    </div>`;

  let username;
  if (localStorage.user) {
    ({ username } = JSON.parse(localStorage.user));
  }
  if (question.username === username) {
    questionDiv += author;
  } else {
    questionDiv += nonAuthor;
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

document.getElementById('sortDropdown').addEventListener('click', (e) => {
  // build sort url
  const sortIdArray = ['sort_most_recent', 'sort_most_answered', 'sort_most_rated'];
  const queries = ['date', 'answers', 'score'];
  const titles = ['Most Recent', 'Most Answered', 'Most Rated'];
  const index = sortIdArray.indexOf(e.target.id);
  const sortUrl = `${baseUrl}/questions?sort=${queries[index]}`;

  // change active dropdown button
  const current = document.getElementsByClassName('active');
  current[0].className = current[0].className.replace(' active', '');
  document.getElementById(e.target.id).className += ' active';
  document.getElementById('index_dropbtn').innerHTML = titles[index];

  // clear question list, fetch questions with sort url
  document.getElementById('question_list').innerHTML = '';
  fetchAllQuestions(sortUrl);
});
