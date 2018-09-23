import mongoose from 'mongoose';
import { sampleAddresses } from './address.sample';
import { sampleArtworkCoveredRef } from './artwork.sample';

export const sampleBasicClient = {
    firstName: 'Bob',
    lastName: 'Dobbs',
    artistId: mongoose.Types.ObjectId()
};

export const sampleClientAddress = sampleAddresses;
export const sampleClientArtwork = sampleArtworkCoveredRef;

// export const sampleClientAddress = {
//     addresses: [
//         {
//             address1: '1313 Mockingbird Ln.',
//             city: 'San Diego',
//             stateProvince: 'CA',
//             postalCode: '92105',
//             country: 'US',
//             addressType: 'Home'
//         },
//         {
//             address1: '42 Business Blvd.',
//             address: 'STE. 23',
//             city: 'San Diego',
//             stateProvince: 'CA',
//             postalCode: '92101',
//             country: 'US',
//             addressType: 'Business'
//         }
//     ]
// };

// export const sampleClientArtwork = {
//     artwork: [
//         {
//             artworkId: mongoose.Types.ObjectId(),
//             name: 'Art 1',
//             description: 'This is a description for Art 1.',
//             photoUrl: 'https://s3-us-west-2.amazonaws.com/testbucket-artchive-com/600-400.png'
//         },
//         {
//             artworkId: mongoose.Types.ObjectId(),
//             name: 'Art 2',
//             description: 'This is a description for Art 2.',
//             photoUrl: 'https://s3-us-west-2.amazonaws.com/testbucket-artchive-com/600-400.png'
//         },
//         {
//             artworkId: mongoose.Types.ObjectId(),
//             name: 'Art 3',
//             description: 'This is a description for Art 3.',
//             photoUrl: 'https://s3-us-west-2.amazonaws.com/testbucket-artchive-com/600-400.png'
//         },
//         {
//             artworkId: mongoose.Types.ObjectId(),
//             name: 'Art 4',
//             description: 'This is a description for Art 4.',
//             photoUrl: 'https://s3-us-west-2.amazonaws.com/testbucket-artchive-com/600-400.png'
//         }
//     ]
// };

export const sampleFullClient = {...sampleBasicClient, ...sampleClientAddress, ...sampleClientArtwork};
