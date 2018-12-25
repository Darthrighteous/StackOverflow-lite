import React from 'react';
import { shallow } from 'enzyme';

import Signup from '../../../../client/components/Signup';

describe('Signup snapshot test', () => {
  test('', () => {
    const signupWrapper = shallow(<Signup />);
    expect(signupWrapper).toMatchSnapshot();
  });
});
