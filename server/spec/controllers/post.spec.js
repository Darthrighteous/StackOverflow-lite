import Request from 'request';
import {
  questionInput,
  invalidInput,
  answerInput,
  invalidId,
  validId,
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

  // POST ANSWER TO VALID ID
  describe('for an answer to a valid question', () => {
    const data = {};
    beforeAll((done) => {
      Request({ url: 'http://localhost:4001/v1/questions/2/answers', method: 'POST', json: answerInput }, (error, response, body) => {
        data.status = response.statusCode;
        data.body = body.answer;
        done();
      });
    });

    it('has status 201', () => {
      expect(data.status).toBe(201);
    });

    it('has a body of', () => {
      expect(data.body.title).toBe('test answer title');
      expect(data.body.body).toBe('test answer body');
      expect(data.body.date).toBe('test answer date');
      expect(data.body.user).toBe('test answer user');
    });
  });

  // POST ANSWER TO INVALID ID
  describe('for an answer to an invalid question', () => {
    const data = {};
    beforeAll((done) => {
      Request({ url: `http://localhost:4001/v1/questions/${invalidId}/answers`, method: 'POST', json: answerInput }, (error, response, body) => {
        data.status = response.statusCode;
        data.body = body;
        done();
      });
    });

    it('has status 404', () => {
      expect(data.status).toBe(404); // res not found
    });

    it('has a body of', () => {
      expect(data.body).toBe(`question with id=${invalidId} not found`);
      expect(data.body.title).toBe(undefined);
      expect(data.body.body).toBe(undefined);
      expect(data.body.date).toBe(undefined);
      expect(data.body.user).toBe(undefined);
    });
  });

  // POST ANSWER With INVALID inputs
  describe('for an answer with invalid inputs', () => {
    const data = {};
    beforeAll((done) => {
      Request({ url: `http://localhost:4001/v1/questions/${validId}/answers`, method: 'POST', json: invalidInput }, (error, response, body) => {
        data.status = response.statusCode;
        data.body = body;
        done();
      });
    });

    it('has status 400', () => {
      expect(data.status).toBe(400); // badrequest
    });

    it('has a body of', () => {
      expect(data.body.title).toBe(undefined);
      expect(data.body.body).toBe(undefined);
      expect(data.body.date).toBe(undefined);
      expect(data.body.user).toBe(undefined);
    });
  });

});
