import React from 'react';
import { shallow } from 'enzyme';

import Header from '../../../../client/components/Header';

beforeAll(() => {
  process.env = Object.assign(process.env, { SECRET: 'test' });
});

describe('Header snapshot tests', () => {

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
    username: "Darthrighteous",
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.5mhBHqs5_DTLdINd9p5m7ZJ6XD0Xc55kIaCRY5r6HRA',
  };

  afterEach(() => {
    localStorage.clear();
  });

  const props = {
    loginStatus: true,
    setLoggedIn: jest.fn(),
  };
  test(' - logged in', () => {
    localStorage.setItem('user', JSON.stringify(user));
    const headerWrapper = shallow(<Header {...props} />);
    expect(headerWrapper).toMatchSnapshot();

    headerWrapper.find('ButtonPrimary').simulate('click');
  });

  const loggedOutProps = {
    ...props,
    loginStatus: false
  };
  test('wrong token - logged out', () => {
    const wrongTokenUser = {...user, token: 'xdxdxd'};
    localStorage.setItem('user', JSON.stringify(wrongTokenUser));
    const headerWrapper = shallow(<Header {...loggedOutProps} />);
    expect(headerWrapper).toMatchSnapshot();
  });

  test('no user - logged out', () => {
    const headerWrapper = shallow(<Header {...loggedOutProps} />);
    expect(headerWrapper).toMatchSnapshot();
  });
});
