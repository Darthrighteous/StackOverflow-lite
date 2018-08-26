import Request from 'request';
import {
  invalidId,
  validId,
} from '../testUtils';

describe('GET ROUTE', () => {
  // GET ALL
  describe('for all questions', () => {
    const data = {};
    beforeAll((done) => {
      Request.get('http://localhost:4001/v1/questions', (error, response, body) => {
        data.status = response.statusCode;
        data.questions = JSON.parse(body).questions;
        done();
      });
    });

    it('has status 200', () => {
      expect(data.status).toBe(200);
    });
    it('has a title of', () => {
      expect(data.questions.length).toBeGreaterThanOrEqual(5);
    });
  });

  // GET ALL SORT QUERY
  describe('for all questions with sort query', () => {
    const data = {};
    beforeAll((done) => {
      Request.get('http://localhost:4001/v1/questions?sortBy=score', (error, response, body) => {
        data.status = response.statusCode;
        data.questions = JSON.parse(body).questions;
        done();
      });
    });

    it('has status 200', () => {
      expect(data.status).toBe(200);
    });

    it('has a title of', () => {
      expect(data.questions[0].title).toBe('What is sort query?');
    });
  });

  // GET VALID ID
  describe(`Get Specific question with id ${validId}`, () => {
    const data = {};
    beforeAll((done) => {
      Request.get(`http://localhost:4001/v1/questions/${validId}`, (error, response, body) => {
        data.status = response.statusCode;
        data.question = JSON.parse(body).question;
        done();
      });
    });

    it('has status 200', () => {
      expect(data.status).toBe(200);
    });

    it('has a body of', () => {
      expect(data.question.title).toBe('Dummy Question');
      expect(data.question.body).toBe('How do you divide a prime number by itself?');
      expect(data.question.date).toBe('20/03/2003');
      expect(data.question.user).toBe('tyronne');
    });
  });

  // GET INVALID ID
  describe('Get Specific question with invalid id', () => {
    const data = {};
    beforeAll((done) => {
      Request.get(`http://localhost:4001/v1/questions/${invalidId}`, (error, response, body) => {
        data.status = response.statusCode;
        data.body = body;
        done();
      });
    });

    it('has status 404', () => {
      expect(data.status).toBe(404);
    });

    it('has a body of undefined', () => {
      expect(data.body).toBe(`question with id=${invalidId} not found`);
    });
  });
});
