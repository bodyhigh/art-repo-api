import mongoose from 'mongoose';
import Client from '../../app/models/client.model';
import ArtworkBasicRef from '../../app/models/artworkRefs.model';
import { sampleBasicClient, 
    sampleClientAddress, 
    sampleClientArtwork, 
    sampleFullClient } from '../sample-data/client.sample';
import util from 'util';
import chai, { expect } from 'chai';
// import chaiAsPromised from 'chai-as-promised';
// chai.use(chaiAsPromised);


chai.config.includeStack = true;

describe('## MODEL/CLIENT ##', () => {
    const seedBasicClient = sampleBasicClient;
    const seedFullClient = sampleFullClient;
    
    beforeEach((done) => {
        Client.deleteMany({}, done);
    });

    describe('Field Validation', () => {
        it('Should fail when missing basic information', (done) => {
            const newClient = new Client();

            newClient.validate((err) => {
                expect(err.errors.firstName.name).to.be.equal('ValidatorError');
                expect(err.errors.lastName.name).to.be.equal('ValidatorError');
                expect(err.errors.artistId.name).to.be.equal('ValidatorError');
                done();
            });
        });

        it('[addresses] - Should fail address validation when missing required fields', (done) => {
            const incompleteAddress = { addresses: [{ fakeField: 'Foo1' }, { fakeField: 'Foo2' }]};
            const testClient = {...seedBasicClient, ...incompleteAddress};
            const newClient = new Client(testClient);

            newClient.validate((err) => {
                // console.log('---------------------------------------------');                
                // console.log(util.inspect(Object.keys(err.errors), {colors: true }));
                // console.log('---------------------------------------------');
                expect(Object.keys(err.errors).length).to.be.equal(12); // 2 address records
                expect(err.errors['addresses.0.address1'].name).to.be.equal('ValidatorError');
                expect(err.errors['addresses.0.city'].name).to.be.equal('ValidatorError');
                expect(err.errors['addresses.0.stateProvince'].name).to.be.equal('ValidatorError');
                expect(err.errors['addresses.0.postalCode'].name).to.be.equal('ValidatorError');
                expect(err.errors['addresses.0.country'].name).to.be.equal('ValidatorError');
                expect(err.errors['addresses.0.addressType'].name).to.be.equal('ValidatorError');
                
                done();
            });
        });

        it('[addresses] - Should pass address validation when provided valid record', (done) =>{
            const newClient = new Client({...seedBasicClient, ...sampleClientAddress});
            newClient.validate(done);
        })

        it('[artwork] - Should fail when artwork documents have missing required fields', (done) => {
            const incompleteArtwork = { artwork: [{ fakeField: 'Foo1' }, { fakeField: 'Foo2' }]};
            const newClient = new Client({...seedBasicClient, ...incompleteArtwork});

            newClient.validate((err) => {
                expect(err.errors['artwork.0.artworkId'].name).to.be.equal('ValidatorError');
                expect(err.errors['artwork.0.name'].name).to.be.equal('ValidatorError');
                expect(err.errors['artwork.0.description'].name).to.be.equal('ValidatorError');              
                done();
            });
        });

        it('[ArtworkBasicRef] - Should validate ArtworkBasicRef', (done) => {
            const newArtworkBasicRef = new ArtworkBasicRef({
                artworkId: mongoose.Types.ObjectId(),
                name: 'Art 1',
                description: 'This is a description for Art 1.',
                photoUrl: 'https://s3-us-west-2.amazonaws.com/testbucket-artchive-com/600-400.png'
            });

            newArtworkBasicRef.validate(done);
        })
    });

    describe('Save Record', (done) => {
        it('Should successfully save Client', (done) => {
            const newClient = new Client(seedFullClient);
            
            newClient.save()
                .then(savedClient => {
                    expect(savedClient.firstName).to.be.equal(seedFullClient.firstName);
                    expect(savedClient.lastName).to.be.equal(seedFullClient.lastName);
                    done();
                })
                .catch(err => done(err));
        });
    });
});