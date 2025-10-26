import express from 'express'
import {reflect} from '../controllers/reflect.controller.js'
const router = express.Router()

router.post('/reflect', reflect);

export default router;