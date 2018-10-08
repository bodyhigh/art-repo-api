import mongoose from 'mongoose';
import { sampleAddresses } from './address.sample';
import { sampleArtworkCoveredRef } from './artwork.sample';

export const sampleBasicClient = {
    firstName: 'Bob',
    lastName: 'Dobbs',
    artistId: mongoose.Types.ObjectId()
};

export const sampleClientBasicRefs = {
    clients: [
        {
            firstName: 'Horatio',
            lastName: 'Dobbs',
            clientId: mongoose.Types.ObjectId()
        },
        {
            firstName: 'Tango',
            lastName: 'Dobbs',
            clientId: mongoose.Types.ObjectId()
        }
    ]
};

export const sampleClientBasicRef = {
    clientId: mongoose.Types.ObjectId(),
    firstName: 'Horatio',
    lastName: 'Dobbs'
};

export const sampleClientAddress = sampleAddresses;
export const sampleClientArtwork = sampleArtworkCoveredRef;
export const sampleFullClient = {...sampleBasicClient, ...sampleClientAddress, ...sampleClientArtwork};
export const sampleFullClientList = [
    { ...{ firstName: 'Copernicus', lastName: 'Dobbs', artistId: mongoose.Types.ObjectId() },  ...sampleClientAddress, ...sampleClientArtwork },
    { ...{ firstName: 'Tycho', lastName: 'Dobbs', artistId: mongoose.Types.ObjectId() },  ...sampleClientAddress, ...sampleClientArtwork },
    { ...{ firstName: 'Kepler', lastName: 'Dobbs', artistId: mongoose.Types.ObjectId() },  ...sampleClientAddress, ...sampleClientArtwork }
];