import Request from 'request';
import '../../../../app';
import {
  signUpInput,
  logInInput,
  invalidLogInInput,
} from './utils';

const data = {};
describe('AUTH ROUTE', () => {
  // create user/ sign up
  describe('to sign up', () => {
    // PENDING DB REFRESH FUNCTIONALITY
    // beforeAll((done) => {
    //   Request({ url: 'http://localhost:4001/v2/auth/signup', method: 'POST', json: signUpInput}, (error, response, body) => {
    //     data.status = response.statusCode;
    //     done();
    //   });
    // });
    // // create user successful
    // it('has status 201', () => {
    //   expect(data.status).toBe(201);
    // });
  });

  describe('to log in with correct details', () => {
    beforeAll((done) => {
      Request({ url: 'http://localhost:4001/v2/auth/login', method: 'POST', json: logInInput }, (error, response, body) => {
        data.status = response.statusCode;
        data.body = body;
        done();
      });
    });
    // log in successful
    it('has a status 200', () => {
      expect(data.status).toBe(200);
    });
    it('has correct body', () => {
      expect(data.body.status).toBe('success');
      expect(data.body.message).toBe('User logged in!');
      expect(data.body.user.email).toBe(logInInput.email);
    });
  });

  describe('to log in with incorrect details', () => {
    beforeAll((done) => {
      Request({ url: 'http://localhost:4001/v2/auth/login', method: 'POST', json: invalidLogInInput }, (error, response, body) => {
        data.status = response.statusCode;
        data.body = body;
        done();
      });
    });
    // log in successful
    it('has a status 200', () => {
      expect(data.status).toBe(401);
    });
    it('has correct body', () => {
      expect(data.body.status).toBe('failure');
      expect(data.body.message).toBe('User does not exist');
    });
  });
});
