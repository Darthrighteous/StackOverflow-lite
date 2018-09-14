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
          <a class="up_vote" id="up_votex${answer.id}"></a>
          <span class="score_count" id="score_countx${answer.id}" >${answer.score}</span>
          <a class="down_vote" id="down_votex${answer.id}"></a>
        </div>
      </div>

      <div class="post_cell">
        <div class="post_text">${answer.body}</div>
        <div class="post_details">
          <div class="post_options" id="post_optionsx${answer.id}">
            <a href="#" class="edit_button" id="edit_buttonx${answer.id}">edit</a>
            <a href="#" class="delete_button" id="delete_buttonx${answer.id}">delete</a>
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
        <a class="${acceptButtonClass}" id="accept_buttonx${answer.id}"></a>
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
  if (question.answers[0].id !== null) {
    const answerArray = question.answers;
    answerArray.forEach((answer) => {
      if (answer.username !== username) {
        document.getElementById(`post_optionsx${answer.id}`).style.visibility = 'hidden';
      }
    });
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


/**
 * Call back from click event to patch an answer
 * @param {object} event - object that propagated click
 * @returns {void}
*/
const patchAnswer = (event) => {
  const { id } = event.target;
  const [, aId] = id.split('x');
  const patchUrl = `${baseUrl}/questions/${questionId}/answers/${aId}`;
  const patchBody = {};

  const init = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: localStorage.jwt,
    },
  };

  switch (event.target.className) {
    case 'accept_button': {
      /**
      * Toggles the accept icon
      * @returns {void}
      */
      const toggleAcceptIcon = () => {
        event.target.style.backgroundImage = "url('icons/accept_checked.png')";
      };

      console.log('accept click');
      patchBody.type = 'accept';
      init.body = JSON.stringify(patchBody);

      fetch(patchUrl, init)
        .then(readResponseAsJSON)
        .then(validateJsonResponse)
        .then(toggleAcceptIcon)
        .catch((error) => {
          console.log(error);
        });
      break;
    }

    case 'edit_button':
      console.log('edit click');
      patchBody.type = 'edit';
      patchBody.body = prompt("Edit your answer:", answerBodyArray[aId]);
      init.body = JSON.stringify(patchBody);

      fetch(patchUrl, init)
        .then(readResponseAsJSON)
        .then(validateJsonResponse)
        .then(location.reload())
        .catch((error) => {
          console.log(error);
        });
      break;

    case 'down_vote activedown':
    case 'up_vote': {
      /**
      * Toggles an upvote icon to active or an active downvote icon to inactive
      * @returns {void}
      */
      const toggleUpvoteIcon = () => {
        if (event.target.className === 'up_vote') {
          event.target.classList.add('activeup');
        } else if (event.target.classList.contains('activedown')) {
          console.log('active down clickk');
          event.target.classList.remove('activedown');
        }
      };
      /**
       * Increments the score count
       * @returns {void}
       */
      const incrementScore = () => {
        const score = document.getElementById(`score_countx${aId}`);
        score.innerHTML = parseInt(score.innerHTML, 10) + 1;
      };

      console.log('upvote click');
      patchBody.type = 'upvote';
      init.body = JSON.stringify(patchBody);

      fetch(patchUrl, init)
        .then(readResponseAsJSON)
        .then(validateJsonResponse)
        .then(toggleUpvoteIcon)
        .then(incrementScore)
        .catch((error) => {
          console.log(error);
        });
      break;
    }

    case 'up_vote activeup':
    case 'down_vote': {
      /**
      * Toggles a downvote icon to active or an active upvote icon to inactive
      * @returns {void}
      */
      const toggleDownvoteIcon = () => {
        if (event.target.className === 'down_vote') {
          event.target.classList.add('activedown');
        } else if (event.target.classList.contains('activeup')) {
          event.target.classList.remove('activeup');
        }
      };
      /**
       * Decrements the score count
       * @returns {void}
       */
      const decrementScore = () => {
        const score = document.getElementById(`score_countx${aId}`);
        score.innerHTML = parseInt(score.innerHTML, 10) - 1;
      };

      patchBody.type = 'downvote';
      init.body = JSON.stringify(patchBody);

      fetch(patchUrl, init)
        .then(readResponseAsJSON)
        .then(validateJsonResponse)
        .then(toggleDownvoteIcon)
        .then(decrementScore)
        .catch((error) => {
          console.log(error);
        });
      break;
    }
    default:
      console.log('cheeeeeeee');
  }
};

document.addEventListener('click', patchAnswer);

/* SET FOCUS TO ANSWER */
if (pageUrl.searchParams.get('focus') === 'answer') {
  setTimeout(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, 500);
  document.getElementById('answer_body').focus();
}
