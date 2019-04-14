'use strict'
var url = "http://127.0.0.1:8000/";
var cursos;
var cont = 0;

$( document ).ready(function() {
    
    obtenerCursos();
    $('#cursos').change(function() {
        let index_curso = $('#cursos').val();
        generar_tabla(cursos[index_curso]);
    });

    $('#registrar').click(function(){
        let index_curso = $('#cursos').val();
        guardar_asistencia(cursos[index_curso]);
    });
    

    function obtenerCursos() {
        $.get(url + "cursos/", function(data, status){
            $('#cursos').empty();
            cursos = data;
            $.each(cursos, function (i, item) {
                $('#cursos').append($('<option>', { 
                    value: i,
                    text : item.nombre 
                }));
            });
            generar_tabla(cursos[0]);
        });
    }

    function generar_tabla(curso) {
        $('#table_body').html('');
        $.each(curso.estudiantes, function (index, item) {
            let row_number = "<td>" + (index+1) + "</td>";
            let row_name = "<td>" + item.nombre + "</td>";
            let row_sesiones = "";
            for (let i=0; i<item.asistencia.length; i++) {
                let is_checked = item.asistencia[i] != "0" ? "checked" : "" ;
                let sesion_td = '<td><input type="checkbox" class="form-check-input" name="check' + index + '" ' + is_checked + '></td>' ;
                row_sesiones += sesion_td;
            }
            $('#table_body').append("<tr>" + row_number + row_name + row_sesiones + "</tr>");
        });
        
    }

    function guardar_asistencia(curso) {
        cont = 0;
        $.each(curso.estudiantes, function (index, item) {
            let nueva_asistencia = "";
            $("input[name='check" + index + "']").each( function () {
                let asistencia_sesion = $(this).prop("checked") ? "1" : "0"; // Si el checkbox esta seleccionado, agrega un 1 al string, sino un 0
                nueva_asistencia += asistencia_sesion;
            });
            item.asistencia = nueva_asistencia;
            var parametros = {
                "id_estudiante" : item.id,
                "asistencia"    : item.asistencia,
            };
            $.ajax({
                    data:  parametros, //datos que se envian a traves de ajax
                    url:   url + "actualizar/", //archivo que recibe la peticion
                    type:  'post', //método de envio
                    beforeSend: function () {
                        $('#registrar').attr("disabled", true);
                    },
                    success:  function (response) { //una vez que el archivo recibe el request lo procesa y lo devuelve
                        cont++;
                        if(cont == curso.estudiantes.length) {
                            alert("Se ha actualizado correctamente la asistencia");
                            $('#registrar').removeAttr("disabled");
                        }
                    }
            });
        });
        

        }

});