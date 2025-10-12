import express from 'express'
import { getEntries, createEntry, updateEntry, deleteEntry } from '../controllers/entry.controller.js';

const router = express.Router()

router.get('/', getEntries);
router.post('/createEntry', createEntry);
router.put('/:id', updateEntry);
router.delete('/:id', deleteEntry);

export default router;