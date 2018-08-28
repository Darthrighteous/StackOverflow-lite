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
