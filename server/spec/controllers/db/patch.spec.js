import Request from 'request';
import {
  logInInput,
  signUpInput3,
  answerInput,
  answerModify,
  questionInput,
} from './utils';

describe('PATCH ROUTE', () => {
  describe('for an answer', () => {
    const data = {};
    let options;
    let optionsQuestion;
    let optionsAnswer;
    let optionsAccept;
    let optionsModify;
    let optionsModifyNoToken;
    let aId;
    let qId;

    beforeAll((done) => {
      // sign up user1, get token
      Request({ url: 'http://localhost:4001/v2/auth/signup', method: 'POST', json: signUpInput3 }, (error, response, body) => {
        data.tokenQuestion = body.user.token;
        optionsQuestion = {
          url: 'http://localhost:4001/v2/questions',
          method: 'POST',
          headers: {
            authorization: data.tokenQuestion,
          },
          json: questionInput,
        };
        done();
      });
    });

    beforeAll((done) => {
    // log in user 2, get token
      Request({ url: 'http://localhost:4001/v2/auth/login', method: 'POST', json: logInInput }, (error, response, body) => {
        data.tokenAnswer = body.user.token;
        done();
      });
    });

    beforeAll((done) => {
      // ask a question, get qId
      Request.post(optionsQuestion, (error, response, body) => {
        qId = body.id;
        // options to post answer
        optionsAnswer = {
          url: `http://localhost:4001/v2/questions/${qId}/answers`,
          method: 'POST',
          headers: {
            authorization: data.tokenAnswer,
          },
          json: answerInput,
        };
        done();
      });
    });

    beforeAll((done) => {
    // post an answer to question of QId
      Request.post(optionsAnswer, (error, response, body) => {
        // get the answer Id
        aId = body.answerId;
        options = {
          url: `http://localhost:4001/v2/questions/${qId}/answers/${aId}`,
          method: 'PATCH',
          headers: {
            authorization: data.tokenQuestion,
          },
        };
        done();
      });
    });

    describe('to accept an answer', () => {
      beforeAll((done) => {
        options.json = { type: 'accept' };
        Request.patch(options, (error, response, body) => {
          data.status = response.statusCode;
          data.body = body;
          done();
        });
      });

      it('has expected status 200', () => {
        expect(data.status).toBe(200);
      });

      it('has expected response body', () => {
        expect(data.body.status).toBe('success');
        expect(data.body.message).toBe('Accepted 1 answer successfully');
      });
    });

    describe('to modify an answer', () => {
      beforeAll((done) => {
        options.headers = { authorization: data.tokenAnswer };
        options.json = answerModify;
        Request.patch(options, (error, response, body) => {
          data.status = response.statusCode;
          data.body = body;
          done();
        });
      });

      it('has expected status 200', () => {
        expect(data.status).toBe(200);
      });

      it('has expected response body', () => {
        expect(data.body.status).toBe('success');
        expect(data.body.message).toBe('Updated 1 answer successfully');
      });
    });

    describe('to modify an answer with no token', () => {
      beforeAll((done) => {
        options.headers = {};
        options.json = answerModify;
        Request.patch(options, (error, response, body) => {
          data.status = response.statusCode;
          data.body = body;
          done();
        });
      });

      it('has expected status 403', () => {
        expect(data.status).toBe(403);
      });

      it('has expected response body', () => {
        expect(data.body.status).toBe('unauthorized');
        expect(data.body.message).toBe('No token found');
      });
    });

    describe('to upvote an answer', () => {
      beforeAll((done) => {
        options.headers = { authorization: data.tokenQuestion };
        options.json = { type: 'upvote' };
        Request.patch(options, (error, response, body) => {
          data.status = response.statusCode;
          data.body = body;
          done();
        });
      });

      it('has expected status 200', () => {
        expect(data.status).toBe(200);
      });

      it('has expected response body', () => {
        expect(data.body.status).toBe('success');
        expect(data.body.message).toBe('Upvoted successfully');
      });
    });

    describe('to downvote an answer', () => {
      beforeAll((done) => {
        options.headers = { authorization: data.tokenQuestion };
        options.json = { type: 'downvote' };
        Request.patch(options, (error, response, body) => {
          data.status = response.statusCode;
          data.body = body;
          done();
        });
      });

      it('has expected status 200', () => {
        expect(data.status).toBe(200);
      });

      it('has expected response body', () => {
        expect(data.body.status).toBe('success');
        expect(data.body.message).toBe('Downvoted successfully');
      });
    });

    describe('with wrong type', () => {
      beforeAll((done) => {
        options.json = { type: 'tr3way' };
        Request.patch(options, (error, response, body) => {
          data.status = response.statusCode;
          data.body = body;
          done();
        });
      });

      it('has expected status 400', () => {
        expect(data.status).toBe(400);
      });

      it('has expected response body', () => {
        expect(data.body.status).toBe('failure');
        expect(data.body.message).toBe('Update type must be accept, edit, upvote or downvote');
      });
    });
  });
});
