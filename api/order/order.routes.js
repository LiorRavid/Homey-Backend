const express = require('express')
const {requireAuth, requireAdmin} = require('../../middlewares/requireAuth.middleware')
const {log} = require('../../middlewares/logger.middleware')
const {addOrder, getOrders, deleteOrder, getOrder, updateOrder} = require('./order.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', log, getOrders)
router.get('/:id', log, getOrder)
router.put('/:id', log, updateOrder)
router.post('/',  log, requireAuth, addOrder)
router.delete('/:id',  requireAuth, deleteOrder)

module.exports = router