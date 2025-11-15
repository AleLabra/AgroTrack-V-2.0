import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Configuración de MySQL usando variables del .env
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
};

// Crear pool de conexiones MySQL
const pool = mysql.createPool({
    ...dbConfig,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Obtener una conexión del pool
export async function getConnection() {
    try {
        const connection = await pool.getConnection();
        return connection;
    } catch (error) {
        console.error('❌ Error al obtener la conexión a MySQL:', error.message);

        if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('💡 Revisá el archivo .env: Usuario o contraseña incorrecta.');
        }

        if (error.code === 'ENOTFOUND') {
            console.error('💡 No se encontró el host definido en DB_HOST.');
        }

        throw error;
    }
}

export { pool };
