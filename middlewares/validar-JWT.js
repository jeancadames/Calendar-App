const {response} = require('express');
const jwt = require('jsonwebtoken');

const validarJWT = (req, resp = response, next) => {

    //X-token headers
    const token = req.header('X-token');

    if(!token){
        return resp.status(401).json({
            ok: false,
            msg: 'no hay token en la peticion'
        });
    }

    try {

        const {uid, name} = jwt.verify(
            token,
            process.env.SECRET_JWT_SEED
        );

        req.uid = uid;
        req.name = name;

    } catch (error) {
        return resp.status(401).json({
            ok: false,
            msg: 'token no valido'
        });
    }

    next();

}

module.exports = {
    validarJWT
}