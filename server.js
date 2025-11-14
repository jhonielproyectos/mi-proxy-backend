// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000; 

// 🔥 CORRECCIÓN CLAVE: Habilita CORS para cualquier origen, incluyendo localhost:8080.
app.use(cors({
    origin: '*', 
    methods: 'GET',
    credentials: true,
}));

/**
 * Middleware para validar que solo se hagan peticiones a cuevana.biz
 */
const validarUrl = (req, res, next) => {
    const targetUrl = req.query.url;

    if (!targetUrl || !targetUrl.startsWith('https://cuevana.biz/')) {
        return res.status(403).send({ 
            error: 'URL no válida. El proxy solo permite https://cuevana.biz/.' 
        });
    }
    req.targetUrl = targetUrl;
    next();
};

// **RUTA PRINCIPAL DEL PROXY**
app.get('/fetch-html', validarUrl, async (req, res) => {
    const targetUrl = req.targetUrl;

    try {
        const response = await axios.get(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8'
            }
        });

        res.send(response.data);

    } catch (error) {
        const statusCode = error.response ? error.response.status : 500;
        res.status(statusCode).send({
            error: `Error al obtener el contenido de la URL: ${targetUrl}`
        });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor proxy listo en el puerto ${PORT}`);
});
