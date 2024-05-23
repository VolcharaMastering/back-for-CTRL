import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: [true, "UserId is required"],
    },
    placeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'place',
        required: [true, "PlaceId is required"],
    },
    rating: {
        type: Number,
        required: [true, "Rating is required"],
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: false,
        maxlength: 1000
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('review', reviewSchema);