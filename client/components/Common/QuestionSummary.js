import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';
import getUserDetails from '../../utils/getUserDetails';

/**
 * Question summary component
 */
class QuestionSummary extends Component {
  constructor(props) {
    super(props);
    const questionPath = `/question/${props.question.id}`;
    this.navigateToQuestion = this.navigateToQuestion.bind(this, questionPath);
  }

  stopPropagation(e) {
    e.stopPropagation();
  }
  
  navigateToQuestion(path) {
    const { history } = this.props;
    history.push(path);
  }

  render() {
    const { question } = this.props;
    const { answer_count, score, title, username, id, created_at } = question;

    let isOwner = false;
    const loggedInUser = getUserDetails();
    if(loggedInUser) {
      isOwner = loggedInUser.username === question.username;
    }
    const questionPath = `/question/${id}`;
    return (
      <div className="question-summary" role="button" tabIndex="0" onKeyDown={null} onClick={this.navigateToQuestion}>
        <div className="question-stats">
          <div className="stat-answers">
            <span>{answer_count}</span>
            <h5>answers</h5>
          </div>
          <div className="stat-score">
            <span>{score}</span>
            <h5>score</h5>
          </div>
        </div>

        <div className="summary-body">
          <h3>{title}</h3>
          <div className="summary-details">
            <Link
              to={questionPath}
              onClick={this.stopPropagation}
              className="details-date"
            >
              {moment(created_at).fromNow()}
            </Link>
            by
            <Link
              to={`/profile/${username}`}
              onClick={this.stopPropagation}
              className="details-user"
            >
              {username}
            </Link>          
          </div>
        </div>

        <div className="summary-options">
          <Link to={`${questionPath}?focus=answer`} onClick={this.stopPropagation} id="comment-icon">
            <i className="fas fa-comment-alt" />
          </Link>
          {(isOwner) ? (
            <Link to={questionPath} onClick={this.stopPropagation} id="delete-icon">
              <i className="fas fa-trash" />
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    );
  }
}

QuestionSummary.propTypes = {
  question: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default QuestionSummary;