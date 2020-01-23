//variables
var objUser = users[parseInt(localStorage.getItem("currentUser"))];
var saldoCuenta = objUser.saldoCuenta;
var	limiteExtraccion = objUser.limiteExtraccion;
var extraccionRestante = limiteExtraccion;
var theme = objUser.theme;
var registro = objUser.registro;
var deuda = objUser.prestamo;
var porcentaje = objUser.tasa;

document.addEventListener('DOMContentLoaded', function(event) //carga el documento y ejecuta algunas funciones
{	
	comprobarCuenta();
	cargarSkins(theme);
	cargarNombreEnPantalla();	
	actualizarSaldoEnPantalla();
	actualizarLimiteEnPantalla();
	actualizarDeudaEnPantalla();

// eventos que escuchan los botones
// esto ayuda a separar el html del javascript
	var extract = document.getElementById("extraer");
	extract.addEventListener("click", function(){
		extraerDinero();
	});
	var depositar = document.getElementById("depositar");
	depositar.addEventListener("click", function(){
		depositarDinero();
	});
	var servicios = document.getElementById("servicios");
	servicios.addEventListener("click", function(){
		pagarServicio();
	});
	var transferir = document.getElementById("transferir");
	transferir.addEventListener("click", function(){
		transferirDinero();
	});
	var prestamos = document.getElementById("prestamos");
	prestamos.addEventListener("click", function(){
		peticionDePrestamo();
	});
	var cambiarLimite = document.getElementById("cambiarlimiteextraccion");
	cambiarLimite.addEventListener("click", function(){
		cambiarLimiteDeExtraccion();
	});
	var adelantar = document.getElementById("adelantar");
	adelantar.addEventListener("click", function(){
		adelantarDia();
	});
	var registro = document.getElementById("registro");
	registro.addEventListener("click", function(){
		verRegistro();
	});
	var salir = document.getElementById("logout");
	salir.addEventListener("click", function(){
		logout();
	});
})

//funciones generales
function extraerDinero() 
{
	verificarDeuda();
	if(extraccionRestante != 0) 
	{
		var valorIngresado = mostrarMensaje("Ingrese cuanto dinero desea extraer.");		
		if(cancelar(valorIngresado))
		{
			if(esNumeroPositivo(valorIngresado) && 
		     	validadorCien(valorIngresado) && 
		     	  haySaldo(valorIngresado) && 
		     		  (extraccionRestante - valorIngresado) > -1)
	    {
				extraccionRestante -= valorIngresado;
	    	restarDinero(valorIngresado);
			  enviarMensaje('Se ha extraido satisfactoriamente: $' + valorIngresado + ' de su cuenta y le queda un total de: $' + saldoCuenta + '.');
			}      	
			else
			{
				extraerDinero();
			}
		}
	}
	else
	{
		enviarMensaje('No puede realizar mas extracciones por hoy, por favor vuelva mañana.');
	}
}

function depositarDinero() 
{
	if(deuda < 0)
	{
		var deposito = mostrarMensaje('Ingrese cuanto desea depositar para saldar su deuda.');
		if(cancelar(deposito))
		{
			if((deuda + deposito) <= 0) 
			{
				if(esNumeroPositivo(deposito))
				{
					deposito = parseInt(deposito);
					deuda += deposito;
					if(deuda > 0) 
					{	
						saldoCuenta += deuda;
						enviarMensaje('Se ha depositado la diferencia de su deuda a su cuenta en $' + deuda);
						deuda = 0;
					}
					enviarMensaje('Se ha saldado $' + deposito + ' de su deuda y su deuda queda en $' + deuda + '.');
					guardarValores();
					actualizarDeudaEnPantalla();
					actualizarSaldoEnPantalla();
				}
			}
		}
	}
	else
	{
		var deposito = mostrarMensaje('Ingrese cuanto desea depositar.');
		if(cancelar(deposito))
		{
			if(esNumeroPositivo(deposito))
			{ 
				var fondoMax = 10000;
				if((saldoCuenta + parseInt(deposito)) <= fondoMax) 
				{
					sumarDinero(deposito);
					enviarMensaje('Se ha depositado satisfactoriamente: $' + deposito + ' de su cuenta y le queda un total de: $' + saldoCuenta + '.');
				}
				else
				{
					enviarMensaje('Está superando su límite de caja, por favor no exceda su fondo maximo de $' + fondoMax);
				}
			}
			else
			{
				depositarDinero();
			}
		}
	}
}

