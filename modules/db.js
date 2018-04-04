
const mongoClient = require('mongodb').MongoClient;
const DB_URL = 'mongodb://Hao:123@ds235169.mlab.com:35169/metropolia'
const ObjectID = require('mongodb').ObjectID

function connectDB(callback) {

    mongoClient.connect(DB_URL, function (error, client) {

        if (error){
            console.log('数据库链接失败');
            return false;
        }
        callback(client)

    })
}

exports.ObjectID = ObjectID

/**
 * query Data
 *
 * @param tableName
 * @param json
 * @param callback
 */
exports.find = function (tableName,json, callback) {

    connectDB(function (client) {
        const db = client.db('metropolia')
        const result = db.collection(tableName).find(json)

        result.toArray(function (error, data) {
            callback(error,data)
        })
    })

}

/**
 * insert Data
 *
 * @param tableName
 * @param json
 * @param callback
 */
exports.insert = function (tableName,json, callback) {

    connectDB(function (client) {
        const db = client.db('metropolia')
        db.collection(tableName).insertOne(json, function (error, data) {
            callback(error,data)
        })
    })

}

/**
 * edit Data
 *
 * @param tableName
 * @param json
 * @param callback
 */
exports.update = function (tableName,json1, json2, callback) {

    connectDB(function (client) {
        const db = client.db('metropolia')
        db.collection(tableName).updateOne(json1,{$set: json2},function (error, data) {
            callback(error,data)
        })
    })

}

/**
 * delete Data
 *
 * @param tableName
 * @param json
 * @param callback
 */
exports.delete = function (tableName,json, callback) {

    connectDB(function (client) {
        const db = client.db('metropolia')
        db.collection(tableName).deleteOne(json,function (error, data) {
            callback(error,data)
        })
    })

}