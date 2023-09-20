import express from 'express'
import morgan from 'morgan'
import http from 'http'
import cors from 'cors'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import {PORT, url} from './config.js'
import ruta_persona from './routes/ruta_persona.js'
import ruta_medicamento from './routes/ruta_medicamento.js'
import ruta_tratamiento_farmacologico from './routes/ruta_tratamiento_farmacologico.js'

const app = express()

// Creamos el servidor con el modulo http por defecto en NodeJS
const server = http.createServer(app)

// Vemos las peticiones por consola utilizando el paquete morgan en modo dev
app.use(morgan('dev'))

// Middleware para analizar cuerpos de a través de la URL
app.use(bodyParser.urlencoded({ extended: false }))
// Cualquier tipo de petición lo convertimos a json
app.use(bodyParser.json())

app.use('/api', ruta_persona)
app.use('/api', ruta_medicamento)
app.use('/api', ruta_tratamiento_farmacologico)


// Conexion a la base de datos
mongoose.connect(url).then(() => {
    console.log('Conexion a la base de datos establecida')
      
    // Escucha al puerto 
    server.listen(PORT, () => {
        console.log('Servidor ejecutandose en http://localhost:', PORT)
    })
})