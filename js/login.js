//variables
var users;
//funciones
loadUsers();
document.onkeydown = pulsarTecla;

function loadUsers() 
{
	var result = localStorage.getItem("users");
	if (result) 
	{
		users = JSON.parse(result);
	} 
	else 
	{
		 localStorage.setItem("users", JSON.stringify(usersList));
		 users = usersList;
	}
}

function pulsarTecla(e) //Al pulsar la tecla enter se validan los datos
{   										// aunque de igual manera tocando el boton sucede lo mismo
  var e = e || event;
  var tecla =  e.keyCode ;
  if(tecla==13)
  {
     login();
  }
}

//esta funcion pasa todos los parametros necesarios a la pagina principal
function login() 
{
	var username = document.getElementById('username').value
	var password = document.getElementById('password').value
	var respuesta;
	for(var i = 0; i < users.length; i++) 
	{
		if(username == users[i].username && password == users[i].password) 
		{
			respuesta = true;
			break;
		}
		else
		{
			respuesta = false;
		}
	}
	if(respuesta) 
	{
		localStorage.setItem("validar", 1);
		localStorage.setItem("currentUser", i);
		location.href = "homebanking.html";
	}
	else
	{
		alert("Contraseña y/o usuario incorrectos.");
		location.href = "index.html";
	}	
}