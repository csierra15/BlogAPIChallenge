const chai = require('chai');
const chaiHttp = require('chai-Http');

const {app, runServer, closeServer} = require('../server');

const should = chai.should();

chai.use(chaiHttp);

describe('blog-posts', function() {
    before(function() {
        return runServer();
      });
    
      after(function() {
        return closeServer();
      });

      it('should list blog posts on GET', function() {
        return chai.request(app)
            .get('/blog-posts')
            .then(function(res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.length.should.be.above(0);
                res.body.forEach(function(item) {
                    item.should.be.a('object');
                    item.should.have.all.keys(
                        'id', 'title', 'content', 'author', 'publishDate');
                });
            });
      });
})
