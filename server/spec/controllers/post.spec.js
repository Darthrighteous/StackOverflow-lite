import Request from 'request';
import {
  questionInput,
  invalidInput,
} from '../testUtils';

describe('POST ROUTE', () => {
// POST a question with VALID inputs
  describe('for a single question with valid inputs', () => {
    const data = {};
    beforeAll((done) => {
      Request({ url: 'http://localhost:4001/v1/questions/', method: 'POST', json: questionInput }, (error, response, body) => {
        data.status = response.statusCode;
        data.body = body.question;
        done();
      });
    });

    it('has status 201', () => {
      expect(data.status).toBe(201);
    });

    it('has a body of', () => {
      expect(data.body.title).toBe(questionInput.title);
      expect(data.body.body).toBe(questionInput.body);
      expect(data.body.date).toBe(questionInput.date);
      expect(data.body.user).toBe(questionInput.user);
    });
  });

  // POST a question with INVALID inputs
  describe('for a single question with invalid inputs', () => {
    const data = {};
    beforeAll((done) => {
      Request({ url: 'http://localhost:4001/v1/questions/', method: 'POST', json: invalidInput }, (error, response, body) => {
        data.status = response.statusCode;
        data.body = body;
        done();
      });
    });

    it('has status 400', () => {
      expect(data.status).toBe(400);
    });

    it('has a body of', () => {
      expect(data.body.title).toBe(undefined);
      expect(data.body.body).toBe(undefined);
      expect(data.body.date).toBe(undefined);
      expect(data.body.user).toBe(undefined);
    });
  });
});
