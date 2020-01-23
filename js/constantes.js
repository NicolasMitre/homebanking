//valores constantes
var intentos = 0;
var services;

$.getJSON("/js/services.json", function(data) {
  services = data;
});
