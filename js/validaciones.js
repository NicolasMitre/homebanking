function esNumeroPositivo(valorIngresado) //Comprueba si es un numero y ademas positivo
{
	var respuesta = false;

	if(isNaN(valorIngresado))
	{
		enviarMensaje("Por favor, ingrese un valor numerico.");
	}
	else if(valorIngresado == 0) 
	{
		enviarMensaje("Por favor, ingrese un valor distinto de 0.");
	}
	else if(valorIngresado < 0) 
	{
		enviarMensaje("Por favor, ingrese un valor positivo.");
	}
	else
	{
		return respuesta = true;
	}
}

function validadorCien(valorIngresado) //valida las extracciones que no sean divisores de 100
{
	var respuesta;
	valorIngresado = parseInt(valorIngresado);
	if((valorIngresado % 100) !=0) 
	{
		enviarMensaje("No se puede pedir montos de divisiones que no sean de $100.");
		respuesta = false;
	}
	else
	{
		respuesta = true;
	}
	return respuesta;
}

function cancelar(valorIngresado) // funciona como cancelar operacion seleccionada
{
	return valorIngresado != null;
}

function haySaldo(valor)
{
	valor = parseInt(valor);
	var respuesta = false;
	if(valor <= saldoCuenta)
	{
		respuesta = true;
	} 
	else
	{
		enviarMensaje('Saldo insuficiente.');
	}
	return respuesta;
}