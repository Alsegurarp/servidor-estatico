const express = require("express");
const fs = require("fs/promises");

const servidor = express();


servidor.use(express.json); // Interceptará cualquier contenido en JSON y lo procesará, en la peticion se agregará una condicion .body
//interpreta el body de la peticion

servidor.post("/colores/nuevo", (peticion, respuesta) => {
//Quiero recibir informacion en JSON que haga match a los valores R + G + B
    console.log(peticion.body);
    respuesta.send("... x cosa");
} )

servidor.use(express.static("./lista-colores"));
servidor.use((peticion, respuesta) => {
respuesta.status(404);
respuesta.json({ Error : "Not found" });
})

servidor.listen(3000)//Asignar el canal el cual será tomado 

