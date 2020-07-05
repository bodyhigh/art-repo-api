import mongoose from 'mongoose';

export const sampleArtwork = [
    {
        title: 'Art 1',
        description: 'This is a description for Art 1. &lt;div&gt;abc&lt;/div&gt;',
        images: [
            {
                url: 'https://s3-us-west-2.amazonaws.com/testbucket-artchive-com/600-400.png',
                key: 'art_1'
            }
        ]
        
    },
    {
        title: 'Art 2',
        description: 'This is a description for Art 2.&lt;script&gt;alert(&#x27;As the Canadians say&#x27;);&lt;&#x2F;script&gt;',
        images: [
            {
                url: 'https://s3-us-west-2.amazonaws.com/testbucket-artchive-com/600-400.png',
                key: 'art_2.1'
            },
            {
                url: 'https://s3-us-west-2.amazonaws.com/testbucket-artchive-com/600-400.png',
                key: 'art_2.2'
            },
            {
                url: 'https://s3-us-west-2.amazonaws.com/testbucket-artchive-com/600-400.png',
                key: 'art_2.3'
            }
        ]
    },
    {
        title: 'Art 3: Dog&#x27;s Playing Poker',
        description: 'This is a description for Art 3.',
        images: [
            {
                url: 'https://s3-us-west-2.amazonaws.com/testbucket-artchive-com/600-400.png',
                key: 'art_3'
            }
        ]
    },
    {
        title: 'Art 4',
        description: 'This is a description for Art 4.'
    }
];

export const sampleArtworkCoveredRef = {
    artwork: [
        {
            artworkId: mongoose.Types.ObjectId(),
            title: 'Art 1',
            description: 'This is a description for Art 1.',
            photoUrl: 'https://s3-us-west-2.amazonaws.com/testbucket-artchive-com/600-400.png'
        },
        {
            artworkId: mongoose.Types.ObjectId(),
            title: 'Art 2',
            description: 'This is a description for Art 2.',
            photoUrl: 'https://s3-us-west-2.amazonaws.com/testbucket-artchive-com/600-400.png'
        },
        {
            artworkId: mongoose.Types.ObjectId(),
            title: 'Art 3',
            description: 'This is a description for Art 3.',
            photoUrl: 'https://s3-us-west-2.amazonaws.com/testbucket-artchive-com/600-400.png'
        },
        {
            artworkId: mongoose.Types.ObjectId(),
            title: 'Art 4',
            description: 'This is a description for Art 4.',
            photoUrl: 'https://s3-us-west-2.amazonaws.com/testbucket-artchive-com/600-400.png'
        }
    ]
};