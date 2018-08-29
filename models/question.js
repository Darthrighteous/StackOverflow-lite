import Post from './post';

/**
 * Represents a question
 */
export default class Question extends Post {
/**
 * Add two numbers.
 * @param {title} title of the question
 * @param {body} body of the question.
 * @param {date} date the question was created.
 * @param {user} user who created the question
 * @param {id} id of the question
 */
  constructor(title, body, date, user, id) {
    super(body, date, user);
    this.title = title;
    this.id = id;
    this.answers = [];
    this.answerCount = 0;
    this.comments = [];
  }

  /**
   * Adds an answer to this question.
   * @param {answer} answer being added
   * @returns {void}
   */
  addAnswer(answer) {
    this.answerCount += 1;
    this.answers.push(answer);
  }
}
