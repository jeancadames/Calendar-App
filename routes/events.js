//Rutas de usuario
// host + api/events 

const { Router } = require("express");
const { check } = require("express-validator");

const { getEvento, crearEvento, actualizarEvento, eliminarEvento } = require("../controllers/events");
const { isDate } = require("../helpers/isDate");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-JWT");

// Todas tienen que pasar por la validacion del JWT


const router = Router();

router.use(validarJWT);

// Obtener eventos
router.get(
    '/',
    getEvento
);

//Crear un nuevo evento
router.post(
    '/', 
    [
        check('title', 'titulo es obligatorio').not().isEmpty(),
        check('start', 'fecha de inicio es obligatoria').custom(isDate),
        check('end', 'fecha de finalizacion es obligatoria').custom(isDate),
        validarCampos

    ],
    crearEvento
);

//Actualizar evento
router.put(
    '/:id',
    [
        check('title', 'titulo es obligatorio').not().isEmpty(),
        check('start', 'fecha de inicio es obligatoria').custom(isDate),
        check('end', 'fecha de finalizacion es obligatoria').custom(isDate),
        validarCampos

    ],
    actualizarEvento
);

//Borrar evento
router.delete(
    '/:id',
    eliminarEvento
);

module.exports = router;