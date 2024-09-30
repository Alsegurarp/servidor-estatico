const express = require("express");
const fs = require("fs/promises");

const servidor = express();

servidor.use(express.static("./lista-colores"));


servidor.listen(3000)//Asignar el canal el cual será tomado 

