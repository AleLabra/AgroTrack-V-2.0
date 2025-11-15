import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { pool } from './db.js';
import { logger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';

// NUEVAS RUTAS Y CONTROLADORES
import contactoRouter from './routes/contactoRoutes.js';
import * as contactoController from './controllers/contactoController.js';

// Cargar variables de entorno
dotenv.config();

// Obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración del servidor
const PORT = process.env.PORT || 8888;

// Crear la aplicación Express
const app = express();

// Middleware para parsear JSON y datos de formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de logger
app.use(logger);

// Configurar motor de plantillas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Servir archivos estáticos desde /public
app.use(express.static('public'));


// -----------------------------------------------------
//  RUTAS WEB (páginas con HTML estático)
// -----------------------------------------------------

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/productos.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'productos.html'));
});

// Formulario de contacto tradicional (HTML)
app.get('/contacto.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'contacto.html'));
});

// Página de login tradicional
app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Estado del servidor
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});


//  NUEVO MÓDULO MODERNO DE CONTACTO (EJS / Controllers)

// Página de formulario usando EJS (no HTML estático)
app.get('/contacto', contactoController.mostrarFormulario);

// Procesar formulario
app.post('/contacto/enviar', contactoController.procesarFormulario);

// Listar consultas en vista EJS
app.get('/contacto/listar', contactoController.listarConsultas);


//  API REST (JSON) para Contactos
app.use('/api/contactos', contactoRouter);


//  MANEJO CENTRALIZADO DE ERRORES
app.use(errorHandler);


//  ERROR 404 (si ninguna ruta coincide)
app.use((req, res) => {
    res.status(404).render('errores/404');
});


//  INICIAR SERVIDOR//
app.listen(PORT, () => {
    console.log(`🚀 Servidor AgroTrack ejecutándose en http://localhost:${PORT}`);
    console.log(`📁 Sirviendo archivos desde ./public/`);
    console.log(`💾 Base de datos conectada: ${process.env.DB_NAME}`);
});

//  CIERRE DEL SERVIDOR
process.on('SIGINT', async () => {
    console.log('\n🛑 Cerrando servidor...');
    await pool.end();
    process.exit(0);
});
