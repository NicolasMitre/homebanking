//Declaración de variables
var usuarios;

async function readJson() {
  try {
    config = {
      method: "GET"
    };
    var response = await fetch("js/JSON/accounts.json", config);
    var data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

readJson()
  .then(function(data) {
    usuarios = data;
  })
  .catch(function(e) {
    console.error("No se encuentra el archivo Json" + e);
  });

//Ejecución de las funciones que actualizan los valores de las variables en el HTML.
window.onload = function() {};
//Funciones que tenes que completar
function cambiarLimiteDeExtraccion() {}

function extraerDinero() {}

function depositarDinero() {}

function pagarServicio() {}

function transferirDinero() {}

function iniciarSesion() {}
//Funciones de carga de datos

//Funciones que actualizan el valor de las variables en el HTML
function cargarNombreEnPantalla() {
  document.getElementById("nombre").innerHTML = "Bienvenido/a " + nombreUsuario;
}

function actualizarSaldoEnPantalla() {
  document.getElementById("saldo-cuenta").innerHTML = "$" + saldoCuenta;
}

function actualizarLimiteEnPantalla() {
  document.getElementById("limite-extraccion").innerHTML =
    "Tu límite de extracción es: $" + limiteExtraccion;
}
