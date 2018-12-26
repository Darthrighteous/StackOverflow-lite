import React from 'react';
import { shallow } from 'enzyme';

import ButtonNewQuestion from '../../../../client/components/Common/ButtonNewQuestion';

test('New Question button snapshot test', () => {
  const btnNewQuestion = shallow(
    <ButtonNewQuestion />
  );
  expect(btnNewQuestion).toMatchSnapshot();
});
