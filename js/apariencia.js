var flag = 1;

// esta funcion cambia el css para crear el menu invisible

function cambiaPropiedades() {
  if (flag) {
    document.getElementById("imgclick").style.transform = "rotate(180deg)";
    document.getElementById("barclick").style.marginRight = "0";
    document.getElementById("imgclick").style.marginRight = "31%";
    flag = !flag;
  } else {
    document.getElementById("barclick").style.marginRight = "-60%";
    document.getElementById("imgclick").style.marginRight = "1%";
    document.getElementById("imgclick").style.transform = "rotate(0deg)";
    flag = !flag;
  }
}

function changeTheme() {
  if (flag) {
    document.getElementById("panelTheme").style.top = "0";
    flag = !flag;
  } else {
    document.getElementById("panelTheme").style.top = "-300px";
    flag = !flag;
  }
}

function selectTheme(value) {
  switch (value) {
    case 0:
      document.body.classList.remove(
        "theme-divertido",
        "theme-gotico",
        "theme-rustico"
      );
      document.body.classList.add("theme-original");
      document.getElementById("cgimg").src = "img/opor.svg";
      changeTheme();
      break;
    case 1:
      document.body.classList.remove(
        "theme-original",
        "theme-gotico",
        "theme-rustico"
      );
      document.body.classList.add("theme-divertido");
      document.getElementById("cgimg").src = "img/opart.jpg";
      changeTheme();
      break;
    case 2:
      document.body.classList.remove(
        "theme-original",
        "theme-divertido",
        "theme-rustico"
      );
      document.body.classList.add("theme-gotico");
      document.getElementById("cgimg").src = "img/opgot.png";
      changeTheme();
      break;
    case 3:
      document.body.classList.remove(
        "theme-original",
        "theme-divertido",
        "theme-gotico"
      );
      document.body.classList.add("theme-rustico");
      document.getElementById("cgimg").src = "img/oprus.png";
      changeTheme();
      break;
  }
  theme = value;
  guardarValores();
}

function cargarSkins(valor) {
  changeTheme();
  selectTheme(valor);
  guardarValores();
}

//funciones que actualizan el valor de las variables en el HTML

function cargarNombreEnPantalla() {
  document.getElementById("nombre").innerHTML =
    "Bienvenido/a " + currentUser.nombreUsuario;
}

function actualizarSaldoEnPantalla() {
  document.getElementById("saldo-cuenta").innerHTML =
    "$" + saldoCuenta.toFixed(2);
}

function actualizarLimiteEnPantalla() {
  document.getElementById("limite-extraccion").innerHTML =
    "Tu límite de extracción es: $" + limiteExtraccion;
  document.getElementById("lim-dis").innerHTML =
    "Tu límite actual es de: $" + extraccionRestante;
}
function actualizarDeudaEnPantalla() {
  document.getElementById("deuda").innerHTML =
    "Tu prestamo actual es de: $ " + deuda.toFixed(2);
  document.getElementById("tasa").innerHTML =
    "Tu tasa de interes actual es de: %" + porcentaje;
}
