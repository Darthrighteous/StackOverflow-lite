import React from 'react';
import { shallow } from 'enzyme';

import ButtonPrimary from '../../../../client/components/Common/ButtonPrimary';

test('Primary button snapshot test', () => {
  const btnPrimary = shallow(
    <ButtonPrimary
      link="/test"
      label="test"
      colorBtn="#fff"
      colorTxt="#000"
    />
  );
  expect(btnPrimary).toMatchSnapshot();
});
