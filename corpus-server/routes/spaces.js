import { Router } from 'express'
import { authMiddleware } from '../middleware/authMiddleware.js'
import { createSpace, listSpaces, getSpace, updateSpace, deleteSpace } from '../controllers/spaceController.js'

const router = Router()
router.use(authMiddleware)

router.get('/', listSpaces)
router.post('/', createSpace)
router.get('/:id', getSpace)
router.patch('/:id', updateSpace)
router.delete('/:id', deleteSpace)

export default router
