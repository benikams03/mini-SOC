import { MongoClient } from "mongodb";

// const login = new MongoClient('mongodb://localhost:27017/')
const login = new MongoClient('mongodb+srv://benikams03_db_user:oxN9pPILxaaGvsIX@cluster0.pag65an.mongodb.net')
const database = login.db('mini_soc')

export { database }