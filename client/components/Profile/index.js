import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ContentOptions from '../Common/ContentOptions';
import ButtonNewQuestion from '../Common/ButtonNewQuestion';
import { fetchUserQuestions } from '../../actions/questionActions';
import QuestionSummary from '../Common/QuestionSummary';
import { fetchSingleUser } from '../../actions/userActions';

/**
 * Profile page component
 */
export class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sort: 'most recent',
    };

    this.setSort = this.setSort.bind(this);
  }

  componentDidMount() {
    const { fetchUserQuestions, fetchSingleUser, match } = this.props;
    fetchSingleUser(match.params.username);
    fetchUserQuestions(match.params.username);
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

  render() {
    const { sort } = this.state;
    const { userQuestions, profileOwner } = this.props;

    const signedInUser = JSON.parse(localStorage.getItem('user'));
    let isOwnProfile = false;
    if (signedInUser) {
      isOwnProfile = signedInUser.username === profileOwner.username;
    }

    const questionsLabel = isOwnProfile ? 'Your Questions' : `Questions by ${profileOwner.username} `;

    const fullName = `${profileOwner.firstname} ${profileOwner.lastname}`;
    return(
      <div className="main-content">
        {(Object.keys(profileOwner).length > 0) ? (
          <div className="profile-content">
            <div className="profile-primary">
              <ContentOptions
                title={questionsLabel}
                sort={sort}
                onSortClick={this.setSort}
              />
              {(userQuestions.length < 1) ? (
                <div className="no-resource-message">
                  <span>
                    No questions here yet
                  </span>
                </div>
              ) : (
                userQuestions.map((question) => (
                  <QuestionSummary
                    key={question.id}
                    question={question}
                    history={history}
                  />))
                )}
            </div>
            <div className="profile-side">
              <div className="user-details">
                <i className="fas fa-user-circle" />
                <div className="user-name-container">
                  <span id="fullname">{fullName}</span>
                  <span id="username">{profileOwner.username}</span>
                </div>
              </div>

              <div className="btn-new-question-cont">
                <ButtonNewQuestion />
              </div>

              <div className="user-stats">
                <div className="stats-asked">
                  <h5>Asked</h5>
                  <span id="question-count">{profileOwner.question_count}</span>
                </div>
                <div className="stats-answered">
                  <h5>Answered</h5>
                  <span id="answer-count">{profileOwner.answer_count}</span>
                </div>
                <div className="stats-comments">
                  <h5>Comments</h5>
                  <span id="comment-count">{profileOwner.comment_count}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (<div />)}      
      </div>
    );
  }
}

Profile.propTypes = {
  userQuestions: PropTypes.array.isRequired,
  profileOwner: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  fetchSingleUser: PropTypes.func.isRequired,
  fetchUserQuestions: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  profileOwner: state.user,
  userQuestions: state.userQuestions,
});

const mapActionsToProps = {
  fetchSingleUser,
  fetchUserQuestions,
};

export default connect(mapStateToProps, mapActionsToProps)(Profile);
