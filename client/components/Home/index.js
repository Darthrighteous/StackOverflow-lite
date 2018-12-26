import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import QuestionSummary from '../Common/QuestionSummary';
import ButtonNewQuestion from '../Common/ButtonNewQuestion';
import { fetchQuestions } from '../../actions/questionActions';

/**
 * Homepage content component
 */
export class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDropdownOpen: false,
      sort: 'most recent',
    };

    this.openDropdown = this.openDropdown.bind(this);
    this.closeDropdown = this.closeDropdown.bind(this);
    this.sortMostRecent = this.setSort.bind(this, 'most recent');
    this.sortMostAnswered = this.setSort.bind(this, 'most answered');
    this.sortMostRated = this.setSort.bind(this, 'most rated');
  }

  componentDidMount() {
    const { fetchQuestions } = this.props;
    fetchQuestions();
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


  render () {
    const { sort, isDropdownOpen } = this.state;
    const { questions, history } = this.props;
    return (
      <div className="main-content">
        <div className="content-header">
          <h2>Questions</h2>
          <ButtonNewQuestion />
        </div>
    
        <div className="content-options">
          <div role="button" tabIndex="0" onKeyDown={null} className="dropdown" onClick={this.openDropdown}>
            <span className="dropdown-title">Sort</span>
            <div className="dropdown-container">
              <button type="button" className="drop-btn">{sort}</button>
              <svg className="drop-icon" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <g>
                  <path fill="inherit" d="M14.1711599,9.3535 L9.99925636,13.529 L5.82735283,9.3535 C5.51262415,9.0385 5.73543207,8.5 6.18054835,8.5 L13.8179644,8.5 C14.2630807,8.5 14.4858886,9.0385 14.1711599,9.3535" />
                </g>
              </svg>
            </div>

            {(isDropdownOpen) ? (
              <div className="dropdown-content">
                <button
                  type="button"
                  className="dropdown-item active"
                  onClick={this.sortMostRecent}
                >
                  Most Recent
                </button>

                <button
                  type="button"
                  className="dropdown-item"
                  onClick={this.sortMostAnswered}
                >
                  Most Answered
                </button>

                <button
                  type="button"
                  className="dropdown-item"
                  onClick={this.sortMostRated}
                >
                  Most Rated
                </button>
              </div>
            ) : (
              <div />
            )}
          </div>
        </div>
        {
          (questions.length < 1) ? (<div />)
            : (
              questions.map((question) => (
                <QuestionSummary
                  key={question.id}
                  question={question}
                  history={history}
                  isOwner
                />))
              )
          }
      </div>
    );
  }
}

Home.propTypes = {
  fetchQuestions: PropTypes.func.isRequired,
  questions:  PropTypes.array.isRequired,
  history: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  loginStatus: state.global.isLoggedIn,
  questions: state.questions
});

const mapActionsToProps = {
  fetchQuestions
};

export default connect(mapStateToProps, mapActionsToProps)(Home);