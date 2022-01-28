const express = require('express')
const {requireAuth, requireAdmin} = require('../../middlewares/requireAuth.middleware')
const {log} = require('../../middlewares/logger.middleware')
const {addStay, getStays, deleteStay, getStay} = require('./stay.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', log, getStays)
router.get('/:id', log, getStay)
// router.put('/:id', log, getStay)
router.post('/',  log, requireAuth, addStay)
router.delete('/:id',  requireAuth, deleteStay)

module.exports = router