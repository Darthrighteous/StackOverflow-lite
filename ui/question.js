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
  let acceptButtonClass;
  if (answer.accepted === true) {
    acceptButtonClass = 'accept_button_checked';
  } else {
    acceptButtonClass = 'accept_button';
  }

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
        <div class="post_details">
          <div class="post_options" id="post_options${answer.id}">
            <a href="#" class="edit_button" id="edit_button${answer.id}">edit</a>
            <a href="#" class="delete_button" id="delete_button${answer.id}">delete</a>
          </div>
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
      </div>

      <div class="accept_cell">
        <a class="${acceptButtonClass}" id="accept_button${answer.id}"></a>
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

const answerBodyArray = [];
/* FETCH THE QUESTION AND ANSWERS POPULATE ELEMENTS */
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
      answerBodyArray[answer.id] = answer.body;
      console.log(answer);
      const answerDiv = createAnswerHtmlDiv(answer);
      answerList.innerHTML += answerDiv;
      return 7;
    });
  } else {
    document.getElementById('answer_sort_dropdown').style.display = 'none';
  }
  return question;
};

/**
* Hide elements of options meant for author
* @param {object} question - The question object
* @returns {void}
*/
const hideAuthorElements = (question) => {
  let username;
  if (localStorage.user) {
    ({ username } = JSON.parse(localStorage.user));
  }
  // check if question doesnt belongs to user
  if (question.username !== username) {
    console.log('not my question');
    document.getElementById('question_user_options').style.visibility = 'hidden';
    Array.from(document.getElementsByClassName('accept_button')).forEach((button) => {
      button.style.visibility = 'hidden';
    });
  }
  // answer author options
  const answerArray = question.answers;
  answerArray.forEach((answer) => {
    if (answer.username !== username) {
      document.getElementById(`post_options${answer.id}`).style.visibility = 'hidden';
    }
  });
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
    .then(hideAuthorElements)
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


/* DELETE A QUESTION */
/**
* Deletes a question
* @returns {void}
*/
const deleteQuestion = () => {
  const deleteUrl = `${baseUrl}/questions/${questionId}`;
  if (confirm('Are you sure you want to delete this question?')) {
    const init = {
      method: 'DELETE',
      headers: {
        Authorization: localStorage.jwt,
      },
    };

    fetch(deleteUrl, init)
      .then(readResponseAsJSON)
      .then(validateJsonResponse)
      .then(window.location.replace('../index.html'))
      .catch((error) => {
        console.log(error);
      });
  }
};

document.getElementById('question_delete_btn').addEventListener('click', deleteQuestion);

/* TODO: ACCEPT BUTTON CONFIG */
/**
* Call back from click event to accept answer
* @param {object} event - object that propagated click
* @returns {void}
*/
const acceptAnswer = (event) => {
  if (event.target.className === 'accept_button') {
    const { id } = event.target;
    const [, aId] = id.split('n');
    const acceptUrl = `${baseUrl}/questions/${questionId}/answers/${aId}`;

    const init = {
      method: 'PATCH',
      headers: {
        Authorization: localStorage.jwt,
      },
    };

    /**
    * Toggles the accept icon
    * @returns {void}
    */
    const toggleIcon = () => {
      event.target.style.backgroundImage = "url('icons/accept_checked.png')";
    };

    fetch(acceptUrl, init)
      .then(readResponseAsJSON)
      .then(validateJsonResponse)
      .then(toggleIcon)
      .catch((error) => {
        console.log(error);
      });

    console.log('accept click');
  }
};

/**
* Call back from click event to edit an answer
* @param {object} event - object that propagated click
* @returns {void}
*/
const editAnswer = (event) => {
  if (event.target.className === 'edit_button') {
    const { id } = event.target;
    const [, aId] = id.split('n');
    const editUrl = `${baseUrl}/questions/${questionId}/answers/${aId}`;
    const editBody = {};
    editBody.body = prompt("Edit your answer:", answerBodyArray[aId]);

    const init = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.jwt,
      },
      body: JSON.stringify(editBody),
    };

    fetch(editUrl, init)
      .then(readResponseAsJSON)
      .then(validateJsonResponse)
      .then(location.reload())
      .catch((error) => {
        console.log(error);
      });
  }
};
document.addEventListener('click', acceptAnswer);
document.addEventListener('click', editAnswer);

/* TODO: VOTE BUTTONS CONFIG */
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

/* SET FOCUS TO ANSWER */
if (pageUrl.searchParams.get('focus') === 'answer') {
  // TODO: get page to scroll
  document.getElementById('answer_body').focus();
}
