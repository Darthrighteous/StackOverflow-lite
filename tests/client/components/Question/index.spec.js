import React from 'react';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';

import ConnectedQuestion, { Question } from '../../../../client/components/Question';
import { mockSingleQuestionResponse } from '../../../support/mockData';

/**
 * setup for test
 * @returns {object} containing props and enzyme wrappers
 */
function setup() {
  const props = {
    isLoggedIn: true,
    match: {
      params: { id: 1 }
    },
    history: {},
    question: mockSingleQuestionResponse.question,
    comments: [],
    answers: [],
    fetchSingle: jest.fn(),
    postComment: jest.fn(),
    postAnswer: jest.fn(),
    modifyPost: jest.fn(),
    deletePost: jest.fn(),
  };
  const loggedOutProps = {
    ...props, isLoggedIn: false,
  };
  const withAnswersProps = {
    ...props, answers: mockSingleQuestionResponse.answers,
  };

  const mockStore = configureMockStore([]);
  const store = mockStore({
    global: {
      isLoggedIn: true
    },
    questions: [],
    singleQuestion: {
      question: {},
      comments: [],
      answers: [],
    },
  });

  localStorage.setItem('user', JSON.stringify({username: 'Darthrighteous'}));
  const questionWrapper = shallow(<Question {...props} />);
  localStorage.clear();
  const loggedOutWrapper =shallow(<Question {...loggedOutProps} />);
  const withAnswersWrapper =shallow(<Question {...withAnswersProps} />);
  const connectedQuestion = shallow(
    <ConnectedQuestion {...props} store={store} />
  );

  return {
    questionWrapper,
    loggedOutWrapper,
    withAnswersWrapper,
    connectedQuestion,
  };
}

describe('Question Component Test', () => {
  const {
    questionWrapper, loggedOutWrapper, withAnswersWrapper, connectedQuestion
  } = setup();

  it('should match snapshot', () => {
    expect(questionWrapper).toMatchSnapshot();
    expect(loggedOutWrapper).toMatchSnapshot();
    expect(withAnswersWrapper).toMatchSnapshot();
    expect(connectedQuestion).toMatchSnapshot();
  });

  test('set sort handler', () => {
    const instance = questionWrapper.instance();
    instance.setSort('test sort');
    expect(instance.state.sort).toBe('test sort');
    instance.setSort('test sort');
    expect(instance.state.sort).toBe('test sort');
  });

  test('answer input handler', () => {
    const event = {
      target: { value: 'testanswer' },
    };

    questionWrapper.find('.answer-body').simulate('change', event);
    expect(questionWrapper.state().answerInput).toEqual('testanswer');
  });

  test('handle comment post', () => {
    const event = {
      preventDefault: jest.fn(),
      target: {
        querySelector: () => ({ value: 'test'})
      }
    };

    const instance = questionWrapper.instance();
    instance.handleCommentPost('questions', 1, event);
  });

  test('handle answer post', () => {
    questionWrapper.find('.btn-post-answer').simulate('click');
    
  });

  test('handle accept click', () => {
    withAnswersWrapper.find('Post').at(2).dive().find('.btn-accept').simulate('click');
  });

  test('handle delete click', () => {
    const instance = questionWrapper.instance();
    instance.handleDeletePost('questions', null);
  });
});
