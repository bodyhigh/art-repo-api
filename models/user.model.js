import Promise from 'bluebird';
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true }
});

export default mongoose.Model('User', UserSchema);

// firstName,
// lastName,
// email,
// password,
// roles,
// activationStatus,
// createdDate,
// clients: {
//     id,
//     firstName,
//     lastName
// },
// artwork: {
//     id,
//     name,
//     description,
//     photoUrl
// }