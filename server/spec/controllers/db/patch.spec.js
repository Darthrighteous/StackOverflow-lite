import Request from 'request';
import {
  bearerToken,
  answerInput,
  answerModify
} from './utils';

describe('PATCH ROUTE', () => {
// PATCH MODIFY AN ANSWER
  describe('to modify an answer', () => {
    const data = {};
    // add an answer
    let qId;
    let aId;
    const options = {
      url: 'http://localhost:4001/v2/questions/5/answers',
      method: 'POST',
      headers: {
        Authorization: bearerToken,
      },
      json: answerInput,
    };
    let options2;
    beforeAll((done) => {
      Request(options, (error, response, body) => {
        // console.log(response.statusCode);
        // console.log('error:', error);
        // console.log('statusCode:', response && response.statusCode);
        // console.log('body:', body);
        qId = Number(body.questionId);
        aId = Number(body.answerId);
        options2 = {
          url: `http://localhost:4001/v2/questions/${qId}/answers/${aId}`,
          method: 'PATCH',
          headers: {
            Authorization: bearerToken,
          },
          json: answerModify,
        };
        done();
      });
    });
    // modify the answer
    beforeAll((done) => {
      Request(options2, (error, response, body) => {
        // console.log(response.statusCode);
        // console.log('error:', error);
        // console.log('statusCode:', response && response.statusCode);
        // console.log('body:', body);
        data.status = response.statusCode;
        data.body = body;
        done();
      });
    });

    it('has status 200', () => {
      expect(data.status).toBe(200);
    });

    it('has a body of', () => {
      expect(data.body.status).toBe('success');
      expect(data.body.message).toBe('updated 1 answer successfully');
    });
  });
});
