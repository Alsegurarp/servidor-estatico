const express = require("express");
const {writeFile, readFile} = require("fs/promises");

const servidor = express();
//las 3 const crean el contexto para el backend y el backend - De esta manera se puede ejecutar

servidor.use(express.json()); // Interceptará cualquier contenido en JSON y lo procesará, en la peticion se agregará una condicion .body
//interpreta el body de la peticion

servidor.use(express.static("./lista-colores")); //Middleware - Si algo encaja en ésta URL, lo mostrará - SINO, debemos de crear la funcion
// "siguiente" - en caso que no haya similitud.

servidor.get("/colores", async (peticion, respuesta) => {
    let colores = JSON.parse( await readFile( "./colores.json" ));
    respuesta.json(colores);
});

servidor.post("/colores/nuevo", async (peticion, respuesta) => {
//Quiero recibir informacion en JSON que haga match a los valores R + G + B
    try{
        let colores = JSON.parse( await readFile( "./colores.json" ));
        //Crear un ID - unico - Crear serie de numeros - 
        let id = colores.length > 0 ? colores[colores.length -1].id + 1 : 1;
        //Ya le damos id
        let {r,g,b} = peticion.body;
        //Ahora hay que darle al objeto informacion con .push
        colores.push({id, r, g, b});
        console.log(colores);
        await writeFile("./colores.json", JSON.stringify(colores)); 
        //Necesita 2 cosas, cual es el fichero donde vamos a escribir, y lo que vamos a escribir
        //Espera a que escriba un valor, pero no esta retornando nada
        //writeFile es una funcion ciega, solo puede fallar si no tenemos permiso de escribir, incluso si nos equivocamos de fichero 
        //writeFile crea el fichero que encaje con el nombre.
        respuesta.json({id});

    }catch(error){ //Cualquier cosa que falle, salta a catch 
        respuesta.status(500);
        respuesta.json({ error : "Internal Server Error" });
    }//Si pasa algun error - para el server es un "error interno" - 

}); /* Promesa - promesa.then( ) y si dentro del then( ) incluye otra promesa, se puede hacer una serie que 
la cual esté mas clausurada debe terminar para que suceda la siguiente
     */ 

servidor.use( (error, peticion, respuesta, siguiente ) => { 
    respuesta.status(400); //Como se le responderá al server
    respuesta.join({ error : "bad request" }); 
} ); 



servidor.use((peticion, respuesta) => {
respuesta.status(404);
respuesta.json({ Error : "Not found" });
}) // Toda peticion que llegue aqui es porque no encontró similitud, por ende NO HAY NINGUNA SIMILITUD A LA PETICION

servidor.listen(process.env.PORT || 3000)
//Asignar el canal el cual será tomado 
//Para visitarlo es usando el "localhost/3000" en tu navegador.

