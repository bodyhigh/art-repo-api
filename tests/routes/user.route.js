import request from 'supertest-as-promised';
import { expect } from 'chai';
import httpStatus from 'http-status';
import jwtHelper from '../../app/helpers/jwtToken';
import app from '../../server'
import User from '../../app/models/user.model';
import { sampleFullUser } from '../sample-data/user.sample';
import util, { log } from 'util';

var token = jwtHelper.createToken(sampleFullUser);

describe('## ROUTE/USER ##', function()  {
    before(function(done) {
        const newUsers = [new User(sampleFullUser), new User(sampleFullUser), new User(sampleFullUser)];
        newUsers[0].email = 'not_a_duplicate_0@fakeemail.com';
        newUsers[1].email = 'not_a_duplicate_1@fakeemail.com';
        newUsers[2].email = 'not_a_duplicate_2@fakeemail.com';

        User.deleteMany({}).exec()
            .then(() => {
                User.create(newUsers)
                    .then((res) => {
                        expect(res).to.have.length(3);
                        done();
                    });
            })
            .catch(done);
    });

    describe('GET: /api/user', function() {
        it('Should return back the correct number of user records', function(done) {
            // console.log(util.inspect(token, { colors: true }));
            request(app)
                .get('/api/user')
                .set('Authorization', `bearer ${token}`)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body).to.have.length(3);
                    done();
                })
                .catch(done);
        });
    });
});