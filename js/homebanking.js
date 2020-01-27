// Global Variables

var currentUser = users[parseInt(localStorage.getItem("currentUser"))];
var saldoCuenta = currentUser.saldoCuenta;
var limiteExtraccion = currentUser.limiteExtraccion;
var extraccionRestante = limiteExtraccion;
var theme = currentUser.theme;
var registro = currentUser.registro;
var deuda = currentUser.prestamo;
var porcentaje = currentUser.tasa;

// Load the document and execute some functions

document.addEventListener("DOMContentLoaded", function(event) {
  comprobarCuenta();
  cargarSkins(theme);
  cargarNombreEnPantalla();
  actualizarSaldoEnPantalla();
  actualizarLimiteEnPantalla();
  actualizarDeudaEnPantalla();

  // Events that listen the buttons (refactored)

  document.getElementById("extraer").addEventListener("click", extraerDinero);
  document
    .getElementById("depositar")
    .addEventListener("click", depositarDinero);
  document.getElementById("servicios").addEventListener("click", pagarServicio);
  document
    .getElementById("transferir")
    .addEventListener("click", transferirDinero);
  document
    .getElementById("prestamos")
    .addEventListener("click", peticionDePrestamo);
  document
    .getElementById("cambiarlimiteextraccion")
    .addEventListener("click", cambiarLimiteDeExtraccion);
  document.getElementById("adelantar").addEventListener("click", adelantarDia);
  document.getElementById("registro").addEventListener("click", registerViewer);
  document.getElementById("logout").addEventListener("click", logout);
});

function extraerDinero() {
  checkDebt();
  if (extraccionRestante != 0) {
    var valorIngresado = showMessage("Ingrese cuanto dinero desea extraer.");
    if (cancelar(valorIngresado)) {
      if (
        esNumeroPositivo(valorIngresado) &&
        validadorCien(valorIngresado) &&
        haySaldo(valorIngresado) &&
        extraccionRestante - valorIngresado > -1
      ) {
        extraccionRestante -= valorIngresado;
        restarDinero(valorIngresado);
        sendMessage(
          "Se ha extraido satisfactoriamente: $" +
            valorIngresado +
            " de su cuenta y le queda un total de: $" +
            saldoCuenta +
            "."
        );
      } else {
        extraerDinero();
      }
    }
  } else {
    sendMessage(
      "No puede realizar mas extracciones por hoy, por favor vuelva mañana."
    );
  }
}

function depositarDinero() {
  if (deuda < 0) {
    var deposito = showMessage(
      "Ingrese cuanto desea depositar para saldar su deuda."
    );
    if (cancelar(deposito)) {
      if (deuda + deposito <= 0) {
        if (esNumeroPositivo(deposito)) {
          deposito = parseInt(deposito);
          deuda += deposito;
          if (deuda > 0) {
            saldoCuenta += deuda;
            sendMessage(
              "Se ha depositado la diferencia de su deuda a su cuenta en $" +
                deuda
            );
            deuda = 0;
          }
          sendMessage(
            "Se ha saldado $" +
              deposito +
              " de su deuda y su deuda queda en $" +
              deuda +
              "."
          );
          saveValues();
          actualizarDeudaEnPantalla();
          actualizarSaldoEnPantalla();
        }
      }
    }
  } else {
    var deposito = showMessage("Ingrese cuanto desea depositar.");
    if (cancelar(deposito)) {
      if (esNumeroPositivo(deposito)) {
        var fondoMax = 10000;
        if (saldoCuenta + parseInt(deposito) <= fondoMax) {
          sumarDinero(deposito);
          sendMessage(
            "Se ha depositado satisfactoriamente: $" +
              deposito +
              " de su cuenta y le queda un total de: $" +
              saldoCuenta +
              "."
          );
        } else {
          sendMessage(
            "Está superando su límite de caja, por favor no exceda su fondo maximo de $" +
              fondoMax
          );
        }
      } else {
        depositarDinero();
      }
    }
  }
}

function pagarServicio() {
  checkDebt();
  var opcion = showMessage(
    "¿Que servicio desea pagar? \n 1 - Agua $" +
      services[0].costo +
      ". \n2 - Telefono $" +
      services[1].costo +
      " \n3 - Luz $" +
      services[2].costo +
      " \n4 - Internet $" +
      services[3].costo +
      "."
  );
  verificarTarifa(opcion);
}

