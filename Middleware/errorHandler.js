export default function errorHandler(err, req, res, next) {
    console.error('🔥 Error en el servidor:', err);

    if (res.headersSent) {
        return next(err);
    }

    const statusCode = err.statusCode || err.status || 500;
    const message = err.message || 'Ha ocurrido un error inesperado.';

    if (req.path.startsWith('/api')) {
        return res.status(statusCode).json({
            success: false,
            error: true,
            message,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        });
    }

    return res.status(statusCode).render('error500', {
        mensaje: message
    });
}
