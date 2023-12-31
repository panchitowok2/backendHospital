import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import {urlTest, appDebug, url} from './config.js'
import ruta_persona from './routes/ruta_persona.js'
import ruta_medicamento from './routes/ruta_medicamento.js'
import ruta_tratamiento_farmacologico from './routes/ruta_tratamiento_farmacologico.js'
import ruta_medico from "./routes/ruta_medico.js"
import ruta_turno from "./routes/ruta_turno.js"
import ruta_consulta from "./routes/ruta_consulta.js"
import ruta_diagnostico from "./routes/ruta_diagnostico.js"
import ruta_historia_clinica from "./routes/ruta_historia_clinica.js"
import ruta_enfermedades from "./routes/ruta_enfermedades.js"
import ruta_especialidades from "./routes/ruta_especialidades.js"

const app = express()

// Creamos el servidor con el modulo http por defecto en NodeJS
//const server = http.createServer(app)

// Vemos las peticiones por consola utilizando el paquete morgan en modo dev
app.use(morgan('dev'))
app.use(cors());
// Middleware para analizar cuerpos de a través de la URL
app.use(bodyParser.urlencoded({ extended: false }))
// Cualquier tipo de petición lo convertimos a json
app.use(bodyParser.json())

app.use('/api', ruta_persona)
app.use("/api", ruta_medico)
app.use("/api", ruta_turno)
app.use("/api", ruta_consulta)
app.use("/api", ruta_diagnostico)
app.use("/api", ruta_historia_clinica)
app.use("/api", ruta_medicamento)
app.use("/api", ruta_tratamiento_farmacologico)
app.use("/api", ruta_enfermedades)
app.use("/api", ruta_especialidades)

var urlConnection = '';
if(appDebug){
    urlConnection=urlTest;
}else{
    urlConnection=url;
}
// Conexion a la base de datos
mongoose.connect(urlConnection).then(() => {
    console.log('Conexion a la base de datos establecida')
})
export default app;