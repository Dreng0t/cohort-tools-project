// test/test.mjs
import * as chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app.js';

const { assert } = chai;
chai.use(chaiHttp);


describe('Integration Test', () => {
  it('Gets random number from endpoint', (done) => {
    chai
      .request(app)
      .get('/')
      .end((err, res) => {
        assert.equal(res.statusCode, 200);
        assert.isNotNull(res.body.number);
        assert.isNumber(res.body.number);
        assert.isAtLeast(res.body.number, 0);
        assert.isAtMost(res.body.number, 100);
        done();
      });
  });
});