function pagarServicio() 
{		
	verificarDeuda();
	var opcion = mostrarMensaje('¿Que servicio desea pagar? \n 1 - Agua $'+ services[0].costo +'. \n2 - Telefono $'+services[1].costo+' \n3 - Luz $'+services[2].costo+' \n4 - Internet $'+services[3].costo+'.');
	verificarTarifa(opcion);
}

function transferirDinero() 
{ 
	verificarDeuda();
	if(saldoCuenta > 0) 
	{
		var monto = mostrarMensaje('Ingrese el monto que desea transferir.');
		if(cancelar(monto))
		{
			if(esNumeroPositivo(monto) && haySaldo(monto)) 
			{
				var cuenta = mostrarMensaje('Ingrese el numero de cuenta a la cual desea transferir. \n' + users[0].nombreUsuario + " = 0\n" + users[1].nombreUsuario + " = 1\n" + users[2].nombreUsuario + " = 2\n" + users[3].nombreUsuario + " = 3\n");
				var passwordIn = mostrarMensaje('Por favor, ingrese su clave para confirmar la transaccion.');
				if(passwordIn == objUser.password) 
				{
					if(cuenta == parseInt(localStorage.getItem("currentUser")) || cuenta >= 4) 
					{
						enviarMensaje('Por favor ingrese una cuenta que no sea la misma a la que está loggueado.');
						transferirDinero();
					}
					else
					{
						restarDinero(monto);
						sumarDineroCuenta(cuenta, monto);
						actualizarSaldoEnPantalla();
					}
				}
				else
				{
					enviarMensaje('Contraseña incorrecta.');
					intentos++;
					if(intentos == 3) 
					{
						var pistaPass = objUser.password;
						for (var i = 0; i < 4; i++) 
						{							
							var j = Math.floor(Math.random() * parseInt(objUser.password.length)); 
							pistaPass = pistaPass.replace(pistaPass[j], "*");
						}
						alert("Le ayudamos a recordar su contraseña era = " + pistaPass);
					}
					else if(intentos == 6) 
					{
						enviarMensaje('Ha fallado demasiadas veces por cuestiones de seguridad su cuenta se ha vaciado totalmente.');
						saldoCuenta = 0;
						actualizarSaldoEnPantalla();
						guardarValores();
						intentos = 0;
					}
				}
			}
		}
	}
	else
	{
		enviarMensaje('No dispone de fondos para transferir');
	}
}

function peticionDePrestamo()
{ 
	verificarDeuda();
	var limitePrestamo = 2000;
	var prestamo = mostrarMensaje('Ingrese el monto que desea que se le preste.');
	if(prestamo <= limitePrestamo)
	{
		if(prestamo > 0) 
		{
			var intereses = (prestamo * porcentaje) / 100;
			enviarMensaje('Se le ha prestado la suma de $'+prestamo+' \nRecuerde que debe devolver la suma de $'+prestamo+' + $'+intereses+' de intereses.' + '\nPor día los intereses incrementan un 10% y al 50% se debitan automaticamente.');
			sumarDinero(prestamo);
			deuda -= parseInt(prestamo) + intereses;
			actualizarDeudaEnPantalla();
		}
		else
		{
			porcentaje = 10;
		}
	} 
	else 
	{
		enviarMensaje('Ingrese un valor menor a su limite de prestamo de $'+limitePrestamo);
		peticionDePrestamo();
	}
}

function cambiarLimiteDeExtraccion() 
{
	limiteExtraccion = mostrarMensaje('Por favor, ingrese el nuevo limite de extraccion. Tenga en cuenta que el limite no se recargara hasta mañana.');
	if(cancelar(limiteExtraccion))
	{
		actualizarLimiteEnPantalla();
		enviarMensaje('Se ha actualizado su limite de extraccion. Regrese mañana (Adelantar Dia) para es comprobar los cambios. \n \n Su nuevo limite de extraccion es: '+limiteExtraccion+'.');
	}
}	

function adelantarDia() //Adelanta un día ficticio asi se puede volver a retirar dinero y actualizar la tasa
{
	verificarDeuda();
	if(deuda < 0) 
	{
		porcentaje += 10;
		deuda = deuda + (deuda * porcentaje) / 100;
	}
	extraccionRestante = limiteExtraccion;
	cobrarDeudaAutomaticamente();
	actualizarLimiteEnPantalla();
	actualizarDeudaEnPantalla();
}

function logout()
{
	guardarValores();
	localStorage.setItem("validar", 0);
  location.href = "index.html";
}

