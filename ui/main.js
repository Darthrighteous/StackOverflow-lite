const getAllUrl = 'https://vast-waters-81120.herokuapp.com/v2/questions';
const questionList = document.getElementById('question_list');

/**
* Checks if response status is between 200-299
* @param {object} res - the response to be checked
* @returns {object} res - the okay response
*/
const validateResponse = (res) => {
  if (!res.ok) {
    throw Error(res.statusText);
  }
  return res;
};

/**
* Parses the response body as JSON
* @param {promise} response - The response to be parsed
* @returns {promise} The result of parsing the body as JSON
*/
const readResponseAsJSON = response => response.json();

/**
* Retrieves array of questions from JSON
* @param {JSON} data - JSON containing the array of questions
* @returns {array} The array of question objects
*/
const getQuestionArrayfromJSON = data => data.questions;

/**
* Creates question HTML elements
* @param {object} question - Question object
* @returns {object} questionDiv - HTML element for a question
*/
const createQuestionHtmlDiv = (question) => {
  const questionDiv = `
    <div class="question_summary" onclick="location.href = 'question.html';">
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
        <h3>${question.body}</h3>
        <div class="summary_details">
          <a href="" id="details_date">${question.created_at}</a>
          by
          <a href="" id="details_user"> darthrighteous</a>          
        </div>
      </div>

      <div class="summary_options">
        <a id="commentIcon" href="#"></a>
        <a id="deleteIcon" href="#"></a>
      </div>
  </div>`;

  return questionDiv;
};

/**
* Adds question HTML Div to questions List
* @param {array} questionsArray - Array containing question objects
* @returns {void}
*/
const addQuestionToQuestionList = (questionsArray) => {
  questionsArray.map((question) => {
    console.log(question);
    const questionDiv = createQuestionHtmlDiv(question);
    questionList.innerHTML += questionDiv;
    return null;
  });
};


/**
* Retrieves all questions from API and populates in question list
* @param {string} url - The url to GET all questions
* @returns {void}
*/
const fetchAllQuestions = (url) => {
  fetch(url)
    .then(validateResponse)
    .then(readResponseAsJSON)
    .then(getQuestionArrayfromJSON)
    .then(addQuestionToQuestionList)
    .catch((error) => {
      console.log(error);
    });
};

fetchAllQuestions(getAllUrl);
