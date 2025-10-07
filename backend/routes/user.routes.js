import express from 'express'
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import { syncUser, getCurrentUser } from '../controllers/user.controller.js';

const router = express.Router();


router.get('/sync', syncUser);
router.post('/me', ClerkExpressRequireAuth(), getCurrentUser);


export default router;