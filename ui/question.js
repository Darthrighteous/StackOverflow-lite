import {
  baseUrl,
  dropDownListenerInit,
  fetchQuestion,
  validateJsonResponse,
  readResponseAsJSON,
} from './utils.js';

const pageUrl = new URL(window.location.href);
const questionId = pageUrl.searchParams.get('id');

// fetch the question
const getUrl = `${baseUrl}/questions/${questionId}?sortAnswers=date`;
fetchQuestion(getUrl);

// answer sort drop down setup
const answerSortUrl = `${baseUrl}/questions/${questionId}?sortAnswers`;
console.log(answerSortUrl);
dropDownListenerInit('answerSortDropdown', answerSortUrl);


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
    .then(() => {
      const userData = JSON.parse(localStorage.getItem('user'));
      userData.answer_count += 1;
      localStorage.setItem('user', JSON.stringify(userData));
      window.location.reload();
    })
    .catch((error) => {
      console.log(error);
    });
};
document.getElementById('post_answer_btn').addEventListener('click', postAnswer);

const postCommentUrl = `${baseUrl}/questions/${questionId}/comments`;
/**
* Posts a comment to the question
* @returns {void}
*/
const postComment = () => {
  const comment = {};
  comment.body = document.getElementById('comment_body').value;

  const init = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: localStorage.jwt,
    },
    body: JSON.stringify(comment),
  };

  fetch(postCommentUrl, init)
    .then(readResponseAsJSON)
    .then(validateJsonResponse)
    .then(() => {
      const userData = JSON.parse(localStorage.getItem('user'));
      userData.comment_count += 1;
      localStorage.setItem('user', JSON.stringify(userData));
      window.location.reload();
    })
    .catch((error) => {
      console.log(error);
    });
};
document.getElementById('post_comment_button').addEventListener('click', postComment);

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
      .then(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        userData.question_count -= 1;
        localStorage.setItem('user', JSON.stringify(userData));
        window.location.replace('../index.html');
      })
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
    case 'accept_button accepted':
    case 'accept_button': {
      /**
      * Toggles the accept icon
      * @returns {void}
      */
      const toggleAcceptIcon = () => {
        if (event.target.classList.contains('accepted')) {
          event.target.classList.remove('accepted');
        } else {
          event.target.classList.add('accepted');
        }
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
          // add to upvoted answers
          const userData = JSON.parse(localStorage.getItem('user'));
          userData.upvoted_answers.push(aId);
          localStorage.setItem('user', JSON.stringify(userData));
        } else if (event.target.classList.contains('activedown')) {
          // remove from downvoted
          const userData = JSON.parse(localStorage.getItem('user'));
          const index = userData.downvoted_answers.indexOf(aId);
          if (index > -1) {
            userData.downvoted_answers.splice(index, 1);
          }
          localStorage.setItem('user', JSON.stringify(userData));
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
          // add to downvoted
          const userData = JSON.parse(localStorage.getItem('user'));
          userData.downvoted_answers.push(aId);
          localStorage.setItem('user', JSON.stringify(userData));
          event.target.classList.add('activedown');
        } else if (event.target.classList.contains('activeup')) {
          // remove from upvoted
          const userData = JSON.parse(localStorage.getItem('user'));
          const index = userData.upvoted_answers.indexOf(aId);
          if (index > -1) {
            userData.upvoted_answers.splice(index, 1);
          }
          localStorage.setItem('user', JSON.stringify(userData));
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
