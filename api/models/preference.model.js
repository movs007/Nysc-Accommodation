import mongoose from 'mongoose';

const preferenceSchema = new mongoose.Schema(
  {
    regularPrice: {
      type: String,
      required: true,
    },
    location: {
        type: String,
        required: true,
    },
    distanceFromSchool: {
        type: String,
        required: true,
    },
    availabilityOfWater: {
        type: String,
        required: true,
    },
    roomType: {
        type: String,
        required: true,
    },
    apartmentType: {
        type: String,
        required: true,
    },
    userRef: {
        type: String,
        required: true,
    },
  },
  { timestamps: true }
);

const Preference = mongoose.model('preference', preferenceSchema);

export default Preference;
