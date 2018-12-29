import React from 'react';
import { shallow } from 'enzyme';

import ContentOptions from '../../../../client/components/Common/ContentOptions';

const props = {
  sort: 'most recent',
  dropdownOpenState: true,
  onDropdownClick: jest.fn(),
  onSortClick: jest.fn(),
};

const closeProps = {
  ...props,
  background: true,
  dropdownOpenState: false,
};


describe ('content options test', () => {
  const contentOptionsWrapper = shallow(
    <ContentOptions {...props} />
  );
  const closeContentOptionsWrapper = shallow(
    <ContentOptions {...closeProps} />
  );

  test('snapshot tests', () => {
    expect(contentOptionsWrapper).toMatchSnapshot();
    expect(closeContentOptionsWrapper).toMatchSnapshot();
  });
});
