/* eslint-disable func-names */
import mongoose from 'mongoose';

const AddressSchema = new mongoose.Schema({
    address1: { type: String, required: true },
    address2: { type: String },
    city: { type: String, required: true },
    stateProvince: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    addressType: { type: String, required: true}
});

export default mongoose.model('Address', AddressSchema);