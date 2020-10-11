import mongoose from 'mongoose';
import User from '../../app/models/user.model';
import Client from '../../app/models/client.model';
import { expect } from 'chai';
import { sampleBasicUser, sampleFullUser } from '../sample-data/user.sample';
import { sampleClientBasicRef, sampleFullClient, sampleFullClientList } from '../sample-data/client.sample'
import util from 'util';

describe('## MODEL/USER ##', function()  {
    var seedFullUser;
    var savedFullUser;

    before(function(done) {
        const newUsers = [new User(sampleFullUser), new User(sampleFullUser), new User(sampleFullUser)];
        newUsers[0].email = 'not_a_duplicate_0@fakeemail.com';
        newUsers[1].email = 'not_a_duplicate_1@fakeemail.com';
        newUsers[2].email = 'not_a_duplicate_2@fakeemail.com';

        User.deleteMany({}).exec()
            .then(() => {
                User.create(newUsers)
                    .then((results) => {
                        seedFullUser = results[0];
                        expect(results).to.have.length(3);
                        done();
                    });
            })
            .catch(done);
    });

    after(function() {
        return User.deleteMany({});
    });

    describe('Field Validation', function()  {
        it('Should fail if missing required fields', function(done)  {
            const newUser = new User({});
            newUser.validate((err) => {
                // console.log('---------------------------------------------');                
                // console.log(util.inspect(Object.keys(err.errors), {colors: true }));
                // console.log(util.inspect(err.errors, {colors: true }));
                // console.log('---------------------------------------------');
                expect(err.errors.firstName.kind).to.be.equal('required');
                expect(err.errors.lastName.kind).to.be.equal('required');
                expect(err.errors.email.kind).to.be.equal('required');
                expect(err.errors.password.kind).to.be.equal('required');
                expect(err.errors.roles.message).to.be.equal('required');
                expect(err.errors.accountStatus.kind).to.be.equal('required');
                done();
            });
        });

        it('[accountStatus] - Should fail when provided an invalid accountStatus', function(done)  {
            const newUser = new User(sampleBasicUser);
            newUser.accountStatus = 'foo';

            newUser.validate((err) => {
                expect(err.errors.accountStatus.name).to.be.equal('ValidatorError');
                done();
            });
        });

        it('[accountStatus] - Should pass when provided a valid accountStatus', function(done)  {
            const newUser = new User(sampleBasicUser);

            newUser.validate(done);
        });

        it('[clients] - Should fail if Client record is invalid', function(done)  {
            const badCients = { clients: [{ field1: 'foo' }], clientRefs: [{ field1: 'Foo' }] };
            const newUser = new User({...sampleBasicUser, ...badCients });

            newUser.validate((err) => {
                // clients
                expect(err.errors['clients.0.clientId'].kind).to.be.equal('required');
                expect(err.errors['clients.0.firstName'].kind).to.be.equal('required');
                expect(err.errors['clients.0.lastName'].kind).to.be.equal('required');

                // clientRefs
                expect(err.errors.clientRefs.name).to.be.equal('CastError');

                // // # of errors
                // console.log(util.inspect(err.errors, { colors: true }));
                // expect(Object.keys(err.errors).length).to.be.equal(4);
                done();
            });
        });

        it('[clients] - Should pass when provided a valid clients', function(done)  {
            const newClients = { clients: [sampleClientBasicRef, sampleClientBasicRef] };
            const newUser = new User({...sampleBasicUser, ...newClients});

            newUser.validate(done);
        });

        it('[roles] - Should fail validation of a invalid role exists', function(done)  {
            const newUser = new User({...sampleBasicUser});
            newUser.roles = ['admin', 'boogeyman'];

            newUser.validate((err) => {
                expect(err.errors['roles.1'].kind).to.be.equal('enum');
                done();
            });
        });

        it('[artwork] - Should pass when provided a valid records', function(done)  {
            const newUser = new User({...sampleBasicUser});

            newUser.validate(done);
        });
    });

    describe('Save Record', function(done)  {
        it('Should successfully save Client', function(done)  {
            Client.create(sampleFullClientList)
                .then((savedClients) => {
                    const newUser = new User(sampleFullUser);
                    newUser.clientRefs = savedClients;

                    newUser.save()
                        .then(savedUser => {
                            savedFullUser = savedUser;
                            expect(savedUser.firstName).to.be.equal(sampleFullUser.firstName);
                            expect(savedUser.lastName).to.be.equal(sampleFullUser.lastName);
                            expect(savedUser.addresses).to.be.an('array').to.have.lengthOf(2);
                            expect(savedUser.clients).to.be.an('array').to.have.lengthOf(2);
                            expect(savedUser.clientRefs).to.be.an('array').to.have.lengthOf(3);
                            done();
                        })
                })
                .catch(done);
        });
    });

    describe('Method Tests', function()  {
        it('[get] - Should not return a result if Id is not found', function() {
            return User.get(mongoose.Types.ObjectId()).should.be.rejected;
        });

        it('[get] - Should return a user if found', function(done) {            
            User.get(savedFullUser._id)
                .then((user) => {
                    expect(user.clientRefs).to.have.length(3);
                    done();
                })
                .catch(done);
        });

        it('[findByEmail] - Should not return a result if matching email is not found', function() {
            return User.findByEmail('super_fake_email@fakefakefake.com').should.be.rejected;
        });

        it('[findByEmail] - Should return a user if found', function() {            
            return User.findByEmail(seedFullUser.email).should.not.be.rejected;
        });
    });
});