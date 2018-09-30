import mongoose from 'mongoose';
// import Client from './client.model';

const ClientBasicRefSchema = new mongoose.Schema({
    clientId: { type: mongoose.Schema.Types.ObjectId, required: true},
    firstName: { type: String, required: true },
    lastName: { type: String, required: true }
});

export const ClientBasicRef = mongoose.model('ClientBasicRef', ClientBasicRefSchema);