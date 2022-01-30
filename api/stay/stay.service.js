const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId
const asyncLocalStorage = require('../../services/als.service')

async function query(filterBy) {
    try {
        console.log('filterBy', filterBy)
        const criteria = _buildCriteria(filterBy)
        console.log('criteria', criteria)
        const collection = await dbService.getCollection('stay')
        const stays = await collection.find(criteria).toArray()
        // console.log('stays at criteria',stays)
        // var stays = await collection.find({}).toArray()
        return stays
    } catch (err) {
        // logger.error('cannot find stays', err)
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
        // logger.error('cannot insert stay', err)
        console.log(err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    if(!filterBy || !Object.keys(filterBy).length) return {}
    const criteria = { $and: [] }
    console.log('filter', filterBy)
    if (filterBy.location) {
        // const regex = new RegExp(filterBy.location, 'i')
        // criteria.loc = { $regex: regex }
        const locationCriteria = { $regex: filterBy.location, $options: 'i' }
        criteria.$and.push({
            $or: [
                { "loc.country": locationCriteria },
                { "loc.city": locationCriteria }
            ]
        })
    }
    if(filterBy.minPrice || filterBy.maxPrice){
        criteria.$and.push(
            { $and: [{ price: { $gt: +filterBy.minPrice}},{price: {$lt: +filterBy.maxPrice} }] }
        )
    }

    if(filterBy['Wifi']){
        criteria.$and.push(
            {"amenities":"Wifi"}
        )
    }

    if(filterBy['TV']){
        criteria.$and.push(
            {"amenities":"TV"}
        )
    }
    if(filterBy['Kitchen']){
        criteria.$and.push(
            {"amenities":"Kitchen"}
        )
    }
    if(filterBy['AC']){
        criteria.$and.push(
            {"amenities":"AC"}
        )
    }

    if(filterBy['Smoking allowed']){
        criteria.$and.push(
            {"amenities":"Smoking allowed"}
        )
    }

    if(filterBy['Pets allowed']){
        criteria.$and.push(
            {"amenities":"Pets allowed"}
        )
    }

    if(filterBy.hostId){
        criteria.$and.push(
            {"host._id":filterBy.hostId}
        )
    }
    return criteria
}

module.exports = {
    query,
    remove,
    add,
    getById
}

