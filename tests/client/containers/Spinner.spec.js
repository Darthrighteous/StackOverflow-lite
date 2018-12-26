import React from 'react';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';

import Spinner from '../../../client/containers/Spinner';

/**
 * setup for component wrapper
 * @returns {object} - object containing connected wrapper
 */
function setup() {
  const mockStore = configureMockStore([]);
  const store = mockStore({
    global: {
      isLoading: true
    }
  });

  const spinnerWrapper = shallow(<Spinner store={store} />);

  return {
    spinnerWrapper
  };
}


test('Connected Spinner snapshot test', () => {
  const { spinnerWrapper } = setup();
  expect(spinnerWrapper).toMatchSnapshot();
});
