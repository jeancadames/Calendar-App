const { response } = require("express");
const Evento = require('../models/Evento');

const getEvento = async(req, resp = response) => {

    //populate metodo para rellenar datos de usuario, se le especifica que referencia se quiere rellenar
    const eventos = await Evento.find()
                                    .populate('user', 'name');

    resp.json({
        ok: true,
        eventos
    });
}
const crearEvento = async(req, resp = response) => {

    const evento = new Evento(req.body);

    try {

        evento.user = req.uid;

        const eventoGuardado = await evento.save();

        resp.json({
            ok: true,
            evento: eventoGuardado
        })

    } catch (error) {
        console.log(error);
        resp.status(500).json({
            ok: false,
            msg: 'hable con el admin'
        })
    }
}

const actualizarEvento = async(req, resp = response) => {

    const eventoId = req.params.id;
    const uid = req.uid;

    try {

        const evento = await Evento.findById(eventoId);

        if(!evento){
            resp.status(404).json({
                ok: false,
                msg: 'evento no existe por ese id'
            });
        }

        if(evento.user.toString() !== uid){
            return resp.status(401).json({
                ok: false,
                msg: 'No tiene acceso para editar este evento'
            });
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        //por defecto al actualizar envia el documento anterior para realizar alguna comparacion, para enviar la ultima informacion actualizada se pone {new: true}
        const eventoActualizado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento, {new: true});

        resp.json({
            ok: true,
            evento: eventoActualizado
        });


        
    } catch (error) {
        console.log(error);
        resp.status(500).json({
            ok: false,
            msg: 'hable con el admin'
        });
    }
}
const eliminarEvento = async(req, resp = response) => {

    const eventoId = req.params.id;
    const uid = req.uid;

    try {

        const evento = await Evento.findById(eventoId);

        if(!evento){
            resp.status(404).json({
                ok: false,
                msg: 'evento no existe por ese id'
            });
        }

        if(evento.user.toString() !== uid){
            return resp.status(401).json({
                ok: false,
                msg: 'No tiene acceso para eliminar este evento'
            })
        }

        await Evento.findByIdAndDelete(eventoId);

        resp.json({
            ok: true,  
        });

    } catch (error) {
        console.log(error);
        resp.status(500).json({
            ok: false,
            msg: 'hable con el admin'
        });
    }


}

module.exports = {
    getEvento,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}
