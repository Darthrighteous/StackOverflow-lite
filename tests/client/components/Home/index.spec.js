import React from 'react';
import { shallow } from 'enzyme';

import Home from '../../../../client/components/Home';

describe('Home snapshot test', () => {
  test('', () => {
    const homeWrapper = shallow(<Home loginStatus />);
    expect(homeWrapper).toMatchSnapshot();
  });
});
