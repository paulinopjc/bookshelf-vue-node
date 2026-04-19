import { Router } from 'express'
import { bookController } from '../controllers/bookController'

const router = Router()

router.get('/stats', bookController.stats)
router.get('/', bookController.list)
router.get('/:id', bookController.show)
router.post('/', bookController.create)
router.put('/:id', bookController.update)
router.patch('/:id', bookController.update)
router.delete('/:id', bookController.destroy)

export default router