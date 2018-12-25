import React from 'react';
import { shallow } from 'enzyme';

import Login from '../../../../client/components/Login';

describe('Login snapshot test', () => {
  test('', () => {
    const loginWrapper = shallow(<Login />);
    expect(loginWrapper).toMatchSnapshot();
  });
});
