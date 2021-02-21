import mongoose from 'mongoose';

const artworkBasicRefSchema = new mongoose.Schema({
    artworkId: { type: mongoose.Schema.Types.ObjectId, required: true},
    title: { type: String, required: true },
    description: { type: String, required: true },
    photoUrl: { type: String }
});

export default mongoose.model('ArtworkBasicRef', artworkBasicRefSchema);