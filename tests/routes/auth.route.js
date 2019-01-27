import request from 'supertest-as-promised';
import { expect } from 'chai';
import httpStatus from 'http-status';
import app from '../../server'
import User from '../../app/models/user.model';
import { sampleFullUser } from '../sample-data/user.sample';
import util, { log } from 'util';

describe('## ROUTE/AUTH ##', function()  {
    var insertedUser;
    var newUser = {
        firstName: 'Niccolai',
        lastName: 'Dobbs',
        email: 'nickydobbs@fakefakefake.com',
        password: 'password',
        passwordConfirm: 'password'
    };

    before(function(done) {
        const newUsers = [new User(sampleFullUser), new User(sampleFullUser), new User(sampleFullUser)];
        newUsers[0].email = 'not_a_duplicate_0@fakeemail.com';
        newUsers[1].email = 'not_a_duplicate_1@fakeemail.com';
        newUsers[2].email = 'not_a_duplicate_2@fakeemail.com';

        User.deleteMany({}).exec()
            .then(() => {
                User.create(newUsers)
                    .then((results) => {
                        expect(results).to.have.length(3);
                        done();
                    });
            })
            .catch(done);
    });

    describe('POST: /api/auth/register', function() {
        it('Should fail request validation if first name is empty', (done) => {
            const tempUser = { ...newUser };
            tempUser.firstName = '';
    
            request(app)
                .post('/api/auth/register')
                .send(tempUser)
                .expect(httpStatus.BAD_REQUEST)
                .then((res) => {
                    // console.log(util.inspect(res.body, { colors: true}));
                    expect(res.body.errors[0].errorCode).to.be.equal('INVALID_REQUEST_PARAMETERS');
                    expect(res.body.errors[1].param).to.be.equal('firstName');
                    done();
                })
                .catch(done);
        });

        it('Should fail request validation if last name is empty', (done) => {
            const tempUser = { ...newUser };
            tempUser.lastName = '';
    
            request(app)
                .post('/api/auth/register')
                .send(tempUser)
                .expect(httpStatus.BAD_REQUEST)
                .then((res) => {
                    expect(res.body.errors[0].errorCode).to.be.equal('INVALID_REQUEST_PARAMETERS');
                    expect(res.body.errors[1].param).to.be.equal('lastName');
                    done();
                })
                .catch(done);
        });

        it('Should fail request validation if email is empty', (done) => {
            const tempUser = { ...newUser };
            tempUser.email = '';
    
            request(app)
                .post('/api/auth/register')
                .send(tempUser)
                .expect(httpStatus.BAD_REQUEST)
                .then((res) => {
                    expect(res.body.errors[0].errorCode).to.be.equal('INVALID_REQUEST_PARAMETERS');
                    expect(res.body.errors[1].param).to.be.equal('email');
                    done();
                })
                .catch(done);
        });

        it('Should fail request validation if password is empty', (done) => {
            const tempUser = { ...newUser };
            tempUser.password = '';
    
            request(app)
                .post('/api/auth/register')
                .send(tempUser)
                .expect(httpStatus.BAD_REQUEST)
                .then((res) => {
                    expect(res.body.errors[0].errorCode).to.be.equal('INVALID_REQUEST_PARAMETERS');
                    expect(res.body.errors[1].param).to.be.equal('password');
                    done();
                })
                .catch(done);
        });

        it('Should create a new user with hashed password', (done) => {    
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
            request(app)
                .post('/api/auth/register')
                .send(newUser)
                .expect(httpStatus.INTERNAL_SERVER_ERROR)
                .then((res) => {
                    expect(res.body.errors[0].errorCode).to.be.equal('REGISTER_DUPLICATE_EMAIL');
                    done();
                })
                .catch(done);
        });
    });

    describe('POST: /api/auth/login', function() {
        it('Should successfully log in', function(done) {
            request(app)
                .post('/api/auth/login')
                .send({ email: insertedUser.email, password: 'password' })
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.success).to.be.true;
                    expect(res.body.token).to.not.be.undefined;
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
                .expect(httpStatus.INTERNAL_SERVER_ERROR)
                .then((res) => {
                    // console.log(util.inspect(res.body, { colors: true}));
                    expect(res.body.errors[0].errorCode).to.be.equal('INVALID_CREDENTIALS');
                    done();
                })
                .catch(done);
        });

        it('Should fail parameter validation when parameters are missing', function(done) {            
            request(app)
                .post('/api/auth/login')
                .send({ foo: 'bar' })
                .expect(httpStatus.BAD_REQUEST)
                .then((res) => {
                    expect(res.body.errors[0].errorCode).to.be.equal('INVALID_REQUEST_PARAMETERS');
                    expect(res.body.errors[1].param).to.be.equal('email');
                    expect(res.body.errors[2].param).to.be.equal('password');
                    done();
                })
                .catch(done);
        });

        it('Should fail parameter validation when provided incorrect email type', function(done) {            
            request(app)
                .post('/api/auth/login')
                .send({ email: 'not_a_valid_email', password: 'not_a_valid_password' })
                .expect(httpStatus.BAD_REQUEST)
                .then((res) => {
                    expect(res.body.errors[0].errorCode).to.be.equal('INVALID_REQUEST_PARAMETERS');
                    expect(res.body.errors[1].param).to.be.equal('email');
                    expect(res.body.errors[1].msg).to.be.equal('Invalid value');
                    done();
                })
                .catch(done);
        });

        it('Should fail parameter validation password does not meet min length', function(done) {            
            request(app)
                .post('/api/auth/login')
                .send({ email: 'not_a_valid_email', password: '1234567' })
                .expect(httpStatus.BAD_REQUEST)
                .then((res) => {
                    expect(res.body.errors[0].errorCode).to.be.equal('INVALID_REQUEST_PARAMETERS');
                    expect(res.body.errors[1].param).to.be.equal('email');
                    expect(res.body.errors[1].msg).to.be.equal('Invalid value');
                    expect(res.body.errors[2].param).to.be.equal('password');
                    done();
                })
                .catch(done);
        });

    });
});