import { MongoClient } from "mongodb";

const login = new MongoClient('mongodb://localhost:27017/')
const database = login.db('mini_soc')

export { database }