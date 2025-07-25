const chai = require('chai');
const assert = chai.assert;

const server = require('../server');

const chaiHttp = require('chai-http');
chai.use(chaiHttp);

suite('Functional Tests', function () {
  this.timeout(5000);
  suite('Integration tests with chai-http', function () {
    // #1
    test('Test GET /hello with no name', function (done) {
      chai
        .request(server)
        .keepOpen()
        .get('/hello')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'hello Guest');
          done();
        });
    });
    // #2
    test('Test GET /hello with your name', function (done) {
      chai
        .request(server)
        .keepOpen()
        .get('/hello?name=xy_z')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'hello xy_z');
          done();
        });
    });
    // #3
    test('Send {surname: "Colombo"}', function (done) {
      chai
        .request(server)
        .keepOpen()
        .put('/travellers')
      .send({surname: "Colombo"})
        .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'text/html');
        assert.include(res.text, 'Colombo');
          done();
        });
    });
    // #4
    test('Send {surname: "da Verrazzano"}', function (done) {
      chai
        .request(server)
        .keepOpen()
        .put('/travellers')
        .send({surname: "da Verrazzano"})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'text/html');
          assert.include(res.text, 'da Verrazzano');
          done();
        });
      done();
    });
  });
});

const Browser = require('zombie');

suite('Functional Tests with Zombie.js', function () {
  this.timeout(5000);


  const browser = new Browser();
  suite('Headless browser', function () {
    suiteSetup(function(done) {
      return browser.visit('/', done);
    });

    test('should have a working "site" property', function() {
      assert.isNotNull(browser.site);
    });
  });

  suite('"Famous Italian Explorers" form', function () {
    // #5
    test('Submit the surname "Colombo" in the HTML form', function (done) {
      browser.fill('surname', 'Colombo').then(() => {
        return browser.pressButton('submit');
      }).then(() => {
        assert.include(browser.text(), 'Colombo');
        done();
      }).catch(done);
      done();
    });
    // #6
    test('Submit the surname "Vespucci" in the HTML form', function (done) {
      browser.fill('surname', 'Vespucci').then(() => {
        return browser.pressButton('submit');
      }).then(() => {
        assert.include(browser.text(), 'Vespucci');
        done();
      }).catch(done);
      done();
    });
  });
});
