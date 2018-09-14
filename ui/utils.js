// export const baseUrl = 'https://vast-waters-81120.herokuapp.com/v2';
export const baseUrl = 'http://localhost:4001/v2';

/**
* Initializes the dropdown click listener
* @param {string} dropdownId - the id of the dropdown
* @param {string} url -
* @returns {void}
*/
export const dropDownListenerInit = (dropdownId, url) => {
  document.getElementById(dropdownId).addEventListener('click', (e) => {
    // build sort url
    const sortIdArray = ['sort_most_recent', 'sort_most_answered', 'sort_most_rated'];
    const queries = ['date', 'answers', 'score'];
    const titles = ['Most Recent', 'Most Answered', 'Most Rated'];
    const index = sortIdArray.indexOf(e.target.id);
    const sortUrl = `${url}sort=${queries[index]}`;

    // change active dropdown button
    const current = document.getElementsByClassName('active');
    current[0].className = current[0].className.replace(' active', '');
    document.getElementById(e.target.id).className += ' active';
    document.getElementById('index_dropbtn').innerHTML = titles[index];

    // fetch questions with sort url
    fetchAllQuestions(sortUrl);
  });
};

/**
* Checks if response status is between 200-299
* @param {object} res - the response to be checked
* @returns {object} res - the okay response
*/
export const validateResponseStatus = (res) => {
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
export const readResponseAsJSON = response => response.json();

/**
* Resolves a date string to a user friendly string
* @param {string} dateString - Date to be resolved
* @returns {string} user friendly string to display
*/
export const resolveDate = (dateString) => {
  const dateCreated = new Date(dateString);
  const currentDate = new Date();
  const diffSecs = (currentDate.getTime() - dateCreated.getTime()) / 1000;
  const diffMins = Math.round(diffSecs / 60);
  const diffHours = Math.round(diffSecs / 3600);
  const diffDays = Math.round(diffSecs / 86400);

  if (diffSecs < 60) {
    return `${Math.round(diffSecs)} seconds ago`;
  }
  if (diffMins < 60) {
    return `about ${diffMins} minutes ago`;
  }
  if (diffHours < 24) {
    if (diffHours <= 6) {
      return `about ${diffHours} hours ago`;
    }
    return `today at ${dateCreated.getHours()}:${dateCreated.getMinutes()}`;
  }
  if (diffDays < 3) {
    return `yesterday at ${dateCreated.getHours()}:${dateCreated.getMinutes()}`;
  }
  return `${dateCreated.toDateString()} at ${dateCreated.getHours()}:${dateCreated.getMinutes()}`;
};

/**
* Saves the token returned in the response to local storage
* @param {object} res - object containing the user object with the token
* @returns {void}
*/
const saveToken = (res) => {
  if (window.localStorage) {
    localStorage.removeItem('jwt');
    localStorage.setItem('jwt', res.user.token);
    localStorage.setItem('user', JSON.stringify(res.user));
  } else {
    console.log('no local storage');
  }
};


/**
* Validates a JSON response, throws if errored
* @param {object} res - JSON response object
* @returns {object} JSON user object
*/
export const validateJsonResponse = (res) => {
  alert(`${res.status}: ${res.message}`);
  if (res.status !== 'success') {
    throw Error(res.message);
  }
  console.log(res);
  return res;
};

/**
* Signs Up or Logs In a user and redirects to profile page
* @param {string} url - auth route url
* @param {object} userData - object containing form data
* @returns {void}
*/
export const authenticateUser = (url, userData) => {
  const init = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  };

  fetch(url, init)
    .then(readResponseAsJSON)
    .then(validateJsonResponse)
    .then(saveToken)
    .then(() => {
      window.location.replace('../profile.html');
    })
    .catch((error) => {
      console.log(error);
    });
};

/**
* Creates question HTML elements
* @param {object} question - Question object
* @returns {object} questionDiv - HTML element for a question
*/
export const createQuestionHtmlDiv = (question) => {
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
* Retrieves array of questions from JSON
* @param {JSON} data - JSON containing the array of questions
* @returns {array} The array of question objects
*/
const getQuestionArray = data => data.questions;


/**
* Adds question HTML Div to questions List
* @param {array} questionsArray - Array containing question objects
* @returns {void}
*/
const addQuestionToQuestionList = (questionsArray) => {
  const questionList = document.getElementById('question_list');
  if (questionsArray.length > 0) {
    questionList.innerHTML = '';
    questionsArray.map((question) => {
      console.log(question);
      const questionDiv = createQuestionHtmlDiv(question);
      questionList.innerHTML += questionDiv;
      return 7;
    });
  }
};

/**
* Retrieves all questions from API and populates in question list
* @param {string} url - The url to GET all questions
* @returns {void}
*/
export const fetchAllQuestions = (url) => {
  fetch(url)
    .then(validateResponseStatus)
    .then(readResponseAsJSON)
    .then(getQuestionArray)
    .then(addQuestionToQuestionList)
    .catch((error) => {
      console.log(error);
    });
};
