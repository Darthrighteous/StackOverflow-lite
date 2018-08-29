/**
* Represents a Post
*/
export default class Post {
  /**
   * @param {body} body of the post.
   * @param {date} date the post was created.
   * @param {user} user who created the post.
   */
  constructor(body, date, user) {
    this.body = body;
    this.date = date;
    this.user = user;
    this.score = 0;
  }

  /**
   * Increment the post score by 1.
   * @returns {void}
   */
  plusScore() {
    this.score += 1;
  }

  /**
   * Decrement the post score by 1.
   * @returns {void}
   */
  minusScore() {
    this.score -= 1;
  }
}
