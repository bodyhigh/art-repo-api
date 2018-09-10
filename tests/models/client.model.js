import mongoose from 'mongoose';
import Client from '../../app/models/client.model';
import util from 'util';
// import Client from '../../app/models/client.model';
import chai, { expect } from 'chai';
// import chaiAsPromised from 'chai-as-promised';
// chai.use(chaiAsPromised);

chai.config.includeStack = true;

describe('## MODEL/CLIENT ##', () => {
    const seedBasicClient = {
        firstName: 'Bob',
        lastName: 'Dobbs',
        artistId: mongoose.Types.ObjectId()
    };
    
    const seedClientAddress = {
        addresses: [
            {
                address1: '1313 Mockingbird Ln.',
                city: 'San Diego',
                stateProvince: 'CA',
                postalCode: '92105',
                country: 'US',
                addressType: 'Home'
            },
            {
                address1: '42 Business Blvd.',
                address: 'STE. 23',
                city: 'San Diego',
                stateProvince: 'CA',
                postalCode: '92101',
                country: 'US',
                addressType: 'Business'
            }
        ]
    };

    const seedClientArtwork = {
        artwork: [
            {
                artworkId: mongoose.Types.ObjectId(),
                name: 'Art 1',
                description: 'This is a description for Art 1.',
                photoUrl: 'https://s3-us-west-2.amazonaws.com/testbucket-artchive-com/600-400.png'
            },
            {
                artworkId: mongoose.Types.ObjectId(),
                name: 'Art 2',
                description: 'This is a description for Art 2.',
                photoUrl: 'https://s3-us-west-2.amazonaws.com/testbucket-artchive-com/600-400.png'
            },
            {
                artworkId: mongoose.Types.ObjectId(),
                name: 'Art 3',
                description: 'This is a description for Art 3.',
                photoUrl: 'https://s3-us-west-2.amazonaws.com/testbucket-artchive-com/600-400.png'
            },
            {
                artworkId: mongoose.Types.ObjectId(),
                name: 'Art 4',
                description: 'This is a description for Art 4.',
                photoUrl: 'https://s3-us-west-2.amazonaws.com/testbucket-artchive-com/600-400.png'
            }
        ]
    };

    const seedFullClient = {...seedBasicClient, ...seedClientAddress, ...seedClientArtwork};

    // beforeEach((done) => {
    //     Client.remove({}, done);
    // });

    describe('Validation Tests', () => {
        it('Should fail when missing basic information', (done) => {
            const newClient = new Client();

            newClient.validate((err) => {
                expect(err.errors.firstName.name).to.be.equal('ValidatorError');
                expect(err.errors.lastName.name).to.be.equal('ValidatorError');
                expect(err.errors.artistId.name).to.be.equal('ValidatorError');
                done();
            });
        });

        it('Should fail when address documents have missing required fields', (done) => {
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

        it('Should fail when artwork documents have missing required fields', (done) => {
            const incompleteArtwork = { artwork: [{ fakeField: 'Foo1' }, { fakeField: 'Foo2' }]};
            const newClient = new Client({...seedBasicClient, ...incompleteArtwork});

            newClient.validate((err) => {
                // console.log('---------------------------------------------');                
                // console.log(util.inspect(Object.keys(err.errors), {colors: true }));
                // console.log('---------------------------------------------');
                expect(Object.keys(err.errors).length).to.be.equal(6); // 2 artwork records
                expect(err.errors['artwork.0.artworkId'].name).to.be.equal('ValidatorError');
                expect(err.errors['artwork.0.name'].name).to.be.equal('ValidatorError');
                expect(err.errors['artwork.0.description'].name).to.be.equal('ValidatorError');
                
                done();
            });
        });
    })

    it('Should successfully save Client', (done) => {
        // console.log(seedFullClient);
        const newClient = new Client(seedFullClient);
        
        newClient.save()
            .then(savedClient => {
                // console.log(savedClient);
                expect(savedClient.firstName).to.be.equal(seedFullClient.firstName);
                expect(savedClient.lastName).to.be.equal(seedFullClient.lastName);
                done();
            })
            .catch(err => done(err));
    });
});