function transferirDinero() {
  checkDebt();
  if (saldoCuenta > 0) {
    var monto = showMessage("Ingrese el monto que desea transferir.");
    if (cancelar(monto)) {
      if (esNumeroPositivo(monto) && haySaldo(monto)) {
        var cuenta = showMessage(
          "Ingrese el numero de cuenta a la cual desea transferir. \n" +
            users[0].nombreUsuario +
            " = 0\n" +
            users[1].nombreUsuario +
            " = 1\n" +
            users[2].nombreUsuario +
            " = 2\n" +
            users[3].nombreUsuario +
            " = 3\n"
        );
        var passwordIn = showMessage(
          "Por favor, ingrese su clave para confirmar la transaccion."
        );
        if (passwordIn == currentUser.password) {
          if (
            cuenta == parseInt(localStorage.getItem("currentUser")) ||
            cuenta >= 4
          ) {
            sendMessage(
              "Por favor ingrese una cuenta que no sea la misma a la que está loggueado."
            );
            transferirDinero();
          } else {
            restarDinero(monto);
            sumarDineroCuenta(cuenta, monto);
            actualizarSaldoEnPantalla();
          }
        } else {
          sendMessage("Contraseña incorrecta.");
          intentos++;
          if (intentos == 3) {
            var pistaPass = currentUser.password;
            for (var i = 0; i < 4; i++) {
              var j = Math.floor(
                Math.random() * parseInt(currentUser.password.length)
              );
              pistaPass = pistaPass.replace(pistaPass[j], "*");
            }
            alert("Le ayudamos a recordar su contraseña era = " + pistaPass);
          } else if (intentos == 6) {
            sendMessage(
              "Ha fallado demasiadas veces por cuestiones de seguridad su cuenta se ha vaciado totalmente."
            );
            saldoCuenta = 0;
            actualizarSaldoEnPantalla();
            saveValues();
            intentos = 0;
          }
        }
      }
    }
  } else {
    sendMessage("No dispone de fondos para transferir");
  }
}

function peticionDePrestamo() {
  checkDebt();
  var limitePrestamo = 2000;
  var prestamo = showMessage("Ingrese el monto que desea que se le preste.");
  if (prestamo <= limitePrestamo) {
    if (prestamo > 0) {
      var intereses = (prestamo * porcentaje) / 100;
      sendMessage(
        "Se le ha prestado la suma de $" +
          prestamo +
          " \nRecuerde que debe devolver la suma de $" +
          prestamo +
          " + $" +
          intereses +
          " de intereses." +
          "\nPor día los intereses incrementan un 10% y al 50% se debitan automaticamente."
      );
      sumarDinero(prestamo);
      deuda -= parseInt(prestamo) + intereses;
      actualizarDeudaEnPantalla();
    } else {
      porcentaje = 10;
    }
  } else {
    sendMessage(
      "Ingrese un valor menor a su limite de prestamo de $" + limitePrestamo
    );
    peticionDePrestamo();
  }
}

function cambiarLimiteDeExtraccion() {
  limiteExtraccion = showMessage(
    "Por favor, ingrese el nuevo limite de extraccion. Tenga en cuenta que el limite no se recargara hasta mañana."
  );
  if (cancelar(limiteExtraccion)) {
    actualizarLimiteEnPantalla();
    sendMessage(
      "Se ha actualizado su limite de extraccion. Regrese mañana (Adelantar Dia) para es comprobar los cambios. \n \n Su nuevo limite de extraccion es: " +
        limiteExtraccion +
        "."
    );
  }
}

// This functionality simulates that date is advanced one day

function adelantarDia() {
  checkDebt();
  if (deuda < 0) {
    porcentaje += 10;
    deuda = deuda + (deuda * porcentaje) / 100;
  }
  extraccionRestante = limiteExtraccion;
  cobrarDeudaAutomaticamente();
  actualizarLimiteEnPantalla();
  actualizarDeudaEnPantalla();
}

function logout() {
  saveValues();
  localStorage.setItem("validar", 0);
  location.href = "index.html";
}

// It allows see, erase or update the action's register

function registerViewer() {
  alert(registro);
  if (registro != "Registro de acciones \n//----------------------------//\n") {
    var borrar = showMessage("¿Desea borrar el registro? \n SI o NO");
    if (borrar == "SI" || borrar == "si" || borrar == "Si" || borrar == "s") {
      registro = "Registro de acciones \n//----------------------------//\n";
      alert("Se ha borrado exitosamente el registro.");
    }
  }
}

