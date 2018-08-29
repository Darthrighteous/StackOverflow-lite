import Request from 'request';

const data = {};
describe('GET ROUTE', () => {
  // GET ALL
  describe('for all questions', () => {
    beforeAll((done) => {
      Request.get('http://localhost:4001/v2/questions', (error, response, body) => {
        data.status = response.statusCode;
        data.questions = JSON.parse(body).questions;
        done();
      });
    });

    it('has status 200', () => {
      expect(data.status).toBe(200);
    });
  });
});
