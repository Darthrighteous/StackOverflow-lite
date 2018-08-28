import Request from 'request';

describe('DELETE ROUTE', () => {
// DELETE A QUESTION
  describe('for a valid question', () => {
    const data = {};
    beforeAll((done) => {
      Request.delete('http://localhost:4001/v1/questions/4', (error, response, body) => {
        data.status = response.statusCode;
        data.body = body;
        done();
      });
    });

    it('has respose code of 204', () => {
      expect(data.status).toBe(204);
    });

    it('has no body', () => {
      expect(data.body).toBe('');
    });
  });
});
