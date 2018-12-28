import React from 'react';
import { shallow } from 'enzyme';

import { Login } from '../../../../client/components/Login';

/**
 * Function to set up
 * @returns {object} - object containing wrapper
 */
function setup() {
  const props = {
    logInRequest: jest.fn(),
    history: {
      push: jest.fn(),
    },
  };

  const loginWrapper = shallow(<Login {...props} />);

  return {
    loginWrapper
  };
}

describe('Login snapshot test', () => {
  const { loginWrapper } = setup();
  test('snapshot', () => {
    expect(loginWrapper).toMatchSnapshot();
  });
});

describe('event simulations', () => {
  const { loginWrapper } = setup();
  it('should handle input change', () => {
    const event = {
      target: { name: 'email', value: 'testemail' }
    };
    loginWrapper.find('input').first().simulate('change', event);
    expect(loginWrapper.state().email).toEqual('testemail');
  });

  it('should handle submit', () => {
    const event = {
      preventDefault: jest.fn()
    };
    loginWrapper.find('.auth-form').simulate('submit', event);
    expect(loginWrapper.state().email).toEqual('testemail');
  });
});
