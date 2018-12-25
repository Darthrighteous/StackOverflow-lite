import React from 'react';
import { shallow } from 'enzyme';

import App from '../../client/App';

test('App snapshot test', () => {
  const component = shallow(<App />);
  expect(component).toMatchSnapshot();
});
