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
      sort: 'most recent',
    };

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

  render () {
    const { sort } = this.state;
    const { questions, history } = this.props;
    return (
      <div className="main-content">
        <div className="content-header">
          <h2>Questions</h2>
          <ButtonNewQuestion />
        </div>

        <ContentOptions
          onSortClick={this.setSort}
          sort={sort}
        />
        
        {
          (questions.length < 1) ? (<div />)
            : (
              questions.map((question) => (
                <QuestionSummary
                  key={question.id}
                  question={question}
                  history={history}
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