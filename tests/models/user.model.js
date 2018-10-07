import User from '../../app/models/user.model';
import Client from '../../app/models/client.model';
import { expect } from 'chai';
import { sampleBasicUser, sampleFullUser } from '../sample-data/user.sample';
import { sampleClientBasicRef, sampleFullClient } from '../sample-data/client.sample'
import { sampleArtworkCoveredRef } from '../sample-data/artwork.sample';
import util from 'util';

describe('## MODEL/USER ##', () => {
    beforeEach((done) => {
        User.deleteMany({}, done);
    });

    describe('Field Validation', () => {
        it('Should fail if missing required fields', (done) => {
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

        it('[accountStatus] - Should fail when provided an invalid accountStatus', (done) => {
            const newUser = new User(sampleBasicUser);
            newUser.accountStatus = 'foo';

            newUser.validate((err) => {
                expect(err.errors.accountStatus.name).to.be.equal('ValidatorError');
                done();
            });
        });

        it('[accountStatus] - Should pass when provided a valid accountStatus', (done) => {
            const newUser = new User(sampleBasicUser);

            newUser.validate(done);
        });

        it('[clients] - Should fail if Client record is invalid', (done) => {
            const badCients = { clients: [{ field1: 'foo' }], clientRefs: [{ field1: 'Foo' }] };
            const newUser = new User({...sampleBasicUser, ...badCients });

            newUser.validate((err) => {
                // clients
                expect(err.errors['clients.0.clientId'].kind).to.be.equal('required');
                expect(err.errors['clients.0.firstName'].kind).to.be.equal('required');
                expect(err.errors['clients.0.lastName'].kind).to.be.equal('required');

                // clientRefs
                expect(err.errors.clientRefs.name).to.be.equal('CastError');

                // # of errors
                expect(Object.keys(err.errors).length).to.be.equal(4);
                done();
            });
        });

        it('[clients] - Should pass when provided a valid clients', (done) => {
            const newClients = { clients: [sampleClientBasicRef, sampleClientBasicRef] };
            const newUser = new User({...sampleBasicUser, ...newClients});

            newUser.validate(done);
        });

        it('[artwork] - Should fail if Artwork record is invalid', (done) => {
            const badArtwork = { artwork: [{ field1: 'Bar' }], artworkRefs: [{ field1: 'Foo' }]};
            const newUser = new User({ ...sampleBasicUser, ...badArtwork });

            newUser.validate((err) => {
                // artwork
                expect(err.errors['artwork.0.artworkId'].kind).to.be.equal('required');
                expect(err.errors['artwork.0.name'].kind).to.be.equal('required');
                expect(err.errors['artwork.0.description'].kind).to.be.equal('required');

                // artworkRefs
                // expect(err.errors.artworkRefs.name).to.be.equal('CastError');

                // # of errors
                expect(Object.keys(err.errors).length).to.be.equal(3);
                done();
            });            
        });

        it('[roles] - Should fail validation of a invalid role exists', (done) => {
            const newUser = new User({...sampleBasicUser, ...sampleArtworkCoveredRef});
            newUser.roles = ['admin', 'boogeyman'];

            newUser.validate((err) => {
                // console.log(util.inspect(err.errors, {colors: true }));
                expect(err.errors['roles.1'].kind).to.be.equal('enum');
                done();
            });
        });

        it('[artwork] - Should pass when provided a valid records', (done) => {
            const newUser = new User({...sampleBasicUser, ...sampleArtworkCoveredRef});

            newUser.validate(done);
        });
    });

    describe('Save Record', (done) => {
        it('Should successfully save Client', (done) => {
            const newClient = new Client(sampleFullClient);
            const newUser = new User(sampleFullUser);
            newClient.save()
                .then((savedClient) => {
                    newUser.clientRefs = [savedClient];

                    newUser.save()
                        .then(savedUser => {
                            expect(savedUser.firstName).to.be.equal(sampleFullUser.firstName);
                            expect(savedUser.lastName).to.be.equal(sampleFullUser.lastName);
                            expect(savedUser.addresses).to.be.an('array').to.have.lengthOf(2);
                            expect(savedUser.artwork).to.be.an('array').to.have.lengthOf(4);
                            expect(savedUser.clients).to.be.an('array').to.have.lengthOf(2);
                            expect(savedUser.clientRefs).to.be.an('array').to.have.lengthOf(1);
                            done();
                        })
                })
                .catch(done);
        });
    });
});