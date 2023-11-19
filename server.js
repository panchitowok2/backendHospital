import app from './index.js';
import http from 'http';
import {PORT} from './config.js'

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log('Servidor ejecutandose en http://localhost:', PORT)
});
