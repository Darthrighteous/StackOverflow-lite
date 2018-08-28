import Request from 'request';
import {
  answerInput,
} from '../testUtils';

describe('PATCH ROUTE', () => {
// PATCH ACCEPT AN ANSWER
  describe('to accept an answer', () => {
    const data = {};
    // add an answer
    beforeAll((done) => {
      Request({ url: 'http://localhost:4001/v1/questions/1/answers', method: 'POST', json: answerInput }, (error, response, body) => {
        done();
      });
    });
    // accept the answer
    beforeAll((done) => {
      Request.patch('http://localhost:4001/v1/questions/1/answers/1', (error, response, body) => {
        data.status = response.statusCode;
        data.answer = JSON.parse(body).answer;
        done();
      });
    });

    it('has status 404', () => {
      expect(data.status).toBe(200);
    });

    it('has a body of', () => {
      expect(data.answer.body).toBe(answerInput.body);
      expect(data.answer.user).toBe(answerInput.user);
      expect(data.answer.accept).toBe(true);
    });
  });
});
