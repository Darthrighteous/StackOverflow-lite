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
