import React from 'react';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';

import ConnectedNewQuestion, { NewQuestion } from '../../../../client/components/NewQuestion';

const mockStore = configureMockStore([]);
const store = mockStore({});

/**
 * Function to set up
 * @returns {object} - object containing wrapper
 */
function setup() {
  const props = {
    postQuestion: jest.fn(),
    history: {
      push: jest.fn(),
      goBack: jest.fn(),
    },
  };

  const connectedWrapper = shallow(
    <ConnectedNewQuestion {...props} store={store} />
  );
  const newQuestionWrapper = shallow(<NewQuestion {...props} />);
  return {
    connectedWrapper,
    newQuestionWrapper
  };
}

describe('New Question snapshot test', () => {
  const { connectedWrapper, newQuestionWrapper } = setup();
  test('snapshot', () => {
    expect(connectedWrapper).toMatchSnapshot();
    expect(newQuestionWrapper).toMatchSnapshot();
  });
});

describe('event simulations', () => {
  const { newQuestionWrapper } = setup();
  it('should handle input change', () => {
    const event = {
      target: { name: 'title', value: 'testtitle' }
    };

    newQuestionWrapper.find('input').first().simulate('change', event);
    expect(newQuestionWrapper.state().title).toEqual('testtitle');
    
  });

  it('should handle submit', () => {
    const event = {
      preventDefault: jest.fn()
    };
    newQuestionWrapper.find('.new-question-form').simulate('submit', event);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should handle cancel', () => {
    newQuestionWrapper.find('.btn-cancel').simulate('click');
    expect(newQuestionWrapper.state().title).toEqual('');
    expect(newQuestionWrapper.state().body).toEqual('');


    newQuestionWrapper.find('.btn-cancel').simulate('click');
  });
});
