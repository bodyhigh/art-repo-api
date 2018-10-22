// import authController from '../../app/controllers/auth.controller';
import request from 'supertest-as-promised';
import { expect } from 'chai';
import httpStatus from 'http-status';
import app from '../../server'

import util from 'util';

describe('## ROUTE/AUTH ##', function()  {
    var insertedUser;

    describe('POST: /api/register', function() {
        it('POST: /api/register - Should create a new user with hashed password', (done) => {
            const newUser = {
                firstName: 'Niccolai',
                lastName: 'Dobbs',
                email: 'nickydobbs@fakefakefake.com',
                password: 'password'
            };
    
            request(app)
                .post('/api/auth/register')
                .send(newUser)
                .expect(httpStatus.OK)
                .then((res) => {
                    // console.log(util.inspect(res.body));
                    insertedUser = res.body;
                    expect(res.body.email).to.equal(newUser.email);
                    expect(res.body.firstName).to.equal(newUser.firstName);
                    expect(res.body.lastName).to.equal(newUser.lastName);
                    expect(res.body.password).to.not.equal(newUser.password); // clear vs. hashed
                    done();
                });
        });
    
        it('Should not allow me to create a duplicate user (email unique)', (done) => {
            const newUser = {
                firstName: 'Niccolai',
                lastName: 'Dobbs',
                email: 'nickydobbs@fakefakefake.com',
                password: 'password'
            };
    
            request(app)
                .post('/api/auth/register')
                .send(newUser)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.success).to.be.false;
                    expect(res.body.errorCode).to.be.equal('DUPLICATE_EMAIL');
                    done();
                })
                .catch(done);
        });
    });

    describe('/api/auth/login', function() {
        it('Should successfully log in', function(done) {
            request(app)
                .post('/api/auth/login')
                .send({ email: insertedUser.email, password: 'password' })
                .expect(httpStatus.OK)
                .then((res) => {
                    // console.log(util.inspect(insertedUser));
                    expect(res.body.success).to.be.true;
                    expect(res.body.userId).to.equal(insertedUser._id);
                    expect(res.body.firstName).to.equal(insertedUser.firstName);
                    expect(res.body.lastName).to.equal(insertedUser.lastName);
                    done();
                })
                .catch(done);
        });

        it('Should fail when provided incorrect password', function(done) {
            request(app)
                .post('/api/auth/login')
                .send({ email: insertedUser.email, password: 'not_a_valid_password' })
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.success).to.be.false;
                    expect(res.body.errorCode).to.be.equal('INVALID_CREDENTIALS');
                    done();
                })
                .catch(done);
        });

        it('Should fail when provided incorrect email', function(done) {            
            request(app)
                .post('/api/auth/login')
                .send({ email: 'not_a_valid_email', password: 'not_a_valid_password' })
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.success).to.be.false;
                    expect(res.body.errorCode).to.be.equal('INVALID_CREDENTIALS');
                    done();
                })
                .catch(done);
        });
    });
});