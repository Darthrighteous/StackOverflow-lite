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
    let optionsQuestion;
    let optionsAnswer;
    let optionsAccept;
    let optionsModify;
    let optionsModifyNoBody;
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
        // console.log(body);
        // accept options
        optionsAccept = {
          url: `http://localhost:4001/v2/questions/${qId}/answers/${aId}`,
          method: 'PATCH',
          headers: {
            authorization: data.tokenQuestion,
          },
        };
        // modify options
        optionsModify = {
          url: `http://localhost:4001/v2/questions/${qId}/answers/${aId}`,
          method: 'PATCH',
          headers: {
            authorization: data.tokenAnswer,
          },
          json: answerModify,
        };
        optionsModifyNoBody = {
          url: `http://localhost:4001/v2/questions/${qId}/answers/${aId}`,
          method: 'PATCH',
          json: answerModify,
        };
        done();
      });
    });

    describe('to accept an answer', () => {
      beforeAll((done) => {
        Request.patch(optionsAccept, (error, response, body) => {
          data.status = response.statusCode;
          data.body = JSON.parse(body);
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
        Request.patch(optionsModify, (error, response, body) => {
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
        Request.patch(optionsModifyNoBody, (error, response, body) => {
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
  });
});
