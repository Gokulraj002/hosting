const { MongoClient } = require("mongodb");
require('dotenv').config()
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
let db;

async function connectDB() {
    try {
        await client.connect();
        db = client.db("student");
        return db; 
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
}

function getDB() {
    if (!db) {
        throw new Error("Database connection is not available. Make sure to call connectDB first.");
    }
    return db;
}

module.exports = { connectDB, getDB };
