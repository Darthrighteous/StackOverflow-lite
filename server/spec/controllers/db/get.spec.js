// import Request from 'request';
// import { questionInput } from './utils';

// const data = {};
// describe('GET ROUTE', () => {
//   // GET ALL
//   describe('for all questions', () => {
//     beforeAll((done) => {
//       Request.get('http://localhost:4001/v2/questions', (error, response, body) => {
//         data.status = response.statusCode;
//         data.questions = JSON.parse(body).questions;
//         done();
//       });
//     });

//     it('has status 200', () => {
//       expect(data.status).toBe(200);
//     });
//   });

//   // describe('for one question', () => {
//   //   let qId;
//   //   // post a question
//   //   beforeAll((done) => {
//   //     Request({ url: 'http://localhost:4001/v2/questions/', method: 'POST', json: questionInput }, (error, response, body) => {
//   //       qId = body.id;
//   //       done();
//   //     });
//   //   });
//   //   // get the posted question
//   //   beforeAll((done) => {
//   //     Request.get(`http://localhost:4001/v2/questions/${qId}`, (error, response, body) => {
//   //       data.status = response.statusCode;
//   //       data.question = JSON.parse(body).question;
//   //       done();
//   //     });
//   //   });
//   //   // get query successfull
//   //   it('has status 200', () => {
//   //     expect(data.status).toBe(200);
//   //   });
//   //   // question has posted values
//   //   it('has expected body', () => {
//   //     expect(data.question.title).toBe(questionInput.title);
//   //     expect(data.question.body).toBe(questionInput.body);
//   //     expect(data.question.username).toBe(questionInput.username);
//   //   });
//   // });
// });
