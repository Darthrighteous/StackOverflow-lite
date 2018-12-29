import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';
import getUserDetails from '../../utils/getUserDetails';

/**
 * Post component
 */
class Post extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAddingComment: false
    };

    this.toggleCommentInput = this.toggleCommentInput.bind(this);
    this.handleUpvoteClick = this.handleUpvoteClick.bind(this);
    this.handleDownvoteClick = this.handleDownvoteClick.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
  }

  toggleCommentInput() {
    this.setState(prevState => ({
      isAddingComment: !prevState.isAddingComment,
    }));
  }

  handleUpvoteClick(e) {
    const { type, onModifyPost, post } = this.props;
    const undo = e.target.classList.contains('active');
    const answerId = type === 'answers' ? post.id : null;
    onModifyPost('upvote', type, answerId, null, undo);
  }

  handleDownvoteClick(e) {
    const { type, onModifyPost, post } = this.props;
    const undo = e.target.classList.contains('active');
    const answerId = type === 'answers' ? post.id : null;
    onModifyPost('downvote', type, answerId, null, undo);
  }

  handleDeleteClick() {
    const { type, onDeletePost, post } = this.props;
    const answerId = type === 'answers' ? post.id : null;
    onDeletePost(type, answerId);
  }

  render() {
    const {
      type,
      isQuestionOwner,
      isLoggedIn,
      post,
      comments,
      onCommentPost,
      onModifyPost,
    } = this.props;
    const { isAddingComment } = this.state;
    const user = getUserDetails();
    const username = user ? user.username : '';
    const isOwner = username === post.username ? true : false;

    let isUpvoted = false, isDownvoted = false;
    if (user) {
      isUpvoted = type === 'answers' ?
        user.upvoted_answers.indexOf(post.id) > -1
        : user.upvoted_questions.indexOf(post.id) > -1;

      isDownvoted = type === 'answers' ?
        user.downvoted_answers.indexOf(post.id) > -1
        : user.downvoted_questions.indexOf(post.id) > -1;
    }

    return (
      <div className="post-grid">
        <div className="vote-cell">
          <button
            type="button"
            className="btn-action btn-upvote"
            onClick={isUpvoted ?
              this.handleDownvoteClick : this.handleUpvoteClick}
          >
            {(isUpvoted) ? (
              <i className="fas fa-chevron-circle-up active" />
            ) : (
              <i className="fas fa-chevron-circle-up" />
            )}
          </button>

          <span className="score-count">
            {post.score}
          </span>

          <button
            type="button"
            className="btn-action btn-downvote"
            onClick={isDownvoted ?
              this.handleUpvoteClick : this.handleDownvoteClick}
          >
            {(isDownvoted) ? (
              <i className="fas fa-chevron-circle-down active" />
            ) : (
              <i className="fas fa-chevron-circle-down" />
            )}
          </button>
        </div>
  
        <div className="post-cell">
          <div className="post-body">
            {post.body}
          </div>
          <div className="post-details">
            {(isOwner) ? (
              <div className="post-options">
                <button type="button">edit</button>
                <button
                  type="button"
                  className="btn-delete"
                  onClick={this.handleDeleteClick}
                >
                  delete
                </button>
              </div>
            ) : (<div />)}
            
            <div className="post-author-details">
              <span>{moment(post.created_at).fromNow()}</span>
              by
              <Link to={`/users/${post.username}`}>{post.username}</Link>
            </div>
          </div>
        </div>
  
        <div className="accept-cell">
          {(type === 'answers' && isQuestionOwner || post.accepted) ? (
            <button
              type="button"
              className="btn-action btn-accept"
              onClick={onModifyPost.bind(this, 'accept', type, post.id, null, null)}
            >
              {(post.accepted) ? (
                <i className="fas fa-check active" />
              ) : (
                <i className="fas fa-check" />
              )}
            </button>
          ) : (
            <div />
          )}
        </div>
  
        <div className="comment-cell">
          {(comments.length < 1) ? <div />
            : (
              <ul className="comment-list">
                {comments.map(comment => (
                  <li className="comment-item" key={comment.id}>
                    {comment.body}
                    <span>
                      &nbsp;— by&nbsp;
                      <Link to={`/users/${comment.username}`}>{comment.username}</Link>
                      &nbsp;
                      {moment(comment.created_at).fromNow()}
                    </span>
                  </li>
                ))
                }
              </ul>
              )
            }
         
          <div className="add-comment">
            {(!isLoggedIn) ? (
              <Link to="/signup">Sign up to add a comment</Link>
            ) : (!isAddingComment) ? (
              <button className="btn-new-comment" onClick={this.toggleCommentInput} type="button">add a comment..</button>
            ) : (
              <form className="new-comment-input" onSubmit={onCommentPost.bind(this, type, post.id)}>
                <input type="text" name="comment" placeholder="enter comment here.." />
                <button type="button" className="btn-cancel" onClick={this.toggleCommentInput}>cancel</button>
                <button type="submit" className="btn-post">post</button>
              </form>
            )}
          </div>
        </div>
      </div>
  
    );
  } 
}

Post.propTypes = {
  type: PropTypes.string.isRequired,
  isQuestionOwner: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  post: PropTypes.object.isRequired,
  comments: PropTypes.array.isRequired,
  onCommentPost: PropTypes.func.isRequired,
  onModifyPost: PropTypes.func.isRequired,
  onDeletePost: PropTypes.func.isRequired,
};

export default Post;