function verRegistro() // permite ver, borrar o actualizar el registro de acciones
{
	alert(registro);
	if(registro != "Registro de acciones \n//----------------------------//\n") 
	{
		var borrar = mostrarMensaje('¿Desea borrar el registro? \n SI o NO');
		if(borrar == "SI" || borrar == "si" || borrar == "Si" || borrar == "s") 
		{
			registro = "Registro de acciones \n//----------------------------//\n";
			alert("Se ha borrado exitosamente el registro.");
		}
	}
}

function sumarDinero(deposito)
{
	deposito = parseInt(deposito);
	saldoCuenta += deposito;
	guardarValores();
	actualizarSaldoEnPantalla();
	actualizarLimiteEnPantalla();
}

function restarDinero(deposito)
{
	deposito = parseInt(deposito);
	saldoCuenta -= deposito;
	guardarValores();
	actualizarSaldoEnPantalla();
  actualizarLimiteEnPantalla();

}
//mas funciones

function verificarTarifa(opcion) //verifica que clase de servicio se desea pagar
{	
	opcion=parseInt(opcion);
	switch(opcion)
	{
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
			enviarMensaje('Algo salio mal.'); 
			break;
	}
}

function pagar(tarifa, servicio) //efectua el descuento de dinero correspondiente
{
	if(saldoCuenta >= tarifa)
	{
		saldoCuenta-=tarifa;
		enviarMensaje('Se ha abonado satisfactoriamente: $' + tarifa + ' del servicio de '+ servicio +' y le queda un total de: $' + saldoCuenta + '.');
		guardarValores();
		actualizarSaldoEnPantalla();
	}
	else
	{
		enviarMensaje('No hay fondos.');
	}
}

function comprobarCuenta() // comprueba que la cuenta se haya loggueado para evitar saltar del index al homebanking
{
	var validar = localStorage.getItem("validar");
	if(validar != "1")
	{
		location.href = "index.html";
	}
}

function mostrarMensaje(message) //muestra un mensaje
{
	var valorIngresado = prompt(message,'');
	return valorIngresado;
}

function cobrarDeudaAutomaticamente() //cobra la deuda luego de cierta cantidad de días ficticios pasados.
{
	var dias = porcentaje / 10;
	if((dias % 5) == 0) 
	{
		saldoCuenta += deuda;
		deuda = 0;
		enviarMensaje('Se ha cobrado automaticamente de su deposito su deuda + intereses del %' + porcentaje);
		porcentaje = 10;
		actualizarSaldoEnPantalla();
		actualizarDeudaEnPantalla();
	}
}

function verificarDeuda() // verifica que no debas demasiado dinero evitando que sigas usando el servicio
{
	while(saldoCuenta <= -2000)
	{
		enviarMensaje('Tu cuenta fue inhabilitada hasta que saldes tu prestamo.');
		depositarDinero();
	}
}

function enviarMensaje(mensaje) // envia un mensaje al registro para llevar una lista de acciones
{
	registro += mensaje;
	registro += "\n//----------------------------//\n";
	alert(mensaje);
}

/*cuando se efectua una transferencia se le 
avisa a la cuenta a la que se le transfiere en el registro*/
function sumarDineroCuenta(cuenta, monto) 
{
	var objUserCuenta = users[parseInt(cuenta)];
	var saldoCuenta = objUserCuenta.saldoCuenta;
	var registro = objUserCuenta.registro;
	registro += "Recibiste una transferencia de $" + monto + " de una cuenta amiga";
	registro += "\n//----------------------------//\n";
	saldoCuenta += parseInt(monto);
	objUserCuenta.registro += registro;
	objUserCuenta.saldoCuenta = parseInt(saldoCuenta);
	users[parseInt(cuenta)] = objUserCuenta;
	localStorage.setItem("users", JSON.stringify(users));
	enviarMensaje('Se ha depositado de tu cuenta a la cuenta de '+ users[parseInt(cuenta)].nombreUsuario + 'el total de $' + monto);
}
function guardarValores() //guarda todos los datos en el localstorage que actua como base de datos
{
	objUser.limiteExtraccion = parseInt(limiteExtraccion);
	objUser.saldoCuenta = parseInt(saldoCuenta);
	objUser.theme = parseInt(theme);
	objUser.registro = registro;
	objUser.prestamo = parseInt(deuda);
	objUser.tasa = parseInt(porcentaje);
	users[parseInt(localStorage.getItem("currentUser"))] = objUser;
	localStorage.setItem("users", JSON.stringify(users));
}