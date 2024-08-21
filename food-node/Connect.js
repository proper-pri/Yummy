const {MongoClient} = require("mongodb");
const url = "mongodb://127.0.0.1:27017";
const database = "dbPri";
const client = new MongoClient(url);

async function dbConnection(){
    var result = await client.connect();
    let dbm = result.db(database);
    return dbm.collection("FoodAppMongo")

}

module.exports = dbConnection;