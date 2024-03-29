process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const request = require('supertest');

const app = require('../../../app.js');
const conn = require('../../../db/index.js');

describe('POST /', () => {
    before((done) => {
        conn.connect()
            .then(() => done())
            .catch((err) => done(err));
    })

    after((done) => {
        conn.close()
            .then(() => done())
            .catch((err) => done(err));
    })

    it('OK, added a new crypto', (done) => {
        request(app).post('/')
            .send({ name: 'NOTE', text: "AAA" })
            .then((res) => {
                const body = res.body;
                expect(body).to.contain.property('_id');
                expect(body).to.contain.property('name');
                expect(body).to.contain.property('text');
                expect(body).to.contain.property('text');
                expect(body).to.contain.property('text');
                expect(body).to.contain.property('text');
                expect(body).to.contain.property('text');
                expect(body).to.contain.property('text');
                expect(body).to.contain.property('text');
                expect(body).to.contain.property('text');
                expect(body).to.contain.property('text');
                expect(body).to.contain.property('text');
                expect(body).to.contain.property('text');
                expect(body).to.contain.property('text');
                expect(body).to.contain.property('text');
                expect(body).to.contain.property('text');
                expect(body).to.contain.property('text');
                expect(body).to.contain.property('text');
                expect(body).to.contain.property('text');
                done();
            })
            .catch((err) => done(err));
    });
})