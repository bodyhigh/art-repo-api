// import mongoose from 'mongoose';
import request from 'supertest-as-promised';
import { expect } from 'chai';
import httpStatus from 'http-status';
import jwtHelper from '../../app/helpers/jwtToken';
import app from '../../server'
import User from '../../app/models/user.model';
import Artwork from '../../app/models/artwork.model';
import { sampleFullUser } from '../sample-data/user.sample';
import { sampleArtwork } from '../sample-data/artwork.sample';
import util, { log } from 'util';
import mongoose from 'mongoose';

var token;
var seededUser;
var seededArtwork;

describe('## ROUTE/ARTWORK ##', function() {
    before(function(done) {        
        Artwork.deleteMany({}).exec()
            .then(() => {
                User.deleteMany({}).exec()
                .then(() => {
                    User.create(sampleFullUser)
                        .then((results) => {
                            seededUser = results;
                            token = jwtHelper.createToken(seededUser);

                            //Add Artwork
                            const newArtwork = [];
                            sampleArtwork.forEach(artItem => {
                                newArtwork.push({...artItem, ...{artistId: seededUser.id}});
                            });
                            
                            Artwork.create(newArtwork)
                                .then((results) => {
                                    // console.log(util.inspect(results, { colors: true}));
                                    seededArtwork = results;
                                    done();
                                })
                                .catch(done);
                        })
                        .catch(done);
                })
                .catch(done);
            })
            .catch(done);
    });

    describe('POST: /api/artwork', function() {
        it('Should fail if no JWT token is found', done => {
            const newArtwork = {};

            request(app)
                .post('/api/artwork')
                .send(newArtwork)
                .expect(httpStatus.UNAUTHORIZED)
                .then((res) => {
                    expect(res.body.errors[0].errorCode).to.be.equal('CREDENTIALS_REQUIRED');
                    done();
                })
                .catch(done);
        });

        it('Should fail route validation if missing required fields', done => {
            const newArtwork = {};

            request(app)
                .post('/api/artwork')
                .set('Authorization', `bearer ${token}`)
                .send(newArtwork)
                .expect(httpStatus.BAD_REQUEST)
                .then((res) => {
                    expect(res.body.errors[0].errorCode).to.be.equal('INVALID_REQUEST_PARAMETERS');
                    expect(res.body.errors[1].param).to.be.equal('title');
                    done();
                })
                .catch(done);
        });

        it('Should pass if data is valid', done => {
            const newArtwork = { 
                title: 'The Scream',
                description: 'a composition created by Norwegian Expressionist artist Edvard Munch in 1893'
            };

            request(app)
                .post('/api/artwork')
                .set('Authorization', `bearer ${token}`)
                .send(newArtwork)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.title).to.be.equal(newArtwork.title);
                    done();
                })
                .catch(done);
        });
    });

    describe('GET: /api/artwork', function() {
        it('Should return all artwork for the current logged in artist', (done) => {
            request(app)
                .get('/api/artwork')
                .set('Authorization', `bearer ${token}`)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.length).to.be.equal(5); //4 from seeded + 1 from 'POST' unit test
                    done();
                })
                .catch(done);            
        });
    });

    describe('GET: /api/artowrk/:id', () => {
        it('Should validate that a token is present containing a JWT token', (done) => {
            // console.log(util.inspect(results, { colors: true}));
            request(app)
                .get(`/api/artwork/${seededArtwork[0].id}`)
                .expect(httpStatus.UNAUTHORIZED)
                .then((res) => {
                    expect(res.body.errors[0].errorCode).to.be.equal('CREDENTIALS_REQUIRED');
                    done();
                })
                .catch(done);
        });

        it('Should return a record given a valid id', (done) => {
            request(app)
            .get(`/api/artwork/${seededArtwork[0].id}`)
            .set('Authorization', `bearer ${token}`)
            .expect(httpStatus.OK)
            .then((res) => {
                expect(res.body.title).to.be.equal(seededArtwork[0].title);
                done();
            })
            .catch(done);
        });
    });
});