import React from 'react';
import { shallow } from 'enzyme';

import ContentOptions from '../../../../client/components/Common/ContentOptions';

const props = {
  sort: 'most recent',
  dropdownOpenState: true,
  onDropdownClick: jest.fn(),
  onSortClick: jest.fn(),
};

const bgProps = {
  ...props,
  background: true,
};

describe ('content options test', () => {
  const contentOptionsWrapper = shallow(
    <ContentOptions {...props} />
  );

  const withBackground = shallow(<ContentOptions {...bgProps} />);

  test('snapshot tests', () => {
    expect(contentOptionsWrapper).toMatchSnapshot();
    expect(withBackground).toMatchSnapshot();
  });

  test('event simulations', () => {
    contentOptionsWrapper.find('.dropdown').simulate('click');
    expect(contentOptionsWrapper.state().isDropdownOpen).toBe(true);

    const instance = contentOptionsWrapper.instance();
    instance.closeDropdown();
    expect(contentOptionsWrapper.state().isDropdownOpen).toBe(false);
  });
});
