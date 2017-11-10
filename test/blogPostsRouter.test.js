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

      it('should add a post on POST', function() {
          const newItem = {
              title: 'A Day in the Fall',
              content: 'I love the fall.' + ' ' + 'It is great.' + ' ' + 'Best season ever.',
              author: 'Carly S',
              publishDate: 'Nov 9 2017'
             };
          return chai.request(app)
             .post('/blog-posts')
             .send(newItem)
             .then(function(res) {
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.include.keys('title', 'content', 'author');
                res.body.id.should.not.be.null;
                res.body.should.deep.equal(Object.assign(newItem, {id: res.body.id}));
             });
      });

      it('should update posts on PUT', function() {
        const updateData = {
          title: 'Foo',
          content: 'Lorem ipsum doler sit amet. ' + 'Suscipit tellus mauris a diam. ' + 'Augue mauris augue neque gravida.',
          author: 'Bob White',
          publishDate: "Nov 9 2017"
        };
    
        return chai.request(app)
          .get('/blog-posts')
          .then(function(res) {
            updateData.id = res.body[0].id;
            return chai.request(app)
              .put(`/blog-posts/${updateData.id}`)
              .send(updateData);
          })
          .then(function(res) {
            res.should.have.status(204);
          });
      });
    
      it('should delete posts on DELETE', function() {
        return chai.request(app)
          .get('/blog-posts')
          .then(function(res) {
            return chai.request(app)
              .delete(`/blog-posts/${res.body[0].id}`);
          })
          .then(function(res) {
            res.should.have.status(204);
          });
      });
});
