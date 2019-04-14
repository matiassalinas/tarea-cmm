'use strict'
var url = "http://127.0.0.1:8000/";

$(function(){
    var frm = $('#form');
    frm.submit(function (event) {
        var nombre_curso = $('#nombre').val();
        var estudiantes = $('#estudiantes').val();
        var parametros = {
            "nombre_curso" : nombre_curso,
            "estudiantes"    : estudiantes,
        };
        $.ajax({
                data:  parametros, //datos que se envian a traves de ajax
                url:   url + "crear/", //archivo que recibe la peticion
                type:  'post', //método de envio
                beforeSend: function () {
                    $('#submit').attr("disabled", true);
                },
                success:  function (response) { //una vez que el archivo recibe el request lo procesa y lo devuelve
                    alert("Se ha creado correctamente el curso");
                    frm.trigger("reset");   
                },
                error: function(err) {
                    alert("Error en Servidor");
                },
                complete : function() {
                    $('#submit').removeAttr("disabled");
                }
        });
        event.preventDefault();
    });
  // jQuery methods go here...

});