import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { getRecommendations } from '../controllers/recommendation.controller.js';

const router = express.Router();

router.get('/get', verifyToken, getRecommendations);


export default router;