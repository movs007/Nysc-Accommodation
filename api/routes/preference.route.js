import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { createPreference,updatePreference } from '../controllers/preference.controller.js';

const router = express.Router();

router.post('/create/:id', verifyToken, createPreference);
router.post('/update/:id', verifyToken, updatePreference)
router.get('/get/:id', verifyToken, updatePreference)


export default router;