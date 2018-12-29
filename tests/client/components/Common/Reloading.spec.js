import React from 'react';
import { shallow } from 'enzyme';

import Reloading from '../../../../client/components/Common/Reloading';

describe('Reloading snapshot test', () => {
  test('', () => {
    const reloadingWrapper = shallow(
      <Reloading />
    );
    expect(reloadingWrapper).toMatchSnapshot();
  });
});
