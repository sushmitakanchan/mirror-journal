import express from 'express'
import {getReflectById} from '../controllers/reflect.controller.js'

const router = express.Router()
router.post('/reflect/:id', getReflectById);

export default router;