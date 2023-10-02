#!/bin/bash

# Lista de las semillas a ejectuar
archivos=("enfermedades.js" "especialidades.js" "medicamentos.js" "dosificaciones.js" "personas.js" "medicos.js" "turnos.js" "consultas.js" "diagnosticos.js" "tratamientos_farmacologicos.js")

# Itero sobre la lista y ejecuto cada archivo
for archivo in "${archivos[@]}"; do
    echo "Ejecutando $archivo-poblacion.sh"
    node "$archivo"
done
