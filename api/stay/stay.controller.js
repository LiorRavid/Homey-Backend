const logger = require('../../services/logger.service')
const userService = require('../user/user.service')
const socketService = require('../../services/socket.service')
const stayService = require('./stay.service')

async function getStays(req, res) {
    try {
        console.log(req.query)
        const stays = await stayService.query(req.query)
        res.send(stays)
    } catch (err) {
        // logger.error('Cannot get stays', err)
        console.log(err)
        res.status(500).send({ err: 'Failed to get stays' })
    }
}

// GET BY ID 
async function getStay(req, res) {
    try {
        const stayId = req.params.id;
        const stay = await stayService.getById(stayId)
        res.json(stay)
    } catch (err) {
        logger.error('Failed to get stay', err)
        res.status(500).send({ err: 'Failed to get stay' })
    }
}

async function deleteStay(req, res) {
    try {
        await stayService.remove(req.params.id)
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        logger.error('Failed to delete stay', err)
        res.status(500).send({ err: 'Failed to delete stay' })
    }
}


async function addStay(req, res) {
    try {
        var stay = req.body
        stay.byUserId = req.session.user._id
        stay = await stayService.add(stay)

        // prepare the updated stay for sending out
        stay.aboutUser = await userService.getById(stay.aboutUserId)

        // Give the user credit for adding a stay
        var user = await userService.getById(stay.byUserId)
        user.score += 10;
        user = await userService.update(user)
        stay.byUser = user
        const fullUser = await userService.getById(user._id)

        console.log('CTRL SessionId:', req.sessionID);
        socketService.broadcast({ type: 'stay-added', data: stay, userId: stay.byUserId })
        socketService.emitToUser({ type: 'stay-about-you', data: stay, userId: stay.aboutUserId })
        socketService.emitTo({ type: 'user-updated', data: fullUser, label: fullUser._id })

        res.send(stay)

    } catch (err) {
        console.log(err)
        logger.error('Failed to add stay', err)
        res.status(500).send({ err: 'Failed to add stay' })
    }
}

module.exports = {
    getStays,
    deleteStay,
    addStay,
    getStay
}