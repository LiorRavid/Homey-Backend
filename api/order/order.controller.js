const logger = require('../../services/logger.service')
// const userService = require('../user/user.service')
// const socketService = require('../../services/socket.service')
const orderService = require('./order.service')

async function getOrders(req, res) {
    try {
        console.log(req.query)
        const orders = await orderService.query(req.query)
        res.send(orders)
    } catch (err) {
        // logger.error('Cannot get stays', err)
        console.log(err)
        res.status(500).send({ err: 'Failed to get orders' })
    }
}

// GET BY ID 
async function getOrder(req, res) {
    try {
        const orderId = req.params.id;
        const order = await orderService.getById(orderId)
        res.json(order)
    } catch (err) {
        logger.error('Failed to get order', err)
        res.status(500).send({ err: 'Failed to get order' })
    }
}

async function deleteOrder(req, res) {
    try {
        await orderService.remove(req.params.id)
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        logger.error('Failed to delete order', err)
        res.status(500).send({ err: 'Failed to delete order' })
    }
}


async function addOrder(req, res) {
    try {
        var order = req.body
        // order.byOrderId = req.session.order._id
        order = await orderService.add(order)

        // prepare the updated order for sending out
        // order.order = await orderService.getById(order.orderId)

        // Give the order credit for adding a stay
        // var order = await orderService.getById(stay.byUserId)
        // user.score += 10;
        // user = await userService.update(user)
        // stay.byUser = user
        // const fullUser = await userService.getById(user._id)

        // console.log('CTRL SessionId:', req.sessionID);
        // socketService.broadcast({ type: 'stay-added', data: stay, userId: stay.byUserId })
        // socketService.emitToUser({ type: 'stay-about-you', data: stay, userId: stay.aboutUserId })
        // socketService.emitTo({ type: 'user-updated', data: fullUser, label: fullUser._id })

        res.send(order)

    } catch (err) {
        console.log(err)
        logger.error('Failed to add order', err)
        res.status(500).send({ err: 'Failed to add order' })
    }
}

async function updateOrder(req, res) {
    try {
        const order = req.body
        const savedOrder = await orderService.update(order)
        res.send(savedOrder)
    } catch (err) {
        logger.error('Failed to update order', err)
        res.status(500).send({ err: 'Failed to update order' })
    }
}

module.exports = {
    getOrders,
    deleteOrder,
    addOrder,
    getOrder,
    updateOrder
}