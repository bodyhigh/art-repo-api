import { sampleAddresses } from './address.sample';
import { sampleArtworkCoveredRef } from './artwork.sample';
import { sampleClientBasicRefs } from './client.sample';

export const sampleBasicUser = {
    firstName: 'Trajan',
    lastName: 'Dobbs',
    email: 'donotreply@fakemail.com',
    password: 'not a real password',
    roles: ['admin', 'user'],
    accountStatus: 'active'
};

export const sampleFullUser = {...sampleBasicUser, ...sampleAddresses, ...sampleArtworkCoveredRef, ...sampleClientBasicRefs };