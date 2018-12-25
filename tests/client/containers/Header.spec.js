import React from 'react';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';

import Header from '../../../client/containers/Header';

/**
 * setup for component wrapper
 * @returns {object} - object containing connected wrapper
 */
function setup() {
  const mockStore = configureMockStore([]);
  const store = mockStore({
    global: {
      isLoggedIn: true
    }
  });

  const headerWrapper = shallow(<Header store={store} />);

  return {
    headerWrapper
  };
}


test('Connected Header snapshot test', () => {
  const { headerWrapper } = setup();
  expect(headerWrapper).toMatchSnapshot();
});
