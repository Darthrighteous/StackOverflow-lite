import Request from 'request';
import {
  questionInput,
  bearerToken,
} from './utils';

const data = {};

describe('POST ROUTE', () => {
  describe('for a question with valid inputs', () => {
    // post a question
    let qId;
    const options = {
      url: 'http://localhost:4001/v2/questions',
      method: 'POST',
      headers: {
        Authorization: bearerToken,
      },
      json: questionInput,
    };
    beforeAll((done) => {
      Request.post(options, (error, response, body) => {
        // console.log(response.statusCode);
        // console.log('error:', error);
        // console.log('statusCode:', response && response.statusCode);
        // console.log('body:', body);
        qId = body.id;
        done();
      });
    });
    // get the question
    beforeAll((done) => {
      Request.get(`http://localhost:4001/v2/questions/${qId}`, (error, response, body) => {
        data.status = response.statusCode;
        data.question = JSON.parse(body).question;
        done();
      });
    });

    it('has a status of 201', () => {
      expect(data.status).toBe(200);
    });

    it('has expected body', () => {
      expect(data.question.title).toBe(questionInput.title);
      expect(data.question.body).toBe(questionInput.body);
    });
  });
});
