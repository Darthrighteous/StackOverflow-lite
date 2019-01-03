import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ButtonNewQuestion from '../Common/ButtonNewQuestion';
import Post from './Post';
import {
  fetchSingleQuestion,
  postComment,
  postAnswer,
  deletePost,
  modifyPost,
} from '../../actions/questionActions';
import getUserDetails from '../../utils/getUserDetails';
import ContentOptions from '../Common/ContentOptions';

/**
 * Question page component
 */
export class Question extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sort: 'most recent',
      isDropdownOpen: false,
      answerInput: '',
    };

    this.handleCommentPost = this.handleCommentPost.bind(this);
    this.handleAnswerInput = this.handleAnswerInput.bind(this);
    this.handleAnswerPost = this.handleAnswerPost.bind(this);
    this.handleModifyPost = this.handleModifyPost.bind(this);
    this.handleDeletePost = this.handleDeletePost.bind(this);

    this.openDropdown = this.openDropdown.bind(this);
    this.closeDropdown = this.closeDropdown.bind(this);
    this.setSort = this.setSort.bind(this);
  }

  componentDidMount() {
    const { fetchSingle, match } = this.props;
    fetchSingle(match.params.id);
  }


  setSort(sort) {
    this.setState(prevState => {
      if(prevState.sort != sort) {
        return {
          sort
        };
      }
    });
  }

  openDropdown() {
    this.setState({
      isDropdownOpen: true
    }, () => {
      document.addEventListener('click', this.closeDropdown);
    });
  }

  closeDropdown() {
    this.setState({
      isDropdownOpen: false
    }, () => {
      document.removeEventListener('click', this.closeDropdown);
    });
  }

  handleCommentPost(type, id, e) {
    e.preventDefault();
    const { postComment, history } = this.props;
    const commentInput = e.target.querySelector('input').value;
    const body = {
      body: commentInput,
    };
    postComment(type, id, body, history);
  }

  handleAnswerInput(e) {
    this.setState({
      answerInput: e.target.value,
    });
  }

  handleAnswerPost() {
    const { postAnswer, match, history } = this.props;
    const { answerInput } = this.state;
    const body = {
      body: answerInput
    };
    postAnswer(match.params.id, body, history);
  }

  handleDeletePost(resource, answerId) {
    const { deletePost, match, history } = this.props;
    const params = {
      questionId: +match.params.id,
      answerId,
    };

    deletePost(resource, params, history);
  }

  handleModifyPost(type, resourceType, answerId, editInput, undo) {
    const { modifyPost, match, history } = this.props;
    const params = {
      questionId: +match.params.id,
      answerId,
    };
    modifyPost(type, resourceType, params, history, editInput, undo);
  }
  
  render() {
    const { sort, isDropdownOpen, answerInput } = this.state;
    const { question, comments, answers, isLoggedIn } = this.props;
    const username = getUserDetails() ? getUserDetails().username : '';
    const isQuestionOwner = username === question.username ? true : false;
    return (
      <div className="main-content">

        <div className="content-header">
          <h2>{question.title}</h2>
          <ButtonNewQuestion />
        </div>

        <div className="question-answers-container">
          <div className="question-body">
            <Post
              type="questions"
              isQuestionOwner={isQuestionOwner}
              isLoggedIn={isLoggedIn}
              post={question}
              comments={comments}
              onCommentPost={this.handleCommentPost}
              onDeletePost={this.handleDeletePost}
              onModifyPost={this.handleModifyPost}
            />
          </div>

          <ContentOptions
            title="Answers"
            background
            sort={sort}
            dropdownOpenState={isDropdownOpen}
            onDropdownClick={this.openDropdown}
            onSortClick={this.setSort}
          />

          <div className="answers">
            <div className="answers-list">
              {(answers.length < 1) ? (
                <div className="no-resource-message">
                  <span>
                    No answers yet, be the first one to post an answer
                  </span>
                </div>
              ) : (
                answers.map((answer) => {
                  const comments = answer.commentlist[0].id === null
                    ? []
                    : answer.commentlist;
                  return (
                    <Post
                      key={answer.id}
                      type="answers"
                      isQuestionOwner={isQuestionOwner}
                      isLoggedIn={isLoggedIn}
                      post={answer}
                      comments={comments}
                      onCommentPost={this.handleCommentPost}
                      onDeletePost={this.handleDeletePost}
                      onModifyPost={this.handleModifyPost}
                    />);
                })
              )}
            </div>
            {(isLoggedIn) ? (
              <div className="new-answer">
                <h3>Your Answer</h3>
                <textarea className="answer-body" onChange={this.handleAnswerInput} value={answerInput} rows="10" placeholder="Type your answer here..." />
                <button type="button" onClick={this.handleAnswerPost} className="btn-post-answer">
                  Post Answer
                </button>
              </div>
            ) : (
              <div className="no-answers-message">
                <span>
                  Please&nbsp;
                  <Link to="/login">login</Link>
                  &nbsp;or&nbsp;
                  <Link to="/signup">signup</Link>
                  &nbsp;to post an answer.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

Question.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  question: PropTypes.object.isRequired,
  comments: PropTypes.array.isRequired,
  answers: PropTypes.array.isRequired,
  fetchSingle: PropTypes.func.isRequired,
  postComment: PropTypes.func.isRequired,
  postAnswer: PropTypes.func.isRequired,
  modifyPost: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  isLoggedIn: state.global.isLoggedIn,
  question: state.singleQuestion.question,
  comments: state.singleQuestion.comments,
  answers: state.singleQuestion.answers,
});

const mapActionsToProps = {
  fetchSingle: fetchSingleQuestion,
  postComment,
  postAnswer,
  deletePost,
  modifyPost,
};

export default connect(mapStateToProps, mapActionsToProps)(Question);