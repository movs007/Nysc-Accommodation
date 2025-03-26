import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  propertyId: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }

});

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
