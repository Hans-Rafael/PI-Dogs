/* eslint-disable import/no-extraneous-dependencies */
const { expect } = require('chai');
const session = require('supertest-session');
const app = require('../../src/app.js');
const { Dog, Temperament, conn } = require('../../src/db.js');

const agent = session(app);
const dog = {
  id: "201",
  name: 'Pug',

  Height: '25 - 30',

  Weight: '6 - 8',

  lifeExp: "10 - 12 ",

  Temperament: 'docile, clever, charming, stubborn, sociable, playful, quiet, attentive',


};

describe('DogsPI routes', () => {
  before(() => conn.authenticate()
    .catch((err) => {
      console.error('Unable to connect to the database:', err);
    }));
  beforeEach(() => Dog.sync({ force: true })
    .then(() => Dog.create(dog)));

  describe('/dogs', function(){
    return agent
      .get('/dogs')
      .expect(function(res){
        expect(res.status).equal(200)})
  });
});

describe('/dogs?name=', function () {
  it('GET response status 200 if dog is found', function () {
    return agent
      .get('/dogs?name=Pug')
      .expect(function (res) {
        expect(res.status).equal(200)
      });
  });
})
describe('/dogs/:id', function () {
  it('should response status 200 by it id', function () {
    return agent
      .get('/dogs/201')
      .expect(function (res) {
        expect(res.status).equal(200)
      });
  })
})
describe('/temperaments', function () {
  it('expets status 200 ', function () {
    return agent
      .get('/temperaments')
      .expect(function (res) {
        expect(res.status).equal(200)
      });
  })
})