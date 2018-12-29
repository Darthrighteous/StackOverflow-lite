import React from 'react';
import { shallow } from 'enzyme';

import Post from '../../../../client/components/Question/Post';
import { mockSingleQuestionResponse } from '../../../support/mockData';

/**
 * setup for test
 * @returns {object} containing props and enzyme wrappers
 */
function setup() {
  const props = {
    type: 'questions',
    isQuestionOwner: true,
    isLoggedIn: true,
    post: mockSingleQuestionResponse.question,
    comments: mockSingleQuestionResponse.comments,
    onCommentPost: jest.fn(),
    onModifyPost: jest.fn(),
    onDeletePost: jest.fn(),
  };
  const loggedOutProps = {
    ...props, isLoggedIn: false,
  };
  const typeAnswersProps = {
    ...props,
    type: 'answers',
    comments: [],
    post: mockSingleQuestionResponse.answers[0],
  };
  const altQuestionProps = {
    ...props,
    type: 'questions',
    comments: [],
    post: mockSingleQuestionResponse.question,
  };

  const acceptedAnswerProps = {
    ...typeAnswersProps,
    post: mockSingleQuestionResponse.answers[1],
  };

  const user = {
    answer_count: 5,
    comment_count: 8,
    downvoted_answers: [1, 6, 7, 7],
    downvoted_questions: [1, 2, 4],
    email: "ja.ogunniyi@test.com",
    firstname: "Jalil",
    id: 22,
    joined_at: "2018-12-26T08:24:09.197Z",
    lastname: "Ogunniyi",
    question_count: 1,
    upvoted_answers: [1],
    upvoted_questions: [2, 1, 4],
    username: "Darthrighteous"
  };
  localStorage.setItem('user', JSON.stringify(user));
  const questionPostWrapper = shallow(<Post {...props} />);
  const altQuestionPostWrapper = shallow(<Post {...altQuestionProps} />);
  const loggedOutPostWrapper = shallow(<Post {...loggedOutProps} />);
  const answerPostWrapper = shallow(<Post {...typeAnswersProps} />);
  const acceptedAnswerPostWrapper = shallow(<Post {...acceptedAnswerProps} />);
  localStorage.clear();
  const noUserPostWrapper =shallow(<Post {...props} />);

  // const loggedOutWrapper =shallow(<Post {...loggedOutProps} />);
  // const withAnswersWrapper =shallow(<Post {...withAnswersProps} />);

  return {
    questionPostWrapper,
    altQuestionPostWrapper,
    loggedOutPostWrapper,
    answerPostWrapper,
    acceptedAnswerPostWrapper,
    noUserPostWrapper,
  };
}

describe('Post component test', () => {
  const {
    questionPostWrapper,
    altQuestionPostWrapper,
    loggedOutPostWrapper,
    answerPostWrapper,
    acceptedAnswerPostWrapper,
    noUserPostWrapper
  } = setup();

  test('snapshot test', () => {
    expect(questionPostWrapper).toMatchSnapshot();
    expect(loggedOutPostWrapper).toMatchSnapshot();
    expect(answerPostWrapper).toMatchSnapshot();
    expect(acceptedAnswerPostWrapper).toMatchSnapshot();
    expect(noUserPostWrapper).toMatchSnapshot();
  });

  test('upvote click handler', () => {
    const event = {
      target: {
        classList: {
          contains: () => (true),
        }
      }
    };
    altQuestionPostWrapper.find('.btn-upvote').simulate('click', event);
    answerPostWrapper.find('.btn-upvote').simulate('click', event);
  });

  test('downvote click handler', () => {
    const event = {
      target: {
        classList: {
          contains: () => (true),
        }
      }
    };
    altQuestionPostWrapper.find('.btn-downvote').simulate('click', event);
    answerPostWrapper.find('.btn-downvote').simulate('click', event);
  });

  test('comment input click handler', () => {
    questionPostWrapper.find('.btn-new-comment').simulate('click');
    expect(questionPostWrapper.state().isAddingComment).toEqual(true);
  });

  test('delete click handler', () => {
    altQuestionPostWrapper.find('.btn-delete').simulate('click');
    answerPostWrapper.find('.btn-delete').simulate('click');

    expect(questionPostWrapper.state().isAddingComment).toEqual(true);
  });
});
