// Middleware de logger para registrar todas las peticiones HTTP en Agrotrack

export function logger(req, res, next) {
    const timestamp = new Date().toISOString();  // Fecha y hora
    const method = req.method;                   // GET, POST, etc.
    const url = req.originalUrl || req.url;      // Ruta solicitada
    const ip = req.headers['x-forwarded-for'] || req.ip; // IP del cliente

    // Registro formateado
    console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`);

    next(); 
}
