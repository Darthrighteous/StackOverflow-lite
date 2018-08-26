import Request from 'request';
import '../../app';
import {
  updateScorePlus,
  updateScoreMinus,
  invalidUpdateScore,
  updateTitle,
  updateBody,
  invalidUpdate,
  validId,
} from '../testUtils';

describe('PATCH ROUTE', () => {
// PATCH ACCEPT AN ANSWER
  describe('to accept an answer that doesnt exist', () => {
    const data = {};
    beforeAll((done) => {
      Request.patch('http://localhost:4001/v1/questions/1/answers/1', (error, response, body) => {
        data.status = response.statusCode;
        data.body = body;
        done();
      });
    });

    it('has status 404', () => {
      expect(data.status).toBe(404); // not found
    });

    it('has a body of', () => {
      expect(data.body).toBe('answer with id= 1, to question with id= 1 not found');
    });
  });

  // UPDATE score: increment QUESTION SCORE
  describe('to increment a question\'s score', () => {
    const dataScorePlus = {};
    beforeAll((done) => {
      Request({ url: `http://localhost:4001/v1/questions/${validId}`, method: 'PATCH', json: updateScorePlus }, (error, response, body) => {
        dataScorePlus.status = response.statusCode;
        dataScorePlus.update = body.update;
        done();
      });
    });

    afterAll((done) => {
      Request({ url: `http://localhost:4001/v1/questions/${validId}`, method: 'PATCH', json: updateScoreMinus }, (error, response, body) => {
        done();
      });
    });

    it('has correct status code', () => {
      expect(dataScorePlus.status).toBe(200);
    });

    it('has updated properly', () => {
      // increment
      expect(Number(dataScorePlus.update.score)).toBe(1);
    });
  });

  // UPDATE score: decrement QUESTION SCORE
  describe('to decrement question\'s score', () => {
    const dataScoreMinus = {};
    beforeAll((done) => {
      Request({ url: `http://localhost:4001/v1/questions/${validId}`, method: 'PATCH', json: updateScoreMinus }, (error, response, body) => {
        dataScoreMinus.status = response.statusCode;
        dataScoreMinus.update = body.update;
        done();
      });
    });

    afterAll((done) => {
      Request({ url: `http://localhost:4001/v1/questions/${validId}`, method: 'PATCH', json: updateScorePlus }, (error, response, body) => {
        done();
      });
    });

    it('has correct status code', () => {
      expect(dataScoreMinus.status).toBe(200);
    });

    it('has updated properly', () => {
      // decrement
      expect(Number(dataScoreMinus.update.score)).toBe(-1);
    });
  });

  // UPDATE score with INVALID VALUE
  describe('to update question score with an invalid input', () => {
    const dataScorePlus = {};
    beforeAll((done) => {
      Request({ url: `http://localhost:4001/v1/questions/${validId}`, method: 'PATCH', json: invalidUpdateScore }, (error, response, body) => {
        dataScorePlus.status = response.statusCode;
        dataScorePlus.body = body;
        done();
      });
    });

    it('has correct status code', () => {
      expect(dataScorePlus.status).toBe(400);
    });

    it('has correct error message', () => {
      expect(dataScorePlus.body).toBe('Invalid update request');
    });
  });

  // UPDATE QUESTION BODY
  describe('to update the body of a question', () => {
    const dataBody = {};
    beforeAll((done) => {
      Request({ url: `http://localhost:4001/v1/questions/${3}`, method: 'PATCH', json: updateBody }, (error, response, body) => {
        dataBody.status = response.statusCode;
        dataBody.update = body.update;
        done();
      });
    });

    it('has correct status code', () => {
      expect(dataBody.status).toBe(200);
    });

    it('has updated properly', () => {
      // update Body
      expect(dataBody.update.body).toBe(updateBody.value);
    });
  });

  // UPDATE QUESTION TITLE
  describe('to update the title of a question', () => {
    const dataTitle = {};
    beforeAll((done) => {
      Request({ url: `http://localhost:4001/v1/questions/${3}`, method: 'PATCH', json: updateTitle }, (error, response, body) => {
        dataTitle.status = response.statusCode;
        dataTitle.update = body.update;
        done();
      });
    });

    it('has correct status code', () => {
      expect(dataTitle.status).toBe(200);
    });

    it('has updated properly', () => {
      // update Title
      expect(dataTitle.update.title).toBe(updateTitle.value);
    });
  });

  // UPDATE QUESTION WITH INVALID INPUTS
  describe('to update a question with invalid inputs', () => {
    const dataTitle = {};
    beforeAll((done) => {
      Request({ url: `http://localhost:4001/v1/questions/${3}`, method: 'PATCH', json: invalidUpdate }, (error, response, body) => {
        dataTitle.status = response.statusCode;
        dataTitle.update = body.update;
        done();
      });
    });

    it('has status correct status code', () => {
      expect(dataTitle.status).toBe(400);
    });

    it('has no update', () => {
      expect(dataTitle.update).toBe(undefined);
    });
  });
});
