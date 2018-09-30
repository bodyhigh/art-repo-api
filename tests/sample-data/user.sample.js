import mongoose from 'mongoose';
import { sampleAddresses } from './address.sample';
import { sampleArtworkCoveredRef } from './artwork.sample';
import sampleClientBasicRef from './client.sample';

export const sampleUserBasic = {
    firstName: 'Trajan',
    lastName: 'Dobbs',
    email: 'donotreply@fakemail.com',
    password: 'not a real password',
    roles: ['admin'],
    accountStatus: 'active'
};

export const sampleFullUser = {...sampleUserBasic, ...sampleClientBasicRef };