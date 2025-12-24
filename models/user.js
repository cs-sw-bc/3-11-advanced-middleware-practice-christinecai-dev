import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true //on a unique field means only documents that actually have that field are checked for uniqueness
    }
});

export default mongoose.model('User', userSchema);