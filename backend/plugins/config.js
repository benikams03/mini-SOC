import { MongoClient } from "mongodb";
import dotenv from "dotenv"
dotenv.config()

const login = new MongoClient(process.env.MONGO_URI)
const database = login.db('mini_soc')

export { database }