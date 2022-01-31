const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId
const asyncLocalStorage = require('../../services/als.service')

async function query(filterBy) {
    try {
        console.log('filterBy', filterBy)
        const criteria = _buildCriteria(filterBy)
        console.log('criteria', criteria)
        const collection = await dbService.getCollection('order')
        const orders = await collection.find(criteria).toArray()
        // console.log('stays at criteria',stays)
        // var stays = await collection.find({}).toArray()
        return orders
    } catch (err) {
        // logger.error('cannot find stays', err)
        throw err
    }

}

async function getById(orderId) {
    try {
        const collection = await dbService.getCollection('order')
        const order = await collection.findOne({ '_id': ObjectId(orderId) })

        // stay.reviews = await reviewService.query({ stayId })
        // console.log('the stay in service', stay)
        return order
    } catch (err) {
        logger.error(`while finding order ${orderId}`, err)
        throw err
    }
}

async function remove(orderId) {
    try {
        const collection = await dbService.getCollection('order')
        await collection.deleteOne({ '_id': ObjectId(orderId) })
    } catch (err) {
        logger.error(`cannot remove order ${orderId}`, err)
        throw err
    }
}


async function add(order) {
    try {
        // const stayToAdd = {
        //     byUserId: ObjectId(stay.byUserId),
        //     aboutUserId: ObjectId(stay.aboutUserId),
        //     txt: stay.txt
        // }
        const collection = await dbService.getCollection('order')
        await collection.insertOne(order)
        return order;
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
    // if (filterBy.location) {
    //     // const regex = new RegExp(filterBy.location, 'i')
    //     // criteria.loc = { $regex: regex }
    //     const locationCriteria = { $regex: filterBy.location, $options: 'i' }
    //     criteria.$and.push({
    //         $or: [
    //             { "loc.country": locationCriteria },
    //             { "loc.city": locationCriteria }
    //         ]
    //     })
    // }
    // if(filterBy.minPrice || filterBy.maxPrice){
    //     criteria.$and.push(
    //         { $and: [{ price: { $gt: +filterBy.minPrice}},{price: {$lt: +filterBy.maxPrice} }] }
    //     )
    // }

    // if(filterBy['Wifi']){
    //     criteria.$and.push(
    //         {"amenities":"Wifi"}
    //     )
    // }

    // if(filterBy['TV']){
    //     criteria.$and.push(
    //         {"amenities":"TV"}
    //     )
    // }
    // if(filterBy['Kitchen']){
    //     criteria.$and.push(
    //         {"amenities":"Kitchen"}
    //     )
    // }
    // if(filterBy['AC']){
    //     criteria.$and.push(
    //         {"amenities":"AC"}
    //     )
    // }

    // if(filterBy['Smoking allowed']){
    //     criteria.$and.push(
    //         {"amenities":"Smoking allowed"}
    //     )
    // }

    // if(filterBy['Pets allowed']){
    //     criteria.$and.push(
    //         {"amenities":"Pets allowed"}
    //     )
    // }

    // if(filterBy.hostId){
    //     criteria.$and.push(
    //         {"host._id":filterBy.hostId}
    //     )
    // }
    return criteria
}

async function update(order) {
    try {
        // peek only updatable fields!
        const orderToSave = {
            _id: ObjectId(user._id), // needed for the returnd obj
            username: user.username,
            fullname: user.fullname,
            score: user.score,
        }
        const collection = await dbService.getCollection('user')
        await collection.updateOne({ _id: userToSave._id }, { $set: userToSave })
        return userToSave;
    } catch (err) {
        logger.error(`cannot update user ${user._id}`, err)
        throw err
    }
}

module.exports = {
    query,
    remove,
    add,
    getById,
    update
}

