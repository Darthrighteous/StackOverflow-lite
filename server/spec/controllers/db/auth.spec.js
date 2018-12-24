import Request from 'request';
import '../../../../bin/app';
import {
  signUpInput,
  logInInput,
  invalidLogInInput,
} from './utils';

describe('AUTH ROUTE', () => {
  // create user/ sign up
  describe('to sign up with short pwd', () => {
    const data = {};
    const shortPwdInput = Object.assign({}, signUpInput);
    shortPwdInput.password = 'die';
    beforeAll((done) => {
      Request({ url: 'http://localhost:4001/api/v1/auth/signup', method: 'POST', json: shortPwdInput }, (error, response, body) => {
        data.status = response.statusCode;
        data.body = body;
        data.user = body.user;
        done();
      });
    });
    it('has status 400', () => {
      expect(data.status).toBe(400);
    });
    it('has expected response body', () => {
      expect(data.body.status).toBe('failure');
      expect(data.body.message).toBe('Password must be a non-empty string, up to 6 characters');
    });
  });

  describe('to sign up with no pwd', () => {
    const data = {};
    const noPwdInput = Object.assign({}, signUpInput);
    noPwdInput.password = undefined;
    beforeAll((done) => {
      Request({ url: 'http://localhost:4001/api/v1/auth/signup', method: 'POST', json: noPwdInput }, (error, response, body) => {
        data.status = response.statusCode;
        data.body = body;
        data.user = body.user;
        done();
      });
    });
    it('has status 400', () => {
      expect(data.status).toBe(400);
    });
    it('has expected response body', () => {
      expect(data.body.status).toBe('failure');
      expect(data.body.message).toBe('must provide password');
    });
  });

  describe('to sign up with no email', () => {
    const data = {};
    const noEmailInput = Object.assign({}, signUpInput);
    noEmailInput.email = undefined;
    beforeAll((done) => {
      Request({ url: 'http://localhost:4001/api/v1/auth/signup', method: 'POST', json: noEmailInput }, (error, response, body) => {
        data.status = response.statusCode;
        data.body = body;
        data.user = body.user;
        done();
      });
    });
    it('has status 400', () => {
      expect(data.status).toBe(400);
    });
    it('has expected response body', () => {
      expect(data.body.status).toBe('failure');
      expect(data.body.message).toBe('must provide email');
    });
  });

  describe('to sign up with no username', () => {
    const data = {};
    const noUsernameInput = Object.assign({}, signUpInput);
    noUsernameInput.username = undefined;
    beforeAll((done) => {
      Request({ url: 'http://localhost:4001/api/v1/auth/signup', method: 'POST', json: noUsernameInput }, (error, response, body) => {
        data.status = response.statusCode;
        data.body = body;
        data.user = body.user;
        done();
      });
    });
    it('has status 400', () => {
      expect(data.status).toBe(400);
    });
    it('has expected response body', () => {
      expect(data.body.status).toBe('failure');
      expect(data.body.message).toBe('must provide username');
    });
  });

  describe('to sign up with an invalid username', () => {
    const data = {};
    const invalidUsernameInput = Object.assign({}, signUpInput);
    invalidUsernameInput.username = 6244;
    beforeAll((done) => {
      Request({ url: 'http://localhost:4001/api/v1/auth/signup', method: 'POST', json: invalidUsernameInput }, (error, response, body) => {
        data.status = response.statusCode;
        data.body = body;
        data.user = body.user;
        done();
      });
    });
    it('has status 400', () => {
      expect(data.status).toBe(400);
    });
    it('has expected response body', () => {
      expect(data.body.status).toBe('failure');
      expect(data.body.message).toBe('Username must be a non-empty string');
    });
  });

  describe('to sign up with empty firstname', () => {
    const data = {};
    const emptyFirstnameInput = Object.assign({}, signUpInput);
    emptyFirstnameInput.firstname = '';
    beforeAll((done) => {
      Request({ url: 'http://localhost:4001/api/v1/auth/signup', method: 'POST', json: emptyFirstnameInput }, (error, response, body) => {
        data.status = response.statusCode;
        data.body = body;
        data.user = body.user;
        done();
      });
    });
    it('has status 400', () => {
      expect(data.status).toBe(400);
    });
    it('has expected response body', () => {
      expect(data.body.status).toBe('failure');
      expect(data.body.message).toBe('first name must be a non-empty string');
    });
  });

  describe('to sign up with empty lastname', () => {
    const data = {};
    const emptyLastnameInput = Object.assign({}, signUpInput);
    emptyLastnameInput.lastname = '';
    beforeAll((done) => {
      Request({ url: 'http://localhost:4001/api/v1/auth/signup', method: 'POST', json: emptyLastnameInput }, (error, response, body) => {
        data.status = response.statusCode;
        data.body = body;
        data.user = body.user;
        done();
      });
    });
    it('has status 400', () => {
      expect(data.status).toBe(400);
    });
    it('has expected response body', () => {
      expect(data.body.status).toBe('failure');
      expect(data.body.message).toBe('last name must be a non-empty string');
    });
  });

  describe('to sign up with valid inputs', () => {
    const data = {};
    beforeAll((done) => {
      Request({ url: 'http://localhost:4001/api/v1/auth/signup', method: 'POST', json: signUpInput }, (error, response, body) => {
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
      Request({ url: 'http://localhost:4001/api/v1/auth/signup', method: 'POST', json: signUpInput }, (error, response, body) => {
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

  // LOG IN
  describe('to log in with correct details', () => {
    const data = {};
    beforeAll((done) => {
      Request({ url: 'http://localhost:4001/api/v1/auth/login', method: 'POST', json: logInInput }, (error, response, body) => {
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

  describe('to log in with unexisting user', () => {
    const data = {};
    beforeAll((done) => {
      Request({ url: 'http://localhost:4001/api/v1/auth/login', method: 'POST', json: invalidLogInInput }, (error, response, body) => {
        data.status = response.statusCode;
        data.body = body;
        done();
      });
    });
    // log in unsuccessful
    it('has a status 401', () => {
      expect(data.status).toBe(401);
    });
    it('has correct body', () => {
      expect(data.body.status).toBe('failure');
      expect(data.body.message).toBe('User does not exist');
    });
  });

  describe('to log in with no password', () => {
    const data = {};
    beforeAll((done) => {
      const noPwdInput = Object.assign({}, logInInput);
      noPwdInput.password = undefined;
      Request({ url: 'http://localhost:4001/api/v1/auth/login', method: 'POST', json: noPwdInput }, (error, response, body) => {
        data.status = response.statusCode;
        data.body = body;
        done();
      });
    });
    // log in unsuccessful
    it('has a status 400', () => {
      expect(data.status).toBe(400);
    });
    it('has correct body', () => {
      expect(data.body.status).toBe('failure');
      expect(data.body.message).toBe('must provide password');
    });
  });

  describe('to log in with no email', () => {
    const data = {};
    beforeAll((done) => {
      const noEmailInput = Object.assign({}, logInInput);
      noEmailInput.email = undefined;
      Request({ url: 'http://localhost:4001/api/v1/auth/login', method: 'POST', json: noEmailInput }, (error, response, body) => {
        data.status = response.statusCode;
        data.body = body;
        done();
      });
    });
    // log in unsuccessful
    it('has a status 400', () => {
      expect(data.status).toBe(400);
    });
    it('has correct body', () => {
      expect(data.body.status).toBe('failure');
      expect(data.body.message).toBe('must provide email');
    });
  });

  describe('to log in with invalid email', () => {
    const data = {};
    beforeAll((done) => {
      const invalidMailInput = Object.assign({}, logInInput);
      invalidMailInput.email = 'national@yahoo.m';
      Request({ url: 'http://localhost:4001/api/v1/auth/login', method: 'POST', json: invalidMailInput }, (error, response, body) => {
        data.status = response.statusCode;
        data.body = body;
        done();
      });
    });
    // log in unsuccessful
    it('has a status 400', () => {
      expect(data.status).toBe(400);
    });
    it('has correct body', () => {
      expect(data.body.status).toBe('failure');
      expect(data.body.message).toBe('Invalid Email');
    });
  });
});
