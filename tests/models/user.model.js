import User from '../../app/models/user.model';
import chai, { expect } from 'chai';
import { sampleUserBasic } from '../sample-data/user.sample';
import sampleClientBasicRef from '../sample-data/client.sample'
import util from 'util';
import { AssertionError } from 'assert';

describe('## MODEL/USER ##', () => {
    describe('Field Validation', () => {
        it('Should fail if missing required fields', (done) => {
            const newUser = new User({});
            newUser.validate((err) => {
                expect(err.errors.firstName.kind).to.be.equal('required');
                expect(err.errors.lastName.kind).to.be.equal('required');
                expect(err.errors.email.kind).to.be.equal('required');
                expect(err.errors.password.kind).to.be.equal('required');
                expect(err.errors.roles.message).to.be.equal('required');
                expect(err.errors.accountStatus.kind).to.be.equal('required');
                // console.log('---------------------------------------------');                
                // // console.log(util.inspect(Object.keys(err.errors), {colors: true }));
                // console.log(util.inspect(err.errors, {colors: true }));
                // console.log('---------------------------------------------'); 
                done();
            });
        });

        it('Should fail if Client record schema is invalid', (done) => {
            const badCients = { clients: [{ firstName: 'foo' }], clientRefs: [{ field1: 'Foo' }] };
            const newUser = new User({...sampleUserBasic, ...badCients });

            newUser.validate((err) => {
                expect(err.errors.clients.name).to.be.equal('CastError');
                expect(err.errors.clientRefs.name).to.be.equal('CastError');
                expect(Object.keys(err.errors).length).to.be.equal(2);
                // console.log(util.inspect(err.errors, {colors: true }));
                done();
            });
        });

        it('Should fail if Artwork schema is invalid', (done) => {
            const badArtwork = { artwork: [{ field1: 'Bar' }]};
            const newUser = new User({ ...sampleUserBasic, ...badArtwork });

            newUser.validate((err) => {
                
                // console.log(util.inspect(err.errors, {colors: true }));
                // console.log(util.inspect(Object.keys(err.errors), {colors: true }));
                expect(err.errors.artwork.name).to.be.equal('CastError');
                // expect(err.errors['artwork.0.artworkId'].name).to.be.equal('CastError');
                // expect(err.errors['artwork.0.name'].name).to.be.equal('CastError');
                // expect(err.errors['artwork.0.description'].name).to.be.equal('CastError');
                done();
            })
            
        });
    });
});