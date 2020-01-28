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

document.addEventListener("DOMContentLoaded", function() {
  readJson()
    .then(function(data) {
      iniciarSesion(data);
    })
    .catch(function(e) {
      console.error("no se encuentra el archivo json" + e);
    });
});

function cambiarLimiteDeExtraccion() {}

function extraerDinero() {}

function depositarDinero() {}

function pagarServicio() {}

function transferirDinero() {}

function iniciarSesion(datos) {
  comprobarSesion(datos);
}

function comprobarSesion(datos) {
  if (recuperarLocalStorage()) {
    var nombre = prompt("nombre", "");
    for (var i = 0; i < datos.length; i++) {
      if (nombre == datos[i].username) {
        alert("entre");
        break;
      }
    }
  } else {
    actualizarlocalStorage(datos);
  }
}

function recuperarLocalStorage() {
  return localStorage.getItem("usuarios");
}

function actualizarlocalStorage(datos) {
  localStorage.setItem("usuarios", JSON.stringify(datos));
}

//Funciones que actualizan el valor de las variables en el HTML
function cargarNombreEnPantalla() {
  document.getElementById("nombre").innerHTML = "Bienvenido/a ";
}

function actualizarSaldoEnPantalla() {
  document.getElementById("saldo-cuenta").innerHTML = "$";
}

function actualizarLimiteEnPantalla() {
  document.getElementById("limite-extraccion").innerHTML =
    "Tu límite de extracción es: $";
}
