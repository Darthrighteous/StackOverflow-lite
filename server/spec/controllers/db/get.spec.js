import Request from 'request';
import { questionInput, bearerToken } from './utils';

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
    it('has correct body', () => {
      expect(data.questions[1].username).toBe('auerbach');
    });
  });

  describe('for one question', () => {
    let qId;
    const options = {
      url: 'http://localhost:4001/v2/questions',
      method: 'POST',
      headers: {
        Authorization: bearerToken,
      },
      json: questionInput,
    };
    // post a question
    beforeAll((done) => {
      Request.post(options, (error, response, body) => {
        qId = body.id;
        done();
      });
    });
    // get the posted question
    beforeAll((done) => {
      Request.get(`http://localhost:4001/v2/questions/${qId}`, (error, response, body) => {
        data.status = response.statusCode;
        data.question = JSON.parse(body).question;
        done();
      });
    });
    // get query successfull
    it('has status 200', () => {
      expect(data.status).toBe(200);
    });
    // question has posted values
    it('has expected body', () => {
      expect(data.question.title).toBe(questionInput.title);
      expect(data.question.body).toBe(questionInput.body);
    });
  });
});
