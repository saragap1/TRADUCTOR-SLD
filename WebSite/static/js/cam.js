// Se guardan los canvas y el video en variables para luego ser usados
var video = document.getElementById("video_camara");
var canvas = document.getElementById("canva_camara");
var ctx = canvas.getContext("2d");
var othercanvas = document.getElementById("canva_camara_pequenia");
var ctx2 = othercanvas.getContext("2d");


var modelo = null;
var size = 400;
var camaras = [];

var currentStream = null;
var facingMode = "user"; 

// Se importa el modelo en una variable
(async () => {
    console.log("Cargando modelo...");
    modelo = await tf.loadLayersModel("/static/modelo_definitivo/model.json");
    console.log("Modelo cargado...");
})();

// Todo el tiempo se va a estar ejecutando mostrarCamara()
window.onload = function() {
    mostrarCamara();
}

// Permite saber si existe alguna camara posible y si es asi, comienza a procesarla con el canvas 400x400 guardando su data
// luego se ejecuta predecir()
function mostrarCamara() {

    var opciones = {
        audio: false,
        video: {
            facingMode: "user", width: size, height: size
        }
    };
    if(navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia(opciones)
            .then(function(stream) {
                currentStream = stream;
                video.srcObject = currentStream;
                procesarCamara();
                predecir();
            })
            .catch(function(err) {
                alert("No se pudo utilizar la camara :(");
                console.log("No se pudo utilizar la camara :(", err);
                alert(err);
            })
    } else {
        alert("No existe la funcion getUserMedia... oops :( no se puede usar la camara");
    }
}

// Funcion creada por si es necesario cambiar la camara, detectando si hay otra camaras posibles en el dispositivo
function cambiarCamara() {
    if (currentStream) {
        currentStream.getTracks().forEach(track => {
            track.stop();
        });
    }

    facingMode = facingMode == "user" ? "environment" : "user";

    var opciones = {
        audio: false,
        video: {
            facingMode: facingMode, width: size, height: size
        }
    };


    navigator.mediaDevices.getUserMedia(opciones)
        .then(function(stream) {
            currentStream = stream;
            video.srcObject = currentStream;
        })
        .catch(function(err) {
            console.log("Oops, hubo un error", err);
        })
}

// Funcion donde se procesa el canva 400x400 cada 20 milisegundos y sus datos son guardados
function procesarCamara() {
        
    var ctx = canvas.getContext("2d");

    ctx.drawImage(video, 0, 0, size, size, 0, 0, size, size);

    setTimeout(procesarCamara, 20);
}


// Funcion en el que primero se ejecuta resample_single, funcion que tiene el objetivo de transformar los datos del canvas 400x400 al canvas de 28x28, llamada othercanvas
// luego se recorre cada valor de la escala RGB con valor alfa de los datos guardados en imgData de cada uno de los pixeles y se aplica una formula para calcular el
// nivel de escala de grises y posterior se aplica un filtro para exagerar los pixeles para apoyar al modelo en su prediccion y por ultimo se colaca los valores de la 
// escala de grises de cada pixel ya calculados en la lista 28 para que cuando se complete, se continue con la siguiente fila de 28 pixeles hasta que se completen los 784 pixeles.
// Una vez que se logra esto, se le aplica el elemento de la libreria tensorflowjs llamada tensor4 que nos permitira usar la variable donde se guardo el modelo y poder predecir
// la lista que acabamos de guardar, dandonos todos los resultados de todas las letras, luego tomamos el de mayor puntaje para decidir la prediccion, dandonos la posicion de la letra de la predicion
// y con eso lo buscamos en la lista Labels que contiene las letras y asi porfin, lograr mandarlo al elemento con ID "resultado" en el HTML y poder mostrarlo.

function predecir() {
    if (modelo != null) {
        //Pasar canvas a version 28x28
        resample_single(canvas, 28, 28, othercanvas);

        var ctx2 = othercanvas.getContext("2d");

        var imgData = ctx2.getImageData(0,0,28,28);
        
        var arr = []; 
        var arr28 = [];
        for (var p=0; p < imgData.data.length; p+=4) {
            //console.log("r",imgData.data[p]);
            //console.log("g",imgData.data[p+1]);
            //console.log("b",imgData.data[p+2]);
            //console.log("a",imgData.data[p+3]);
            var valor = (0.299*imgData.data[p] + 0.587*imgData.data[p+1] + 0.114*imgData.data[p+2])/255;
            var c = Math.round(valor*255);
            
            
            if (c < 75) {
                valor = 0; //exagerarlo
    
            } else  if (c>200){
                valor = 1; //al infinito
            }
        
            //console.log("Gris",valor*255);
            
            arr28.push([valor]); 
            if (arr28.length == 28) {
                arr.push(arr28);
                arr28 = [];
            }
        }

        arr = [arr]; 
        
        var tensor4 = tf.tensor4d(arr);
        var resultados = modelo.predict(tensor4).dataSync();
        //console.log("resultados", resultados);


        var mayorIndice = resultados.indexOf(Math.max.apply(null, resultados));
    
        var labels = ['A','B','C','D','E','F','G','H','I','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y'];
        
        //console.log("Indice", mayorIndice);
        //console.log("Prediccion", labels[mayorIndice]);

        document.getElementById("resultado").innerHTML = labels[mayorIndice];
    }

    setTimeout(predecir, 100);
}



