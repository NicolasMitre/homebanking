//Declaración de variables
// var usuarios;

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

//Ejecución de las funciones que actualizan los valores de las variables en el HTML.

window.onload = function() {
  iniciarSesion();
};

//Funciones que tenes que completar
function cambiarLimiteDeExtraccion() {}

function extraerDinero() {}

function depositarDinero() {}

function pagarServicio() {}

function transferirDinero() {}

function iniciarSesion() {
  let usuarios;
  readJson().then(data => {
    usuarios = data;
    comprobarSesion(usuarios);
  });
}
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

// Sesion

function comprobarSesion(listaUsuarios) {
  for (var i = 0; i < listaUsuarios.length; i++) {
    if (
      listaUsuarios[i].accountId == "nicolas" &&
      listaUsuarios[i].password == "easypass"
    ) {
      console.log("Nico");
      break;
    } else {
      alert("error");
    }
  }
}
