import express from 'express'
import { getEntries, createEntry, updateEntry, deleteEntry } from '../controllers/entry.controller.js';
import { requireAuth } from "@clerk/express"; 

const router = express.Router()

router.get('/', getEntries);
router.post('/create-entry',requireAuth(), createEntry);
router.put('/update-entry/:id',requireAuth(), updateEntry);
router.delete('/delete-entry/:id',requireAuth(), deleteEntry);

export default router;