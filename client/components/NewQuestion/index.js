import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { postQuestion } from '../../actions/questionActions';

/**
 * New question Component
 */
export class NewQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      body: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this. handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { title, body } = this.state;
    const { history, postQuestion } = this.props;

    const questionInput = { title, body };
    postQuestion(questionInput, history);
  }

  handleCancel() {
    const { history } = this.props;
    const { title, body } = this.state;

    if (title.trim() === '' && body.trim() === '') {
      return history.goBack();
    }

    this.setState({
      title: '',
      body: '',
    }); 
  }

  render() {
    const { title, body } =  this.state;
    const cancelLabel = title.trim() === '' && body.trim() === '' ? 'Back' : 'Clear';
    return (
      <div className="main-content">
        <div className="content-header">
          <h2>New Question</h2>
        </div>

        <form className="new-question-form" onSubmit={this.handleSubmit}>
          <label htmlFor="title">
            <span>Title</span>
            <input 
              id="title"
              name="title"
              placeholder="add title here"
              autoComplete="off"
              required
              value={title}
              onChange={this.handleChange}
            />
          </label>

          <label htmlFor="body">
            <span>Body</span>
            <textarea 
              id="body"
              name="body"
              placeholder="add body here"
              autoComplete="off"
              required
              value={body}
              onChange={this.handleChange}
            />
          </label>

          <div className="save-options">
            <button onClick={this.handleCancel} className="btn-cancel" type="button">{cancelLabel}</button>
            <button className="btn-post" type="submit">Post</button>
          </div>
        </form>
      </div>
    );
  }
}

NewQuestion.propTypes = {
  history: PropTypes.object.isRequired,
  postQuestion: PropTypes.func.isRequired,
};

const mapActionsToProps = {
  postQuestion
};

export default connect(null, mapActionsToProps)(NewQuestion);
