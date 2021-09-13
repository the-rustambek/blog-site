const { MongoClient} = require("mongodb")

const MONGO_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING;
const client = new MongoClient(MONGO_CONNECTION_STRING);

async function mongodb(){
    try{
        await client.connect();
        const db =  await client.db("blog-site");
        const users =  db.collection("users");
        const contact = db.collection("contact");
        return{ 
            users,
            contact,
        };
    }
    catch(error){
        console.log("MongoDB Error", error);
    }
}

module.exports = mongodb;