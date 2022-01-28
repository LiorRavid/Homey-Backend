const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId
const asyncLocalStorage = require('../../services/als.service')

async function query(filterBy = {}) {
    try {
        const criteria = _buildCriteria(filterBy)
        const collection = await dbService.getCollection('stay')
        // const stays = await collection.find(criteria).toArray()
        var stays = await collection.find({}).toArray()
        // stays = stays.map(stay => {
        //     stay.byUser = { _id: stay.byUser._id, fullname: stay.byUser.fullname }
        //     stay.aboutUser = { _id: stay.aboutUser._id, fullname: stay.aboutUser.fullname }
        //     delete stay.byUserId
        //     delete stay.aboutUserId
        //     return stay
        // })

        return stays
    } catch (err) {
        logger.error('cannot find stays', err)
        throw err
    }

}

async function getById(stayId) {
    try {
        const collection = await dbService.getCollection('stay')
        const stay = await collection.findOne({ '_id': ObjectId(stayId) })
        // stay.reviews = await reviewService.query({ stayId })
        // console.log('the stay in service', stay)
        return stay
    } catch (err) {
        logger.error(`while finding stay ${stayId}`, err)
        throw err
    }
}

async function remove(stayId) {
    try {
        const store = asyncLocalStorage.getStore()
        const { userId, isAdmin } = store
        const collection = await dbService.getCollection('stay')
        // remove only if user is owner/admin
        const criteria = { _id: ObjectId(stayId) }
        if (!isAdmin) criteria.byUserId = ObjectId(userId)
        await collection.deleteOne(criteria)
    } catch (err) {
        logger.error(`cannot remove stay ${stayId}`, err)
        throw err
    }
}


async function add(stay) {
    try {
        const stayToAdd = {
            byUserId: ObjectId(stay.byUserId),
            aboutUserId: ObjectId(stay.aboutUserId),
            txt: stay.txt
        }
        const collection = await dbService.getCollection('stay')
        await collection.insertOne(stayToAdd)
        return stayToAdd;
    } catch (err) {
        logger.error('cannot insert stay', err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.byStayId) criteria.byStayId = filterBy.byStayId
    return criteria
}

module.exports = {
    query,
    remove,
    add,
    getById
}


