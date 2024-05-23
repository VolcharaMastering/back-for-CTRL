import mongoose from 'mongoose';

const placeSchema = new mongoose.Schema({
  placeName: {
    type: String,
    required: [true, 'Name of place is required'],
    unique: true,
    minlength: [2, 'Minimum 2 characters'],
    maxlength: [120, 'Maximum 120 characters'],
  },
  latitude: {
    type: Number,
    required: [true, 'Latitude is required'],
  },
  longitude: {
    type: Number,
    required: [true, 'Longitude is required'],
  },
});

export default mongoose.model('place', placeSchema);