import React from 'react';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';

import ConnectedProfile, { Profile } from '../../../../client/components/Profile';
import { mockQuestionsResponse } from '../../../support/mockData';

const signedInUser = {
  answer_count: 5,
  comment_count: 8,
  downvoted_answers: [1, 6, 7],
  downvoted_questions: [1, 2],
  email: "ja.ogunniyi@test.com",
  firstname: "Jalil",
  id: 22,
  joined_at: "2018-12-26T08:24:09.197Z",
  lastname: "Ogunniyi",
  question_count: 1,
  upvoted_answers: [1],
  upvoted_questions: [2, 1],
  username: "Darthrighteous"
};

describe('Profile component test', () => {
  afterEach(() => {
    localStorage.clear();
  });

  const mockStore = configureMockStore([]);
  const store = mockStore({
    global: {
      isLoggedIn: true
    },
    questions: [],
    userQuestions: [],
    user: { username: 'Darthrighteous' }
  });

  const props = {
    userQuestions: mockQuestionsResponse.questions,
    profileOwner: {},
    match: { params: { username: 'Darthrighteous' } },
    fetchSingleUser: jest.fn(),
    fetchUserQuestions: jest.fn(),
  };

  test('snapshot test', () => {
    const ProfileWrapper = shallow(<Profile {...props} />);
    expect(ProfileWrapper).toMatchSnapshot();

    const instance = ProfileWrapper.instance();
    instance.setSort('test sort');
    expect(instance.state.sort).toBe('test sort');
    instance.setSort('test sort');
    expect(instance.state.sort).toBe('test sort');
  });

  test('connected componenet snapshot test', () => {
    const connectedProfile = shallow(
      <ConnectedProfile {...props} store={store} />
    );
    expect(connectedProfile).toMatchSnapshot();
  });

  test('owner profile snapshot', () => {
    localStorage.setItem('user', JSON.stringify(signedInUser));
    const ownerProps = {
      ...props,
      userQuestions: [],
      profileOwner: {
        username: 'Darthrighteous',
      },
    };
    const ownerWrapper = shallow(<Profile {...ownerProps} />);
    expect(ownerWrapper).toMatchSnapshot();
  });

  test('with questions snapshot', () => {
    const withQuestionsProps = {
      ...props,
      userQuestions: [],
      profileOwner: { username: 'tracy'},
    };
    const withQuestions = shallow(<Profile {...withQuestionsProps} />);
    expect(withQuestions).toMatchSnapshot();
  });
});
