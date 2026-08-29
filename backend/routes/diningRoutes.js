import express from 'express'
import {
  getDiningMenu,
  getDiningTables,
  getTablesByType,
  getAvailableTablesByType,
  bookTable,
  releaseTable
} from '../controllers/diningMenuController.js'

const router = express.Router()

// Menu routes
router.get('/menu', getDiningMenu)

// Table routes
router.get('/tables', getDiningTables)
router.get('/tables/:tableTypeId', getTablesByType)
router.get('/tables/:tableTypeId/available', getAvailableTablesByType)
router.post('/tables/book', bookTable)
router.post('/tables/release', releaseTable)

export default router
