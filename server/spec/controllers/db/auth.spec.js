import Request from 'request';
import '../../../../app';
import {
  signUpInput,
  logInInput,
  invalidLogInInput,
} from './utils';

describe('AUTH ROUTE', () => {
  // create user/ sign up
  describe('to sign up', () => {
    const data = {};
    beforeAll((done) => {
      Request({ url: 'http://localhost:4001/v2/auth/signup', method: 'POST', json: signUpInput }, (error, response, body) => {
        data.status = response.statusCode;
        data.body = body;
        data.user = body.user;
        done();
      });
    });
    // create user successful
    it('has status 201', () => {
      expect(data.status).toBe(201);
    });
    it('has expected response body', () => {
      expect(data.body.status).toBe('success');
      expect(data.body.message).toBe('one user successfully created');
    });
    it('has expected user details', () => {
      expect(data.user.firstname).toBe(signUpInput.firstname);
      expect(data.user.lastname).toBe(signUpInput.lastname);
      expect(data.user.email).toBe(signUpInput.email);
      expect(data.user.username).toBe(signUpInput.username);
    });
  });

  describe('to sign up with existing email', () => {
    const data = {};
    beforeAll((done) => {
      Request({ url: 'http://localhost:4001/v2/auth/signup', method: 'POST', json: signUpInput }, (error, response, body) => {
        data.status = response.statusCode;
        data.body = body;
        done();
      });
    });

    it('has status 409', () => {
      expect(data.status).toBe(409);
    });
    it('has expected response body', () => {
      expect(data.body.status).toBe('failure');
      expect(data.body.message).toBe('user with email already exists');
    });
  });

  describe('to log in with correct details', () => {
    const data = {};
    beforeAll((done) => {
      Request({ url: 'http://localhost:4001/v2/auth/login', method: 'POST', json: logInInput }, (error, response, body) => {
        data.status = response.statusCode;
        data.body = body;
        data.user = body.user;
        done();
      });
    });
    // log in successful
    it('has a status 200', () => {
      expect(data.status).toBe(200);
    });
    it('has expected response body', () => {
      expect(data.body.status).toBe('success');
      expect(data.body.message).toBe('User logged in!');
      expect(data.body.user.email).toBe(logInInput.email);
    });
    it('has expected user details', () => {
      expect(data.user.email).toBe(logInInput.email);
    });
  });

  describe('to log in with incorrect details', () => {
    const data = {};
    beforeAll((done) => {
      Request({ url: 'http://localhost:4001/v2/auth/login', method: 'POST', json: invalidLogInInput }, (error, response, body) => {
        data.status = response.statusCode;
        data.body = body;
        done();
      });
    });
    // log in successful
    it('has a status 401', () => {
      expect(data.status).toBe(401);
    });
    it('has correct body', () => {
      expect(data.body.status).toBe('failure');
      expect(data.body.message).toBe('User does not exist');
    });
  });
});
