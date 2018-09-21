import Request from 'request';
import { questionInput, logInInput, invalidQId } from './utils';


describe('GET ROUTE', () => {
  // GET ALL
  describe('for all questions', () => {
    const data = {};
    beforeAll((done) => {
      Request.get('http://localhost:4001/v2/questions', (error, response, body) => {
        data.status = response.statusCode;
        data.body = JSON.parse(body);
        data.questions = JSON.parse(body).questions;
        done();
      });
    });

    it('has status 200', () => {
      expect(data.status).toBe(200);
    });
    it('has expected response body', () => {
      expect(data.body.status).toBe('success');
      expect(data.body.message).toBe('all questions retrieved successfully');
    });
  });

  describe('for one question qith valid id', () => {
    const data = {};
    let options;
    let qId;
    // log in, get token
    beforeAll((done) => {
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
        data.body = JSON.parse(body);
        data.question = JSON.parse(body).question;
        done();
      });
    });
    // get query successfull
    it('has status 200', () => {
      expect(data.status).toBe(200);
    });

    it('has expected response body', () => {
      expect(data.body.status).toBe('success');
      expect(data.body.message).toBe('one question retrieved successfully');
    });
    // question has posted values
    it('has expected question body', () => {
      expect(data.question.title).toBe(questionInput.title);
      expect(data.question.body).toBe(questionInput.body);
    });
  });

  describe('for one question with invalid id', () => {
    const data = {};
    beforeAll((done) => {
      Request.get(`http://localhost:4001/v2/questions/${invalidQId}`, (error, response, body) => {
        data.status = response.statusCode;
        data.body = JSON.parse(body);
        data.question = JSON.parse(body).question;
        done();
      });
    });

    it('has status 400', () => {
      expect(data.status).toBe(400);
    });

    it('has expected response body', () => {
      expect(data.body.status).toBe('failure');
      expect(data.body.message).toBe('question Id must be a number');
    });
  });

  describe('for one question that doesn\'t exist', () => {
    const data = {};
    beforeAll((done) => {
      Request.get('http://localhost:4001/v2/questions/100000000000', (error, response, body) => {
        data.status = response.statusCode;
        data.body = JSON.parse(body);
        data.question = JSON.parse(body).question;
        done();
      });
    });

    it('has status 404', () => {
      expect(data.status).toBe(404);
    });

    it('has expected response body', () => {
      expect(data.body.status).toBe('failure');
    });
  });

  describe('to search for question three', () => {
    const data = {};
    beforeAll((done) => {
      Request.get('http://localhost:4001/v2/questions?search=test', (error, response, body) => {
        data.status = response.statusCode;
        data.body = JSON.parse(body);
        data.questions = JSON.parse(body).questions;
        done();
      });
    });

    it('has status 200', () => {
      expect(data.status).toBe(200);
    });
    it('has expected response body', () => {
      expect(data.body.status).toBe('success');
      expect(data.body.message).toBe('all questions retrieved successfully');
    });
    it('has exoected question array', () => {
      expect(data.questions.length).toBe(1);
      expect(data.questions[0].title).toBe(questionInput.title);
      expect(data.questions[0].body).toBe(questionInput.body);
    });
  });
});
