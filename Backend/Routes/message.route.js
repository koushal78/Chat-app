import express from 'express'
import  {getMessage, sendMessage}  from '../Collector/message.controller.js';
import protectRoute from '../middleware/protectRoute.js';
import { handleUpload, upload } from '../Collector/uploadcontroller.js';

const router = express.Router()


router.get("/:id",protectRoute,getMessage);
router.post("/send/:id",protectRoute,sendMessage);
router.post("/upload",upload.single("file"),handleUpload)

export default router

