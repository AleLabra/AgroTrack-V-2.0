// Middleware de logger para registrar todas las peticiones HTTP en Agrotrack

export default function logger(req, res, next) {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.originalUrl || req.url;
    const ip = req.headers['x-forwarded-for'] || req.ip;

    console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`);

    next();
}