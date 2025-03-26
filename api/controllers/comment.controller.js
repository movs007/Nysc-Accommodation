import Comment from '../models/comment.model.js';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';

export const createComment = async (req, res, next) => {
    try {
      const { propertyId, text, rating, userId } = req.body;
      const user = await User.findById(userId);
      if (!user) {
        return next(errorHandler(404, 'User not found')); //res.status(404).send({ message: 'User not found' });
      }
      const comment = new Comment({ propertyId, text, rating, userId });
      await comment.save();

      // await comment.populate('userId', 'avatar username').execPopulate();

      res.status(201).send(comment);
    } catch (error) {
        next(error);
    }
  };

  export const getComment = async (req, res, next) => {
    try {
      const comments = await Comment.find({ propertyId: req.params.propertyId }).populate('userId', 'avatar username');
      res.send(comments);
    } catch (error) {
      next(error);
    }
  };