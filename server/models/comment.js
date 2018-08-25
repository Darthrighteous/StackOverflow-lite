import Post from './post';

/**
 * Represents a comment
 */
export default class Comment extends Post {
  /**
  * @param {string} body of the question.
  * @param {string} date the question was created.
  * @param {string} user who created the question.
  * @param {string} parentType type of the parent.
  * @param {number} parentId id of the parent.
  */
  constructor(body, date, user, parentType, parentId) {
    super(body, date, user);
    this.parentType = parentType;
    this.parentId = parentId;
  }
}
