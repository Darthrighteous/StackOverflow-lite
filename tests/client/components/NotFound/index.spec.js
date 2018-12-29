import React from 'react';
import { shallow } from 'enzyme';

import NotFound from '../../../../client/components/NotFound';

describe('NotFound snapshot test', () => {
  test('', () => {
    const notFoundWrapper = shallow(<NotFound />);
    expect(notFoundWrapper).toMatchSnapshot();
  });
});
