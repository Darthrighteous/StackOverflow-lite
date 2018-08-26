/**
  * Represents a user.
  */
export default class User {
  /**
  * @param {string} name The name of the user.
  * @param {string} displayName The displayName(username) of the user.
  */
  constructor(name, displayName) {
    this.name = name;
    this.displayName = displayName;
    this.questions = [];
    this.answers = [];
    this.comments = [];
    this.stats = {
      ask: 0,
      answer: 0,
      comment: 0,
    };
  }

  /**
    * @param {Question} question the question being added.
    * @returns {void}
    */
  addQuestion(question) {
    this.questions.push(question);
    this.stats.ask += 1;
  }

  /**
    * @param {Answer} answer The answer being added.
    * @returns {void}
    */
  addAnswer(answer) {
    this.answers.push(answer);
    this.stats.answer += 1;
  }

  /**
    * @param {Comment} comment The comment being added.
    * @returns {void}
    */
  addComment(comment) {
    this.comments.push(comment);
    this.stats.comment += 1;
  }
}
