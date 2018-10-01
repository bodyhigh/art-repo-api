import mongoose from 'mongoose';
import { sampleAddresses } from './address.sample';
import { sampleArtworkCoveredRef } from './artwork.sample';
import { sampleClientBasicRefs, sampleFullClient } from './client.sample';

export const sampleBasicUser = {
    firstName: 'Trajan',
    lastName: 'Dobbs',
    email: 'donotreply@fakemail.com',
    password: 'not a real password',
    roles: ['admin'],
    accountStatus: 'active'
};

// const sampleClientRefs = { clientRefs: [sampleFullClient, sampleFullClient]};

export const sampleFullUser = {...sampleBasicUser, ...sampleAddresses, ...sampleArtworkCoveredRef, ...sampleClientBasicRefs };