import express from 'express'
import { getEntries, createEntry, updateEntry, deleteEntry } from '../controllers/entry.controller.js';
import { requireAuth } from "@clerk/express"; 

const router = express.Router()

router.get('/', getEntries);
router.post('/createEntry',requireAuth(), createEntry);
router.put('/updateEntry/:id',requireAuth(), updateEntry);
router.delete('/deleteEntry/:id',requireAuth(), deleteEntry);

export default router;