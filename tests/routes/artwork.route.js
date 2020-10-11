import mongoose from 'mongoose';
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
                                newArtwork.push({...artItem, ...{ artistId: seededUser.id }});
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
                .field('title', 'Fail City')
                .field('description', 'Fail City')
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
                title: "Munch's The Scream",
                description: "a composition created by Norwegian Expressionist artist Edvard Munch in 1893 <script>alert('boo');</script>"
            };

            request(app)
                .post('/api/artwork')
                .set('Authorization', `bearer ${token}`)
                .field('title', newArtwork.title)
                .field('description', newArtwork.description)
                .expect(httpStatus.OK)
                .then((res) => {
                    console.log(util.inspect(res.body.error, { color: true}));
                    expect(res.body.title).to.be.equal(newArtwork.title);
                    expect(res.body.description).to.be.equal(newArtwork.description);
                    done();
                })
                .catch(err => {
                    console.log(util.inspect(err, { colors: true}));
                    done(err);
                });
                // .catch(done);
        });
    });

    describe('GET: /api/artwork', function() {
        it('Should return all artwork for the current logged in artist', (done) => {
            request(app)
                .get('/api/artwork')
                .set('Authorization', `bearer ${token}`)
                .expect(httpStatus.OK)
                .then((res) => {
                    // console.log(util.inspect(res.body, { colors: true }));
                    expect(res.body.data.length).to.be.equal(5); //4 from seeded + 1 from 'POST' unit test
                    expect(res.body.totalCount).to.be.equal(5); 
                    done();
                })
                .catch(done);            
        });
    });

    describe('GET: /api/artwork/:id', () => {
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

    describe('PATCH: /api/artwork/:id', () => {
        it('Should fail route validation if required fields are missing', (done) => {
            const updatedRecord = {
                id: seededArtwork[0].id,
                // Missing Title
                description: 'Updated Description'
            };

            request(app)
                .patch(`/api/artwork/${seededArtwork[0].id}`)
                .set('Authorization', `bearer ${token}`)
                .send(updatedRecord)
                .expect(httpStatus.BAD_REQUEST)
                .then((res) => {
                    // console.log(util.inspect(res.body.errors, { colors: true}));
                    expect(res.body.errors[0].errorCode).to.be.equal('INVALID_REQUEST_PARAMETERS');
                    expect(res.body.errors[1].param).to.be.equal('title');
                    done();
                })
                .catch(done);
        });

        it('Should fail route validation if fields do not meet min length requirements', (done) => {
            const updatedRecord = seededArtwork[0];
            updatedRecord.title = 'HI';
            updatedRecord.description = 'BE';

            request(app)
                .patch(`/api/artwork/${seededArtwork[0].id}`)
                .set('Authorization', `bearer ${token}`)
                .send(updatedRecord)
                .expect(httpStatus.BAD_REQUEST)
                .then((res) => {
                    expect(res.body.errors.length).to.be.equal(3);
                    expect(res.body.errors[0].errorCode).to.be.equal('INVALID_REQUEST_PARAMETERS');

                    expect(res.body.errors[1].param).to.be.equal('title');
                    expect(res.body.errors[1].msg).to.be.equal('must be at least 3 chars long');

                    expect(res.body.errors[2].param).to.be.equal('description');
                    expect(res.body.errors[2].msg).to.be.equal('must be at least 3 chars long');
                    done();
                })
                .catch(done);
        });

        it('Should successfully update a record', (done) => {
            const updatedRecord = seededArtwork[0];
            updatedRecord.title = 'Updated Title';
            updatedRecord.description = 'Updated Description.';

            request(app)
                .patch(`/api/artwork/${seededArtwork[0].id}`)
                .set('Authorization', `bearer ${token}`)
                .field('_id', updatedRecord.id)
                .field('title', updatedRecord.title)
                .field('description', updatedRecord.description)
                .expect(httpStatus.OK)   
                .then((res) => {
                    expect(res.body._id).to.be.equal(updatedRecord.id);
                    expect(res.body.title).to.be.equal(updatedRecord.title);
                    expect(res.body.description).to.be.equal(updatedRecord.description);
                    done();
                })
                .catch(done);
        });
    });

    describe('Delete: /api/artwork/:id', () => {
        it('Should fail [LoadAndValidateOwnership] middleware if current user is not the artwork owner', (done) => {
            const newRecord = new Artwork({
                title: 'Delete Me',
                description: 'Delete this record',
                artistId: mongoose.Types.ObjectId()
            });

            newRecord.save()
                .then(testRecord => {
                    request(app)
                        .delete(`/api/artwork/${testRecord._id}`)
                        .set('Authorization', `bearer ${token}`)
                        .expect(httpStatus.UNAUTHORIZED)
                        .then(result => {
                            done();
                        }).catch(done);
                }).catch(done);
        });

        it('Should successfully delete a record', (done) => {
            const newRecord = new Artwork({
                title: 'Delete Me 2',
                description: 'Delete this record 2',
                artistId: seededUser.id
            });

            newRecord.save()
                .then(testRecord => {
                    // console.log(util.inspect(testRecord, { colors: true}));
                    request(app)
                        .delete(`/api/artwork/${testRecord._id}`)
                        .set('Authorization', `bearer ${token}`)
                        .expect(httpStatus.OK)
                        .then(result => {
                            // console.log(util.inspect(result.res.text, { colors: true}));
                            done();
                        })
                        .catch(err => {
                            console.log(util.inspect(err, { colors: true }));
                            done(err);
                        });
                        //.catch(done);
                }).catch(done);
        });
    });

});