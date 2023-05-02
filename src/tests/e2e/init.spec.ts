import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app';
import { Done } from 'mocha';

chai.use(chaiHttp);

describe('GET /', () => {
  it('should return a welcome message', (done: Done) => {
    chai
      .request(app)
      .get('/')
      .end((_err, res: ChaiHttp.Response) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('Welcome to the API!');
        done();
      });
  });
});
