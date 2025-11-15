// Servicio de lógica para Contactos
import { getConnection } from '../db.js';

//  Validaciones //
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function validateContactData({ nombre, email, mensaje }) {
    const errors = [];

    // Nombre
    if (!nombre || nombre.trim() === '') {
        errors.push('El nombre es obligatorio');
    } else if (nombre.trim().length > 255) {
        errors.push('El nombre no puede superar los 255 caracteres');
    }

    // Email
    if (!email || email.trim() === '') {
        errors.push('El email es obligatorio');
    } else if (!isValidEmail(email.trim())) {
        errors.push('El email no tiene un formato válido');
    } else if (email.trim().length > 255) {
        errors.push('El email no puede superar los 255 caracteres');
    }

    // Mensaje
    if (!mensaje || mensaje.trim() === '') {
        errors.push('El mensaje es obligatorio');
    } else if (mensaje.trim().length > 65535) {
        errors.push('El mensaje es demasiado largo');
    }

    return {
        isValid: errors.length === 0,
        errors,
        data: {
            nombre: nombre?.trim() || '',
            email: email?.trim() || '',
            mensaje: mensaje?.trim() || ''
        }
    };
}

// Obtener todos los contactos// 
export async function getAllContactos() {
    let connection;
    try {
        connection = await getConnection();
        const [rows] = await connection.execute(
            `SELECT id, nombre, email, mensaje, fecha 
             FROM contactos 
             ORDER BY fecha DESC`
        );
        connection.release();
        return rows;
    } catch (err) {
        if (connection) connection.release();
        throw new Error('Error al obtener el listado de contactos');
    }
}
//Crear nuevo contacto//
export async function createContacto({ nombre, email, mensaje }) {
    let connection;

    try {
        const fecha = new Date();

        connection = await getConnection();
        const [result] = await connection.execute(
            `INSERT INTO contactos (fecha, nombre, email, mensaje)
             VALUES (?, ?, ?, ?)`,
            [fecha, nombre, email, mensaje]
        );
        connection.release();

        // Obtener registro recién insertado
        connection = await getConnection();
        const [rows] = await connection.execute(
            `SELECT id, nombre, email, mensaje, fecha 
             FROM contactos 
             WHERE id = ?`,
            [result.insertId]
        );
        connection.release();

        return rows[0];
    } catch (err) {
        if (connection) connection.release();
        throw new Error('Error al crear el contacto');
    }
}
