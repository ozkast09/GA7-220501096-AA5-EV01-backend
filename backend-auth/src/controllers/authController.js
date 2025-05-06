
const bcrypt=require('bcrypt');
const dbPromise=require('../db');

const userCollectionName='users';

exports.require=async (req,res)=>{
    try {
        const db=await dbPromise;
        const{username,password}=req.body;

        if(!username || !password){
            return res.status(400).json({error:'Por favor, proporciona un usuario y una contraseña.'});
        }

        const existingUser= await db.collection(userCollectionName).findOne({username});

        if (existingUser) {
            return res.status(409).json({error:'El usuario ya existe.'});
        }

        const hashedPassword= await bcrypt.hash(password,10);
        const result= await db.collection(userCollectionName).insertOne({username,password:hashedPassword});

        res.status(201).json({error:'Registro exitoso.'});

    } catch (error) {
        console.error('Error al registrar usuario.',error);
        res.status(500).json({Error:'Error interno al registrar usuario.'});
        
    }
};

exports.login=async(req,res)=>{
    try {
        const db =await dbPromise;
        const {username,password}=req.body;

        if(!username || !password){
            return res.status(400).json({error:'Por favor proporciona un usuario y una contraseña'});
        }

        const user = await db.collection(userCollectionName).findOne({username});

        if (!user){
            return res.status(401).json({error: 'Error en la autenticacion.'});
        }

        const paswordMatch= await bcrypt.compare(password, user.password);

       if (paswordMatch) {
        res.status(200),json({message: 'Autenticacion satisfactoria', userId: user._id});
        
       } else {
        res.status(401).json({error:'Error en la autenticacion'});
       }

    } catch (error) {
        console.error('Error al iniciar sesion:',error);
        res.status(500).json({error:'Error interno del servidor al iniciar sesion'});
    }
};
