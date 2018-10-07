import mongoose from 'mongoose';

const ClientBasicRefSchema = new mongoose.Schema({
    clientId: { type: mongoose.Schema.Types.ObjectId, required: true},
    firstName: { type: String, required: true },
    lastName: { type: String, required: true }
});

export default mongoose.model('ClientBasicRef', ClientBasicRefSchema);