// server.js (Versión para cualquier sitio)
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000; 

// Permite peticiones CORS desde cualquier origen (*)
app.use(cors({
    origin: '*', 
    methods: 'GET',
    credentials: true,
}));

/**
 * ❌ ELIMINAMOS LA FUNCIÓN DE VALIDACIÓN DE URL ❌
 * Esto permite que el proxy acceda a cualquier URL que se pase en el parámetro 'url'.
 */

// **RUTA PRINCIPAL DEL PROXY (Ahora sin validación de destino)**
app.get('/fetch-html', async (req, res) => {
    const targetUrl = req.query.url; // Obtenemos la URL de destino

    // Validar que el parámetro 'url' exista
    if (!targetUrl) {
        return res.status(400).send({ 
            error: 'Falta el parámetro "url" en la solicitud.' 
        });
    }

    try {
        // Realizamos la petición a la URL que nos pidan
        const response = await axios.get(targetUrl, {
            // Se recomienda enviar un User-Agent para simular un navegador real
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8'
            }
        });

        // Devolvemos el HTML al frontend
        res.send(response.data);

    } catch (error) {
        // Manejo de errores de conexión o HTTP del sitio destino
        const statusCode = error.response ? error.response.status : 500;
        res.status(statusCode).send({
            error: `Error al obtener el contenido de la URL de destino (${targetUrl})`,
            details: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor proxy universal listo en el puerto ${PORT}`);
});