// Funcion que permite modificar la resolucion de un canvas a otro canvas, en nuestro caso, el canvas de 400x400 se va a reducir a una resolucion de 28x28 que seria la variable
// resize_canvas digitada, luego de aplicar el algoritmo, nos arroja la data del canal RGB con posiciones Rojo:0, Verde: 1, Azul: 2 y alfa: 3, el alfa tiene siempre el valor 255
// debido a que el algoritmo esta recibiendo data a color, a cambio si no lo fuera, el alfa seria la escala de grises y los demas canales estarian en 0.

// Funcion usada de un video guia para modificar la resolucion de un canvas a otro canvas, tomada de:

// Tech, R. [@RingaTech]. (2021c, julio 28). Usa tus modelos de Tensorflow en páginas web | Exportación a Tensorflow.js. Youtube. https://www.youtube.com/watch?v=JpE4bYyRADI

function resample_single(canvas, width, height, resize_canvas) {
    var width_source = canvas.width;
    var height_source = canvas.height;
    width = Math.round(width);
    height = Math.round(height);

    var ratio_w = width_source / width;
    var ratio_h = height_source / height;
    var ratio_w_half = Math.ceil(ratio_w / 2);
    var ratio_h_half = Math.ceil(ratio_h / 2);

    var ctx = canvas.getContext("2d");
    var ctx2 = resize_canvas.getContext("2d");
    var img = ctx.getImageData(0, 0, width_source, height_source);
    var img2 = ctx2.createImageData(width, height);
    var data = img.data;
    var data2 = img2.data;

    for (var j = 0; j < height; j++) {
        for (var i = 0; i < width; i++) {
            var x2 = (i + j * width) * 4;
            var weight = 0;
            var weights = 0;
            var weights_alpha = 0;
            var gx_r = 0;
            var gx_g = 0;
            var gx_b = 0;
            var gx_a = 0;
            var center_y = (j + 0.5) * ratio_h;
            var yy_start = Math.floor(j * ratio_h);
            var yy_stop = Math.ceil((j + 1) * ratio_h);
            for (var yy = yy_start; yy < yy_stop; yy++) {
                var dy = Math.abs(center_y - (yy + 0.5)) / ratio_h_half;
                var center_x = (i + 0.5) * ratio_w;
                var w0 = dy * dy; //pre-calc part of w
                var xx_start = Math.floor(i * ratio_w);
                var xx_stop = Math.ceil((i + 1) * ratio_w);
                for (var xx = xx_start; xx < xx_stop; xx++) {
                    var dx = Math.abs(center_x - (xx + 0.5)) / ratio_w_half;
                    var w = Math.sqrt(w0 + dx * dx);
                    if (w >= 1) {
                        //pixel too far
                        continue;
                    }
                    //hermite filter
                    weight = 2 * w * w * w - 3 * w * w + 1;
                    var pos_x = 4 * (xx + yy * width_source);
                    //alpha
                    gx_a += weight * data[pos_x + 3];
                    weights_alpha += weight;
                    //colors
                    if (data[pos_x + 3] < 255)
                        weight = weight * data[pos_x + 3] / 250;
                    gx_r += weight * data[pos_x];
                    gx_g += weight * data[pos_x + 1];
                    gx_b += weight * data[pos_x + 2];
                    weights += weight;
                }
            }
            data2[x2] = gx_r / weights;
            data2[x2 + 1] = gx_g / weights;
            data2[x2 + 2] = gx_b / weights;
            data2[x2 + 3] = gx_a / weights_alpha;

            
        }
    }
    


    ctx2.putImageData(img2, 0, 0);
    
}


//Funciones creados para poder ejecutar los botones del HTML

const agregarBtn = document.getElementById('agregar-btn');
const espacioBtn = document.getElementById('espacio-btn');
const borrarBtn = document.getElementById('borrar-btn');
const borrarTodoBtn = document.getElementById('borrar-todo-btn');
const J = document.getElementById('J-btn');
const Z = document.getElementById('Z-btn');
const Ñ = document.getElementById('Ñ-btn');


agregarBtn.addEventListener('click', agregarLetra);
espacioBtn.addEventListener('click', agregarEspacio);
borrarBtn.addEventListener('click', borrarLetra);
borrarTodoBtn.addEventListener('click', borrarTodo);
J.addEventListener('click', agregar_J);
Z.addEventListener('click', agregar_Z);
Ñ.addEventListener('click', agregar_Ñ);


const resultadoElement = document.getElementById('resultado');
const idContentInput = document.getElementById('id_content');

function agregarLetra() {
  const resultadoText = resultadoElement.textContent;
  idContentInput.value += resultadoText;
}
function agregarLetra() {
    const resultadoText = resultadoElement.textContent;
    idContentInput.value += resultadoText;
 }

function agregarEspacio() {
    var cuadroDeTexto = document.getElementById("id_content");
    cuadroDeTexto.value += " ";
}

function borrarLetra() {
    var cuadroDeTexto = document.getElementById("id_content");
    cuadroDeTexto.value = cuadroDeTexto.value.slice(0, -1);
}

function borrarTodo() {
    document.getElementById("id_content").value = "";
}

function agregar_J() {
    var cuadroDeTexto = document.getElementById("id_content");
    cuadroDeTexto.value += "J";
  }
  
  function agregar_Ñ() {
    var cuadroDeTexto = document.getElementById("id_content");
    cuadroDeTexto.value += "Ñ";
  }
  
  function agregar_Z() {
    var cuadroDeTexto = document.getElementById("id_content");
    cuadroDeTexto.value += "Z";
  }