import express from 'express';
import { google, signOut, signin, signupasLandlord,signupasStudent } from '../controllers/auth.controller.js';

const router = express.Router();

router.post("/signup/student", signupasStudent);
router.post("/signup/landlord", signupasLandlord);
router.post("/signin", signin);
router.post('/google', google);
router.get('/signout', signOut)

export default router;