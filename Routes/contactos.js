import { Router } from 'express';
import { listarContactos, crearContacto } from '../controllers/contactoController.js';

const router = Router();

// GET /api/contactos - Listar todos los contactos (API JSON)
router.get('/', listarContactos);

// POST /api/contactos - Crear nuevo contacto (API JSON)
router.post('/', crearContacto);

export default router;
