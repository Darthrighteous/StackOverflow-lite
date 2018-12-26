import React from 'react';
import { shallow } from 'enzyme';

import QuestionSummary from '../../../../client/components/Common/QuestionSummary';
import { mockQuestionResponse } from '../../../support/mockData';

/**
 * setup for test
 * @returns {object} containing props
 */
function setup() {
  const props = {
    history: { push: jest.fn() },
    question: mockQuestionResponse.questions[0],
  };

  const questionSummary = shallow(
    <QuestionSummary {...props} isOwner={false} />
  );
  const ownQuestionSummary = shallow(
    <QuestionSummary {...props} isOwner />
  );

  return {
    props,
    questionSummary,
    ownQuestionSummary,
  };
}

describe('Question summary snapshot tests', () => {
  const { questionSummary, ownQuestionSummary } = setup();

  test('for non owner', () => {
    expect(questionSummary).toMatchSnapshot();
  });

  test('for owner', () => {
    expect(ownQuestionSummary).toMatchSnapshot();
  });
});

describe('handler test', () => {
  const { props, questionSummary } = setup();
  const instance = questionSummary.instance();
  it('should navigate', () => {
    instance.navigateToQuestion('/question/1');
    expect(props.history.push).toHaveBeenCalled();
  });
});
