import Request from 'request';
import '../../app';

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
});
