import Preference from "../models/preference.model.js";
import User from '../models/user.model.js';
// import { errorHandler } from "../utils/error";

export const createPreference = async (req, res, next) => {
    try{
        const preference = await Preference.create(req.body);
        await User.findByIdAndUpdate(req.params.id, { hasFilledSurvey: true }).exec();
        return res.status(201).json(preference);
    } catch (error) {
        next(error)
    }
};

export const updatePreference = async (req, res, next) => {
    try{
        const updatePreference = await Preference.findOneAndUpdate(
            {userRef:req.params.id},
            {
                $set: {
                    regularPrice: req.body.regularPrice,
                    location: req.body.location,
                    distanceFromSchool: req.body.distanceFromSchool,
                    availabilityOfWater: req.body.availabilityOfWater,
                    roomType: req.body.roomType,
                    apartmentType:req.body.apartmentType,
                },
            },
            {new: true}

        );

        const rest = updatePreference._doc;

        res.status(200).json(rest);

    } catch(error) {
        next(error);
    }
};

export const getPreference = async (req, res, next) => {
    try {
      const preference = await Preference.findOne({userRef: req.params.id});
      if (!preference) {
        return next(errorHandler(404, 'Preference not found!'));
      }
      res.status(200).json(preference);
    } catch (error) {
      next(error);
    }
  };