import express from 'express'
import { requireAuth } from "@clerk/express";
import { syncUser, getCurrentUser } from '../controllers/user.controller.js';

const router = express.Router();


router.post('/sync', requireAuth(), syncUser);
router.get('/me', requireAuth(), getCurrentUser);


export default router;