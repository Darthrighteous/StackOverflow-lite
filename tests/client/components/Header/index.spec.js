import React from 'react';
import { shallow } from 'enzyme';

import Header from '../../../../client/components/Header';

describe('Header snapshot tests', () => {
  test(' - logged in', () => {
    const headerWrapper = shallow(<Header loginStatus />);
    expect(headerWrapper).toMatchSnapshot();
  });

  test(' - logged out', () => {
    const headerWrapper = shallow(<Header loginStatus={false} />);
    expect(headerWrapper).toMatchSnapshot();
  });
});
