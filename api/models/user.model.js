import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar:{
      type: String,
      default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    },
    userType: {
      type: String,
      enum: ['student', 'landlord'],
      required: true,
    },
    phoneno: {
      type: String,
      required: function() {
        return this.userType === 'landlord'; // Required only for student users
      },
    },
    state: {
      type: String,
      required: function() {
        return this.userType === 'student'; // Required only for student users
      },
    },
    lga: {
      type: String,
      required: function() {
        return this.userType === 'student'; // Required only for student users
      },
    },
    callUpNo: {
      type: String,
      required: function() {
        return this.userType === 'student'; // Required only for student users
      },
    },
    isColiving: {
      type: String,
      required: function() {
        return this.userType === 'student'; // Required only for student users
      },
    },
    hasFilledSurvey: {
      type: Boolean,
      default: false,
      required: function() {
        return this.userType === 'student'; // Required only for student users
      },
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
