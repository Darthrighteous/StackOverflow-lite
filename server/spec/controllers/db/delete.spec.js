import Request from 'request';
import { bearerToken } from './utils';

describe('DELETE ROUTE', () => {
// DELETE A QUESTION
  // describe('for a valid question without token', () => {
  //   const data = {};
  //   beforeAll((done) => {
  //     Request.delete('http://localhost:4001/v2/questions/69', (error, response, body) => {
  //       data.status = response.statusCode;
  //       data.body = body;
  //       done();
  //     });
  //   });

  //   it('has respose code of 403', () => {
  //     expect(data.status).toBe(403);
  //   });

  //   it('has no body', () => {
  //     expect(data.body.status).toBe('unauthorized');
  //     expect(data.body.message).toBe('no token found');
  //   });
  // });

  // describe('for a valid question with invalid token', () => {
  //   const data = {};
  //   beforeAll((done) => {
  //     const options = {
  //       url: 'http://localhost:4001/v2/questions/77',
  //       method: 'DELETE',
  //       headers: {
  //         Authorization: bearerToken,
  //       },
  //     };
  //     Request.delete(options, (error, response, body) => {
  //       data.status = response.statusCode;
  //       data.body = body;
  //       done();
  //     });
  //   });

  //   it('has respose code of 403', () => {
  //     expect(data.status).toBe(403);
  //   });

  //   it('has no body', () => {
  //     expect(data.body.status).toBe('unauthorized');
  //     expect(data.body.message).toBe('no token found');
  //   });
  // });
});
