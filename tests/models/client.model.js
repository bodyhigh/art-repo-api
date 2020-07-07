import mongoose from 'mongoose';
import Client from '../../app/models/client.model';
import ArtworkBasicRef from '../../app/models/artworkRefs.model';
import { sampleBasicClient, 
    sampleClientAddress, 
    sampleClientArtwork, 
    sampleFullClient } from '../sample-data/client.sample';
import util from 'util';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);


chai.config.includeStack = true;

describe('## MODEL/CLIENT ##', function()  {
    var seedFullClient;

    before(function(done) {
        const newClients = [new Client(sampleFullClient), new Client(sampleFullClient), new Client(sampleFullClient)];
        Client.create(newClients)
            .then((results) => {
                // console.log(util.inspect(results, {colors: true }));
                seedFullClient = results[0];
                done();
            })
            .catch(done);
    });
    
    // beforeEach(function(done)  {
    //     Client.deleteMany({}, done);
    // });

    after(function()  {
        return Client.deleteMany({});
    });

    describe('Field Validation', function()  {
        it('Should fail when missing basic information', function(done)  {
            const newClient = new Client();

            newClient.validate((err) => {
                expect(err.errors.firstName.name).to.be.equal('ValidatorError');
                expect(err.errors.lastName.name).to.be.equal('ValidatorError');
                expect(err.errors.artistId.name).to.be.equal('ValidatorError');
                done();
            });
        });

        it('[addresses] - Should fail address validation when missing required fields', function(done)  {
            const incompleteAddress = { addresses: [{ fakeField: 'Foo1' }, { fakeField: 'Foo2' }]};
            const testClient = {...sampleBasicClient, ...incompleteAddress};
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

        it('[addresses] - Should pass address validation when provided valid record', function(done) {
            const newClient = new Client({...sampleBasicClient, ...sampleClientAddress});
            newClient.validate(done);
        })

        it('[artwork] - Should fail when artwork documents have missing required fields', function(done)  {
            const incompleteArtwork = { artwork: [{ fakeField: 'Foo1' }, { fakeField: 'Foo2' }]};
            const newClient = new Client({...sampleBasicClient, ...incompleteArtwork});

            newClient.validate((err) => {
                expect(err.errors['artwork.0.artworkId'].name).to.be.equal('ValidatorError');
                expect(err.errors['artwork.0.title'].name).to.be.equal('ValidatorError');
                expect(err.errors['artwork.0.description'].name).to.be.equal('ValidatorError');              
                done();
            });
        });

        it('[ArtworkBasicRef] - Should validate ArtworkBasicRef', function(done)  {
            const newArtworkBasicRef = new ArtworkBasicRef({
                artworkId: mongoose.Types.ObjectId(),
                title: 'Art 1',
                description: 'This is a description for Art 1.',
                photoUrl: 'https://s3-us-west-2.amazonaws.com/testbucket-artchive-com/600-400.png'
            });

            newArtworkBasicRef.validate(done);
        })
    });

    describe('Save Record', function(done)  {
        it('Should successfully save Client', function(done)  {
            const newClient = new Client(sampleFullClient);
            
            newClient.save()
                .then(savedClient => {
                    expect(savedClient.firstName).to.be.equal(sampleFullClient.firstName);
                    expect(savedClient.lastName).to.be.equal(sampleFullClient.lastName);
                    done();
                })
                .catch(err => done(err));
        });
    });

    describe('Method Tests', function()  {
        it('[get] - Should not return a result if Id is not found', function() {
            return Client.get(mongoose.Types.ObjectId()).should.be.rejected;
        });

        it('[get] - Should return a client if found', function() {            
            return Client.get(seedFullClient._id).should.not.be.rejected;
        });
    });
});