import Request from 'request';
import { logInInput, questionInput } from './utils';

describe('DELETE ROUTE', () => {
  const data = {};
  let options;
  let qId;

  beforeAll((done) => {
    // log in, get token
    Request({ url: 'http://localhost:4001/v2/auth/login', method: 'POST', json: logInInput }, (error, response, body) => {
      data.token = body.user.token;
      options = {
        url: 'http://localhost:4001/v2/questions',
        method: 'POST',
        headers: {
          authorization: data.token,
        },
        json: questionInput,
      };
      done();
    });
  });

  beforeAll((done) => {
    // post a question with token
    Request.post(options, (error, response, body) => {
      qId = body.id;
      options = {
        url: `http://localhost:4001/v2/questions/${body.id}`,
        method: 'DELETE',
        headers: {
          authorization: data.token,
        },
      };
      done();
    });
  });

  describe('for a question without token', () => {
    // delete question without token
    beforeAll((done) => {
      Request.delete(`http://localhost:4001/v2/questions/${qId}`, (error, response, body) => {
        data.status = response.statusCode;
        data.body = JSON.parse(body);
        done();
      });
    });

    it('has response code 403', () => {
      expect(data.status).toBe(403);
    });

    it('has expected response body', () => {
      expect(data.body.status).toBe('unauthorized');
      expect(data.body.message).toBe('No token found');
    });
  });

  describe('for a question with valid token', () => {
    // delete the question with token
    beforeAll((done) => {
      Request.delete(options, (error, response, body) => {
        data.status = response.statusCode;
        data.body = JSON.parse(body);
        done();
      });
    });

    it('has response code 200', () => {
      expect(data.status).toBe(200);
    });

    it('has expected response body', () => {
      expect(data.body.status).toBe('success');
      expect(data.body.message).toBe('Deleted 1 row successfully');
    });
  });
});
