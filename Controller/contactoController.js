// Controlador para API REST de Contactos
import * as contactoService from '../services/contactoService.js';

/* GET /api/contactos 
   Devuelve el listado completo de contactos en formato JSON*/
export async function listarContactos(req, res, next) {
    try {
        const contactos = await contactoService.getAllContactos();

        return res.json({
            success: true,
            data: contactos,
            count: contactos.length
        });

    } catch (error) {
        next(error);
    }
}

/* POST /api/contactos
   Crea un nuevo contacto validando los datos recibidos*/
export async function crearContacto(req, res, next) {
    try {
        const { nombre, email, mensaje } = req.body;

        // VALIDACIÓN → ahora se pasa correctamente como OBJETO
        const validation = contactoService.validateContactData({ 
            nombre, 
            email, 
            mensaje 
        });

        if (!validation.isValid) {
            return res.status(400).json({
                success: false,
                error: 'Error de validación',
                errors: validation.errors
            });
        }

        // CREACIÓN DEL CONTACTO → también recibe un OBJETO
        const nuevoContacto = await contactoService.createContacto(validation.data);

        return res.status(201).json({
            success: true,
            message: 'Contacto creado exitosamente',
            data: nuevoContacto
        });

    } catch (error) {
        next(error);
    }
}
