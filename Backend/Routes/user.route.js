import express from 'express'
import protectRoute from '../middleware/protectRoute.js'
import { getuserForsideBar } from '../Collector/user.controller.js'

const router = express.Router()
 
router.get('/',protectRoute,getuserForsideBar)

export default router