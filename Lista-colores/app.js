const contenedorColores = document.querySelector("ul");
const formulario = document.querySelector("form");
const input = document.querySelector('input[type="text"]')
const parrafoError = document.querySelector(".error")


function li(id,r,g,b){
    let item = document.createElement("li");
    item.innerText = [r,g,b].join(",");
    item.style.backgroundColor = `rgb(${[r,g,b].join(",")})`;

    item.addEventListener("click", () => item.remove());
    return item;
}//crear li, poner background color, ponerle el texto y retornar ,0,
//Cada vez que yo la invoque, permite crear item con color
//En cada function li  que invoquemos se encuentra un objeto, por lo que puede ser modificado si lo invocamos - ahora le daremos click y se eliminará.

fetch("/colores")
.then(respuesta => respuesta.json())
.then(colores => {
colores.forEach(({id,r,g,b}) => {
    contenedorColores.appendChild(li(id,r,g,b));
})
});



formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    parrafoError.classList.remove("visible");

    let msgError = "No puede ser un espacio vacío"; //Creamos una variable para invocarla y si queremos que se edite, le damos el nuevo significado a la variable

    if(input.value.trim() != ""){
        let posibleValor = input.value.trim().split(",").map(n => Number(n));

        let valido = posibleValor.length == 3;

        if(valido){
            let contador = 0;
            while(valido && contador < posibleValor.length){
                valido = posibleValor [contador] - parseInt(posibleValor[contador]) == 0 && posibleValor[contador] >= 0 && posibleValor[contador] <= 255; //El usuario no te está colocando decimales - otro true or false       /* Ahora la variable valido tiene un nuevo valor */
                contador++;
            }

            if(valido){
                let [r,g,b] = posibleValor;

                return fetch("/colores/nuevo", {
                    method : "POST", //despues del method se debe mandar el cuerpo de lo que vamos a mandar - body
                    body : JSON.stringify({ r,g,b }), 
                    headers : {
                            "Content-type" : "application/json"
                    }
                })
                    .then(respuesta =>  respuesta.text()) //se lee el contenido como un string - Despues se pasa
                        .then(({id,error}) => { // Se recibe el contenido y ahora se imprime 
                            if( !error ) {
                                contenedorColores.appendChild(li(id, r,g,b));
                                return input.value = ""; 
                            }
                        });
                    };
                    // ahora cada vez que se haga submit y se muestre el color en la pantalla, el espacio del input no contiene nada, así puede volver a ser llenado
                    //Con el return ahora dejará de leer el código en caso que ésta linea sea ejecutada y por ende no llegará al msgError
            }
        } 
        msgError = "Tres valores entre 0 - 255 separados por comas";

    parrafoError.innerText = msgError;
    parrafoError.classList.add("visible");
});

