import Request from 'request';
import '../../../../app';

const signUpInput = {
  firstname: 'James',
  lastname: 'Bond',
  username: 'jb007',
  email: 'james.bond@mi6.com',
  password: 'dieanotherday',
};

const data = {};
describe('AUTH ROUTE', () => {
  // create /user/ sign up
  describe('to sign up', () => {
    beforeAll((done) => {
      Request({ url: 'http://localhost:4001/v2/auth/signup', method: 'POST', json: signUpInput }, (error, response, body) => {
        data.status = response.statusCode;
        console.log(error);
        console.log(body);
        done();
      });
    });
    // create user successful
    it('has status 201', () => {
      expect(data.status).toBe(201);
    });
  });
});
