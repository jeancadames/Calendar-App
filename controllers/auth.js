const {response} = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const {generarJWT} = require('../helpers/jwt');

const createUser = async(req, resp = response) => {

    const {email, password} = req.body;   
    try {
        let usuario = await Usuario.findOne({email});

        if(usuario) {
            return resp.status(400).json({
                ok: false,
                msg: 'Un usuario existe con ese correo'
            });
        }

        usuario = new Usuario(req.body);

        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();

        //generar JWT
        const token = await generarJWT(usuario.id, usuario.name);

        resp.status(201).json({
            ok:true,
            uid: usuario.id,
            name: usuario.name,
            token
        });
    } catch (error) {
        console.log(error);
        resp.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
    

}

const loginUser = async(req, resp = response) => {

    const {email, password} = req.body;

    try {
        let usuario = await Usuario.findOne({email});

        if(!usuario) {
            return resp.status(400).json({
                ok: false,
                msg: 'Usuario y contraseña no coinciden'
            });
        }

        // confirmar las contraseñas

        const validPassword = bcrypt.compareSync(password, usuario.password);

        if(!validPassword) {
            return resp.status(400).json({
                ok: false,
                msg: 'Contraseña incorrecta'
            });
        }

        //Generar JWT
        const token = await generarJWT(usuario.id, usuario.name);

        resp.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })

        
    } catch (error) {
        console.log(error);
        resp.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

const revalidateToken = async(req, resp = response) => {

    const uid = req.uid
    const name = req.name;

    //generar un nuevo JWT y retornarlo en esta peticion

    const token = await generarJWT(uid, name);

    resp.json({
        ok:true,
        token,
        uid,
        name
    });
}

module.exports = {
    createUser,
    loginUser,
    revalidateToken,
}