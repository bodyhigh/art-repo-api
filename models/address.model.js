/* eslint-disable func-names */
import mongoose from 'mongoose';

const AddressSchema = new mongoose.Schema({
    address1: { type: String },
    address2: { type: String },
    city: { type: String },
    stateProvince: { type: String },
    postalCode: { type: String },
    country: { type: String },
    addressType: { type: String }
});

export default mongoose.model('Address', AddressSchema);