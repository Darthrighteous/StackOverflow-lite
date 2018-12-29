import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import QuestionSummary from '../Common/QuestionSummary';
import ButtonNewQuestion from '../Common/ButtonNewQuestion';
import { fetchQuestions } from '../../actions/questionActions';
import ContentOptions from '../Common/ContentOptions';

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
    this.setSort = this.setSort.bind(this);
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

        <ContentOptions
          sort={sort}
          dropdownOpenState={isDropdownOpen}
          onDropdownClick={this.openDropdown}
          onSortClick={this.setSort}
        />
        
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
  questions: state.questions
});

const mapActionsToProps = {
  fetchQuestions
};

export default connect(mapStateToProps, mapActionsToProps)(Home);