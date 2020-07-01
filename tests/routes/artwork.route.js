// import mongoose from 'mongoose';
import request from 'supertest-as-promised';
import { expect } from 'chai';
import httpStatus from 'http-status';
import jwtHelper from '../../app/helpers/jwtToken';
import app from '../../server'
import User from '../../app/models/user.model';
import Artwork from '../../app/models/artwork.model';
import { sampleFullUser } from '../sample-data/user.sample';
import util, { log } from 'util';
import mongoose from 'mongoose';

var token = jwtHelper.createToken(sampleFullUser);
var seededUser;

describe('## ROUTE/ARTWORK ##', function() {
    before(function(done) {        
        Artwork.deleteMany({}).exec()
            .then(() => {
                User.deleteMany({}).exec()
                .then(() => {
                    User.create(sampleFullUser)
                        .then((results) => {
                            seededUser = results;
                            done();
                        });
                })
                .catch(done);
            })
            .catch(done);
    });

    describe('POST: /api/artwork', function() {
        it('Should pass if not missing required fields', done => {
            const newArtwork = {
                title: 'Artwork Title 1',
                artistId: mongoose.Types.ObjectId()
            };

            //TODO: We should have access to the current user's id to pass as the artistid

            request(app)
                .post('/api/artwork')
                .set('Authorization', `bearer ${token}`)
                .send(newArtwork)
                .expect(httpStatus.OK)
                .then((res) => {
                    let insertedArtwork = res.body;
                    // console.log(util.inspect(insertedArtwork, { colors: true }));
                    expect(res.body.title).to.equal(insertedArtwork.title);
                    // expect(res.body.artistId).to.equal(insertedArtwork.artistId);
                    done();
                })
                .catch(done);
        });
    });
});