// Controlador para manejar páginas HTML en Agrotrack
import { pool } from '../db.js';
import * as contactoService from '../services/contactoService.js';


/* FUNCIÓN PARA ESCAPAR HTML*/
function escapeHtml(text) {
    if (typeof text !== 'string') return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

/*  Mostrar lista de consultas en HTML*/
export async function listarConsultas(req, res, next) {
    let connection;

    try {
        connection = await pool.getConnection();

        const [rows] = await connection.execute(
            `SELECT id, fecha, nombre, email, mensaje 
             FROM contactos 
             ORDER BY fecha DESC`
        );

        connection.release();

        // Crear texto plano seguro para mostrar en textarea
        let contenido = '';
        rows.forEach(consulta => {
            const fecha = new Date(consulta.fecha)
                .toISOString()
                .slice(0, 19)
                .replace('T', ' ');

            contenido += `
Fecha: ${fecha}
Nombre: ${escapeHtml(consulta.nombre)}
Email: ${escapeHtml(consulta.email)}
Mensaje: ${escapeHtml(consulta.mensaje)}`;
        });

        res.render('consultasListar', {
            consultas: rows,
            contenido
        });

    } catch (error) {
        if (connection) connection.release();
        next(error);
    }
}

/* Procesar formulario de login (HTML) */
export function procesarLogin(req, res) {
    const usuario = req.body.usuario?.trim() || '';
    const clave = req.body.clave?.trim() || '';

    // Solo mostramos el resultado
    res.render('loginResultado', {
        usuario,
        clave
    });
}

/*Procesar formulario de contacto HTML */
export async function procesarContacto(req, res, next) {
    try {
        const nombre = req.body.nombre?.trim() || '';
        const email = req.body.email?.trim() || '';
        const mensaje = req.body.mensaje?.trim() || '';

        // Reutilizar validación centralizada del servicio
        const validation = contactoService.validateContactData({
            nombre,
            email,
            mensaje
        });

        if (!validation.isValid) {
            // Renderizar la vista de error de validación pasando los errores
            return res.status(400).render('errorValidacion', {
                errores: validation.errors,
                // opcional: reenviar los valores para que el form los muestre
                valores: validation.data
            });
        }

        // Crear el contacto usando el servicio (devuelve el objeto creado)
        const nuevoContacto = await contactoService.createContacto(validation.data);

        // Renderizar vista de confirmación (contactoEnviado.ejs)
        // Pasamos los datos del contacto recién creado
        return res.render('contactoEnviado', {
            nombre: nuevoContacto.nombre,
            email: nuevoContacto.email,
            mensaje: nuevoContacto.mensaje
        });

    } catch (error) {
        next(error);
    }
}

