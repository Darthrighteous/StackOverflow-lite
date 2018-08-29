import Answer from '../models/answer';
import Question from '../models/question';

const q1 = {
  title: 'Dummy Question',
  body: 'How do you divide a prime number by itself?',
  date: '20/03/2003',
  user: 'tyronne',
};

const q2 = {
  title: 'What is life?',
  body: 'Life is the process of living',
  date: '14/08/2018',
  user: 'darthrighteous',
};

const q3 = {
  title: 'What is sort query?',
  body: 'This question has a high score',
  date: '14/08/2018',
  user: 'darthrighteous',
};

let questionIdCounter = 0;
let answerIdCounter = 0;

/**
  * Gets the index of a post from a post list by its id.
  * @param {number} id Id of the post required
  * @param {array} list Array of posts.
  * @returns{number} the index of the post, or -1 if not found.
  */
export const getIndexById = (id, list) => list
  .findIndex(item => item.id === Number(id));

/**
  * Creats a question
  * @param {object} requestBody Object containing details about the question.
  * @returns {Question} the created question.
  */
export const createQuestion = (requestBody) => {
  questionIdCounter += 1;
  const question = new Question(requestBody.title,
    requestBody.body,
    requestBody.date,
    requestBody.user,
    questionIdCounter);
  return question;
};

/**
  * Creates an Answer
  * @param {number} questionId The id of the question the answer belongs to.
  * @param {object} requestBody Object containing details about the answer.
  * @returns {Answer} the created answer
  */
export const createAnswer = (questionId, requestBody) => {
  answerIdCounter += 1;
  return new Answer(requestBody.title,
    requestBody.body,
    requestBody.date,
    requestBody.user,
    questionId,
    answerIdCounter);
};

/**
  * Sorts an array of posts.
  * @param {string} sortType query to be sorted by.
  * @param {array} arr array to be sorted.
  * @returns {array} the sorted array
  */
export const sortPosts = (sortType, arr) => {
  const sorted = arr;
  switch (sortType) {
    case 'score':
      sorted.sort((a, b) => b.score - a.score);
      break;
    case 'answers':
      sorted.sort((a, b) => b.answerCount - a.answerCount);
      break;
    case 'date':
    default:
  }
  return sorted;
};

/**
  * seed random posts into a postList.
  * @param {string} postType post type to be seeded.
  * @param {array} arr post list to be seeded into.
  * @returns {void} no return
  */
export const seedPosts = (postType, arr) => {
  let highScoreQuestion;
  switch (postType) {
    case 'question':
      arr.push(createQuestion(q1));
      arr.push(createQuestion(q2));
      arr.push(createQuestion(q1));
      arr.push(createQuestion(q2));
      arr.push(createQuestion(q1));
      highScoreQuestion = createQuestion(q3);
      highScoreQuestion.score = 10;
      arr.push(highScoreQuestion);
      break;
      // case 'answer' :

      // break;
      // case 'comment':

      // break;
    default:
      console.log(`Invalid post type: ${postType}`);
  }
};

/**
  * updates a post.
  * @param {Post} post the post to be updated.
  * @param {object} requestBody object containing update attribute
  * @returns {Post} the updated post or 0 for failure
  */
export const updatePost = (post, requestBody) => {
  switch (requestBody.attribute) {
    case 'score':
      if (requestBody.value === 'increment') {
        post.plusScore();
      } else if (requestBody.value === 'decrement') {
        post.minusScore();
      } else {
        return 0;
      }
      break;
      /* eslint-disable no-param-reassign */
    case 'title':
      post.title = requestBody.value;
      break;
    case 'body':
      post.body = requestBody.value;
      break;
      /* eslint-disable no-param-reassign */
    default:
      return 0;
  }
  return post;
};
