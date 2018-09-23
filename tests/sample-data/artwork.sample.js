import mongoose from 'mongoose';

export const sampleArtworkCoveredRef = {
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