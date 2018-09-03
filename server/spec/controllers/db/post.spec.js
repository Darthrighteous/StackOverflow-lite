import Request from 'request';
import {
  logInInput,
  answerInput,
  questionInput,
} from './utils';


describe('POST ROUTE', () => {
  describe('for an answer', () => {
    const data = {};
    let options;
    let optionsNoBody;
    let optionsEmptyBody;
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
        optionsNoBody = {
          url: `http://localhost:4001/v2/questions/${qId}/answers`,
          method: 'POST',
          headers: {
            authorization: data.token,
          },
        };
        optionsEmptyBody = {
          url: `http://localhost:4001/v2/questions/${qId}/answers`,
          method: 'POST',
          headers: {
            authorization: data.token,
          },
          json: { body: '' },
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
        expect(data.body.questionId).toBe(qId);
      });
    });

    describe('with invalid inputs- no body', () => {
      // post an answer
      beforeAll((done) => {
        Request(optionsNoBody, (error, response, body) => {
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
        Request(optionsEmptyBody, (error, response, body) => {
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
    let optionsNoInput;
    let optionsEmptyTitle;
    let optionsNonStringBody;
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
        optionsNoInput = {
          url: 'http://localhost:4001/v2/questions',
          method: 'POST',
          headers: {
            authorization: data.token,
          },
          json: {},
        };
        optionsEmptyTitle = {
          url: 'http://localhost:4001/v2/questions',
          method: 'POST',
          headers: {
            authorization: data.token,
          },
          json: { title: '' },
        };
        optionsNonStringBody = {
          url: 'http://localhost:4001/v2/questions',
          method: 'POST',
          headers: {
            authorization: data.token,
          },
          json: {
            title: 'non string body',
            body: 444,
          },
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
        Request(optionsNoInput, (error, response, body) => {
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
        Request(optionsEmptyTitle, (error, response, body) => {
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
        Request(optionsNonStringBody, (error, response, body) => {
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
});
