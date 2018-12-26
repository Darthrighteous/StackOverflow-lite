import React from 'react';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';

import ConnectedHome, { Home } from '../../../../client/components/Home';
import { mockQuestionResponse } from '../../../support/mockData';


/**
 * setup for test
 * @returns {object} containing props
 */
function setup() {
  const props = {
    fetchQuestions: jest.fn(),
    questions: mockQuestionResponse.questions,
    history: {},
  };
  const noQuestionProps = { ...props, questions: [] };

  const mockStore = configureMockStore([]);
  const store = mockStore({
    global: {
      isLoggedIn: true
    },
    questions: [],
  });

  const homeWrapper = shallow(<Home {...props} />);
  const noQuestionsHome = shallow(<Home {...noQuestionProps} />);
  const connectedHome = shallow(<ConnectedHome {...props} store={store} />);

  return {
    homeWrapper,
    noQuestionsHome,
    connectedHome,
  };
}

describe('Home component test', () => {
  const { homeWrapper, noQuestionsHome, connectedHome } = setup();
 


  test('snapshot test', () => {
    expect(homeWrapper).toMatchSnapshot();
    expect(noQuestionsHome).toMatchSnapshot();
    expect(connectedHome).toMatchSnapshot();
  });

  test('set sort handler', () => {
    const instance = homeWrapper.instance();
    instance.setSort('test sort');
    expect(instance.state.sort).toBe('test sort');
    instance.setSort('test sort');
    expect(instance.state.sort).toBe('test sort');
  });

  test('open dropdown handler', () => {
    const instance = homeWrapper.instance();
    instance.openDropdown();
    expect(instance.state.isDropdownOpen).toBe(true);
  });

  test('close dropdown handler', () => {
    const instance = homeWrapper.instance();
    instance.closeDropdown();
    expect(instance.state.isDropdownOpen).toBe(false);
  });
});
