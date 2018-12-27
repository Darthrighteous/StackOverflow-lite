import React from 'react';
import { shallow } from 'enzyme';

import { Signup } from '../../../../client/components/Signup';

/**
 * Function to set up
 * @returns {object} - object containing wrapper
 */
function setup() {
  const props = {
    signUpRequest: jest.fn(),
    history: {
      push: jest.fn(),
    },
  };

  const signupWrapper = shallow(<Signup {...props} />);

  return {
    signupWrapper
  };
}


describe('Signup snapshot test', () => {
  const { signupWrapper } = setup();
  test('snapshot', () => {
    expect(signupWrapper).toMatchSnapshot();
  });
});

describe('event simulations', () => {
  const { signupWrapper } = setup();
  it('should handle input change', () => {
    const event = {
      target: { name: 'firstname', value: 'testname' }
    };
    signupWrapper.find('input').first().simulate('change', event);
    expect(signupWrapper.state().firstname).toEqual('testname');
  });

  it('should handle submit', () => {
    const event = {
      preventDefault: jest.fn()
    };
    signupWrapper.find('.auth-form').simulate('submit', event);
    expect(signupWrapper.state().firstname).toEqual('testname');
  });
});
