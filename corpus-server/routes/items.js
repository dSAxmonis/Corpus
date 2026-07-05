import { Router } from 'express'
import { authMiddleware } from '../middleware/authMiddleware.js'
import {
  createItem, listItems, getItem, updateItem, deleteItem, driftItems,
} from '../controllers/itemController.js'
import { smartSearch } from '../controllers/searchController.js'

const router = Router()
router.use(authMiddleware)

router.get('/search', smartSearch)   // smart search replaces old searchItems
router.get('/drift', driftItems)
router.get('/', listItems)
router.post('/', createItem)
router.get('/:id', getItem)
router.patch('/:id', updateItem)
router.delete('/:id', deleteItem)

export default router