function sumarDinero(deposito) {
  deposito = parseInt(deposito);
  saldoCuenta += deposito;
  saveValues();
  actualizarSaldoEnPantalla();
  actualizarLimiteEnPantalla();
}

function restarDinero(deposito) {
  deposito = parseInt(deposito);
  saldoCuenta -= deposito;
  saveValues();
  actualizarSaldoEnPantalla();
  actualizarLimiteEnPantalla();
}

// Check what kind of service you would like to pay

function verificarTarifa(opcion) {
  opcion = parseInt(opcion);
  switch (opcion) {
    case 1:
      {
        pagar(services[opcion - 1].costo, services[opcion - 1].servicio);
      }
      break;
    case 2:
      {
        pagar(services[opcion - 1].costo, services[opcion - 1].servicio);
      }
      break;
    case 3:
      {
        pagar(services[opcion - 1].costo, services[opcion - 1].servicio);
      }
      break;
    case 4:
      {
        pagar(services[opcion - 1].costo, services[opcion - 1].servicio);
      }
      break;

    default:
      sendMessage("Algo salio mal.");
      break;
  }
}

// Effect the discount of money corresponding

function pagar(tarifa, servicio) {
  if (saldoCuenta >= tarifa) {
    saldoCuenta -= tarifa;
    sendMessage(
      "Se ha abonado satisfactoriamente: $" +
        tarifa +
        " del servicio de " +
        servicio +
        " y le queda un total de: $" +
        saldoCuenta +
        "."
    );
    saveValues();
    actualizarSaldoEnPantalla();
  } else {
    sendMessage("No hay fondos.");
  }
}

// Check that the sesion been logged succefull to evade jump from index to homebanking

function comprobarCuenta() {
  var validar = localStorage.getItem("validar");
  if (validar != "1") {
    location.href = "index.html";
  }
}

function showMessage(message) {
  var valorIngresado = prompt(message, "");
  return valorIngresado;
}

// Collect the debt after a certain amount of fictitious days pased

function cobrarDeudaAutomaticamente() {
  var dias = porcentaje / 10;
  if (dias % 5 == 0) {
    saldoCuenta += deuda;
    deuda = 0;
    sendMessage(
      "Se ha cobrado automaticamente de su deposito su deuda + intereses del %" +
        porcentaje
    );
    porcentaje = 10;
    actualizarSaldoEnPantalla();
    actualizarDeudaEnPantalla();
  }
}

// Check that you do not have too much debt avoiding that you do not continue using the service

function checkDebt() {
  while (saldoCuenta <= -2000) {
    sendMessage("Tu cuenta fue inhabilitada hasta que saldes tu prestamo.");
    depositarDinero();
  }
}

function sendMessage(mensaje) {
  registro += mensaje;
  registro += "\n//----------------------------//\n";
  alert(mensaje);
}

// When a transaction is made, the other account is notified that through registration

function sumarDineroCuenta(cuenta, monto) {
  var currentUserCuenta = users[parseInt(cuenta)];
  var saldoCuenta = currentUserCuenta.saldoCuenta;
  var registro = currentUserCuenta.registro;
  registro +=
    "Recibiste una transferencia de $" + monto + " de una cuenta amiga";
  registro += "\n//----------------------------//\n";
  saldoCuenta += parseInt(monto);
  currentUserCuenta.registro += registro;
  currentUserCuenta.saldoCuenta = parseInt(saldoCuenta);
  users[parseInt(cuenta)] = currentUserCuenta;
  localStorage.setItem("users", JSON.stringify(users));
  sendMessage(
    "Se ha depositado de tu cuenta a la cuenta de " +
      users[parseInt(cuenta)].nombreUsuario +
      "el total de $" +
      monto
  );
}

// Save all of data in the localstorage that acting like a base of data

function saveValues() {
  currentUser.limiteExtraccion = parseInt(limiteExtraccion);
  currentUser.saldoCuenta = parseInt(saldoCuenta);
  currentUser.theme = parseInt(theme);
  currentUser.registro = registro;
  currentUser.prestamo = parseInt(deuda);
  currentUser.tasa = parseInt(porcentaje);
  users[parseInt(localStorage.getItem("currentUser"))] = currentUser;
  localStorage.setItem("users", JSON.stringify(users));
}