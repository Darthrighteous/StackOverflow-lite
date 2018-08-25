import Post from './post';

/**
 * Represents an answer
 */
export default class Answer extends Post {
/**
 * Add two numbers.
 * @param {string} title of the Answer
 * @param {string} body of the answer.
 * @param {string} date answer was created.
 * @param {string} user who created the answer
 * @param {number} questionId Id of the question the answer belongs to
 * @param {number} id of the answer
 */
  constructor(title, body, date, user, questionId, id) {
    super(body, date, user);
    this.title = title;
    this.id = id;
    this.questionId = questionId;
    this.comments = [];
    this.accept = false;
  }
}
