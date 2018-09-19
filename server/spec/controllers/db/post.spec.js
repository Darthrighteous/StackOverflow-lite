import Request from 'request';
import {
  logInInput,
  answerInput,
  questionInput,
  commentInput,
} from './utils';


describe('POST ROUTE', () => {
  describe('for an answer', () => {
    const data = {};
    let options;
    const qId = 1;
    // log in, get token
    beforeAll((done) => {
      Request({ url: 'http://localhost:4001/v2/auth/login', method: 'POST', json: logInInput }, (error, response, body) => {
        data.token = body.user.token;
        options = {
          url: `http://localhost:4001/v2/questions/${qId}/answers`,
          method: 'POST',
          headers: {
            authorization: data.token,
          },
          json: answerInput,
        };
        done();
      });
    });

    describe('with valid inputs', () => {
      // post an answer
      beforeAll((done) => {
        Request(options, (error, response, body) => {
          data.status = response.statusCode;
          data.body = body;
          done();
        });
      });
      it('has a status of 201', () => {
        expect(data.status).toBe(201);
      });
      it('has expected response body', () => {
        expect(data.body.status).toBe('success');
        expect(data.body.message).toBe('One answer successfully added');
        expect(data.body.answer.question_id).toBe(qId);
      });
    });

    describe('with invalid inputs- no body', () => {
      // post an answer
      beforeAll((done) => {
        options.json = null;
        Request(options, (error, response, body) => {
          data.status = response.statusCode;
          data.body = JSON.parse(body);
          done();
        });
      });
      it('has a status of 400', () => {
        expect(data.status).toBe(400);
      });
      it('has expected respose body', () => {
        expect(data.body.status).toBe('failure');
        expect(data.body.message).toBe('Must provide body');
      });
    });

    describe('with invalid inputs- empty body', () => {
      // post an answer
      beforeAll((done) => {
        options.json = { body: '' };
        Request(options, (error, response, body) => {
          data.status = response.statusCode;
          data.body = body;
          done();
        });
      });
      it('has a status of 400', () => {
        expect(data.status).toBe(400);
      });
      it('has expected respose body', () => {
        expect(data.body.status).toBe('failure');
        expect(data.body.message).toBe('Body must be a non-empty string');
      });
    });
  });

  describe('for a question', () => {
    const data = {};
    let options;
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

    describe('with valid inputs', () => {
      beforeAll((done) => {
        Request(options, (error, response, body) => {
          data.status = response.statusCode;
          data.body = body;
          done();
        });
      });
      it('has a status of 201', () => {
        expect(data.status).toBe(201);
      });
      it('has expected respose body', () => {
        expect(data.body.status).toBe('success');
        expect(data.body.message).toBe('Created one question successfully');
      });
    });

    describe('with invalid inputs - no title', () => {
      beforeAll((done) => {
        options.json = {};
        Request(options, (error, response, body) => {
          data.status = response.statusCode;
          data.body = body;
          done();
        });
      });
      it('has a status of 400', () => {
        expect(data.status).toBe(400);
      });
      it('has expected respose body', () => {
        expect(data.body.status).toBe('failure');
        expect(data.body.message).toBe('Must provide title');
      });
    });

    describe('with valid inputs - empty title', () => {
      beforeAll((done) => {
        options.json = { title: '' };
        Request(options, (error, response, body) => {
          data.status = response.statusCode;
          data.body = body;
          done();
        });
      });
      it('has a status of 400', () => {
        expect(data.status).toBe(400);
      });
      it('has expected respose body', () => {
        expect(data.body.status).toBe('failure');
        expect(data.body.message).toBe('Title must be a non-empty string');
      });
    });

    describe('with valid inputs - non string body', () => {
      beforeAll((done) => {
        options.json = {
          title: 'non string body',
          body: 444,
        };
        Request(options, (error, response, body) => {
          data.status = response.statusCode;
          data.body = body;
          done();
        });
      });
      it('has a status of 400', () => {
        expect(data.status).toBe(400);
      });
      it('has expected respose body', () => {
        expect(data.body.status).toBe('failure');
        expect(data.body.message).toBe('Body must be a string');
      });
    });
  });

  describe('for a comment', () => {
    const data = {};
    const qId = 1;
    const aId = 1;
    let options;
    // log in, get token
    beforeAll((done) => {
      Request({ url: 'http://localhost:4001/v2/auth/login', method: 'POST', json: logInInput }, (error, response, body) => {
        data.token = body.user.token;
        options = {
          url: `http://localhost:4001/v2/questions/${qId}/comments`,
          method: 'POST',
          headers: {
            authorization: data.token,
          },
          json: commentInput,
        };
        done();
      });
    });

    describe('for a question, with valid inputs', () => {
      beforeAll((done) => {
        Request(options, (error, response, body) => {
          data.status = response.statusCode;
          data.body = body;
          done();
        });
      });
      it('has a status of 201', () => {
        expect(data.status).toBe(201);
      });
      it('has expected respose body', () => {
        expect(data.body.status).toBe('success');
        expect(data.body.message).toBe('One question comment successfully added');
      });
    });

    describe('for an answer, with valid inputs', () => {
      beforeAll((done) => {
        options.url = `http://localhost:4001/v2/answers/${aId}/comments`;
        Request(options, (error, response, body) => {
          data.status = response.statusCode;
          data.body = body;
          done();
        });
      });
      it('has a status of 201', () => {
        expect(data.status).toBe(201);
      });
      it('has expected respose body', () => {
        expect(data.body.status).toBe('success');
        expect(data.body.message).toBe('One answer comment successfully added');
      });
    });
  });
});
