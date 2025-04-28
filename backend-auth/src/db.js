const {MongoClient}= require ('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function connect(){
try {
    await client.connect();
    console.log('Conectado a mongoDB');
    return client.db(); //Devuelve la instancio de la base de datos
} catch (error) {
    console.error('Error al conectar a MongoDB:',error);
    throw error;
}
}

const db=connect();
module.exports=db;