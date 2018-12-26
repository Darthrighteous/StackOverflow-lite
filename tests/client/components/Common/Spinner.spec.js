import React from 'react';
import { shallow } from 'enzyme';

import Spinner from '../../../../client/components/Common/Spinner';

describe('Spinner snapshot tests', () => {
  test('not loading', () => {
    const spinner = shallow(
      <Spinner isLoading={false} />
    );
    expect(spinner).toMatchSnapshot();
  });

  test('is loading', () => {
    const spinner = shallow(
      <Spinner isLoading />
    );
    expect(spinner).toMatchSnapshot();
  });
});
