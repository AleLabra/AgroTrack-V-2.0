// Middleware centralizado para manejar errores 
export function errorHandler(err, req, res, next) {
    console.error('🔥 Error en el servidor:', err);

    // Si Express ya envió respuestas, delegamos
    if (res.headersSent) {
        return next(err);
    }

    // Código de estado y mensaje
    const statusCode = err.statusCode || err.status || 500;
    const message = err.message || 'Ha ocurrido un error inesperado.';

    /* RESPUESTA PARA PETICIONES API*/
    if (req.path.startsWith('/api')) {
        return res.status(statusCode).json({
            success: false,
            error: true,
            message,
            // Muestra stack solo en desarrollo
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        });
    }

    /* RESPUESTA PARA PÁGINAS HTML */
    return res.status(statusCode).render('error500', {
        mensaje: message
    });
}
