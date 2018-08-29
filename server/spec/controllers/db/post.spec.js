// import Request from 'request';
// import {
//   questionInput,
// } from './utils';

// const data = {};
// describe('POST ROUTE', () => {
//   describe('for a question with valid inputs', () => {
//     // post a question
//     let qId;
//     beforeAll((done) => {
//       Request({ url: 'http://localhost:4001/v2/questions/', method: 'POST', json: questionInput }, (error, response, body) => {
//         qId = body.id;
//         done();
//       });
//     });
//     // get the question
//     beforeAll((done) => {
//       Request.get(`http://localhost:4001/v2/questions/${qId}`, (error, response, body) => {
//         data.status = response.statusCode;
//         data.question = JSON.parse(body).question;
//         done();
//       });
//     });

//     it('has a status of 201', () => {
//       expect(data.status).toBe(201);
//     });

//     it('has expected body', () => {
//       expect(data.question.title).toBe(questionInput.title);
//       expect(data.question.body).toBe(questionInput.body);
//       expect(data.question.username).toBe(questionInput.username);
//     });
//   });
// });
