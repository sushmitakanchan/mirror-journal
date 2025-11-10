import express from 'express'
import {getReflect, getReflectById} from '../controllers/reflect.controller.js'
const router = express.Router()

router.post('/reflect', getReflect);
router.post('/reflect/:id', getReflectById);

export default router;