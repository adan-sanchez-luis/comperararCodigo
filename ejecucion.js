//cargamos el primer archivo al textarea
window.addEventListener('load', inicio1, false);

function inicio1() {
    document.getElementById('archivo1').addEventListener('change', cargar1, false);
}

function cargar1(ev) {
    document.getElementById('datos1').innerHTML = 'Nombre del archivo:' + ev.target.files[0].name + '<br>' +
        'Tamaño del archivo:' + ev.target.files[0].size + '<br>' +
        'Tipo MIME:' + ev.target.files[0].type;
    var arch1 = new FileReader();
    arch1.addEventListener('load', leer1, false);
    arch1.readAsText(ev.target.files[0]);
}

function leer1(ev) {
    document.getElementById('editor1').value = ev.target.result;
}
//cargamos el segundo archivo al textarea
window.addEventListener('load', inicio2, false);

function inicio2() {
    document.getElementById('archivo2').addEventListener('change', cargar2, false);
}

function cargar2(ev) {
    document.getElementById('datos2').innerHTML = 'Nombre del archivo:' + ev.target.files[0].name + '<br>' +
        'Tamaño del archivo:' + ev.target.files[0].size + '<br>' +
        'Tipo MIME:' + ev.target.files[0].type;
    var arch2 = new FileReader();
    arch2.addEventListener('load', leer2, false);
    arch2.readAsText(ev.target.files[0]);
}

function leer2(ev) {
    document.getElementById('editor2').value = ev.target.result;
}

function limpiar() {
    document.getElementById("archivo1").value = "";
    document.getElementById("archivo2").value = "";
    document.getElementById("editor1").value = "";
    document.getElementById("editor2").value = "";
    document.getElementById("datos1").innerHTML = "";
    document.getElementById("datos2").innerHTML = "";
    document.getElementById("final").innerHTML = "";
}

//comparamos
function comper() {
    document.getElementById('comparar').addEventListener('change', compara, false);
}

function compara(ev) {
    // Obtenemos las lineas de los textos
    var txt1 = document.getElementById("editor1").value.split("\n");
    var txt2 = document.getElementById("editor2").value.split("\n");
    var html = "";
    var aux = "";
    var cont1 = 0;
    var cont2 = 0;
    var pos = -1;
    var estado = 0; // 0 = ambos; 1 = texto 1; 2 = texto 2
    // Vamos recorriendo ambos textos
    while (cont1 < txt1.length && cont2 < txt2.length) {
        if (txt1[cont1] == txt2[cont2]) {
            // Si son iguales
            // Si hay texto previo distinto al tipo actual lo mostramos
            if (estado != 0) {
                html += '<span class="cod' + estado + '" style="color: red;">' + aux + '</span>';
                aux = "";
            }
            // Escribimos el texto en una variable auxiliar
            // Para mostrarlo por bloques
            aux += txt1[cont1] + "\n";
            // Aumentamos el puntero de los textos
            cont1++;
            cont2++;
            // Marcamos como líneas iguales
            estado = 0;
        } else {
            // Busco si la linea1 está en texto2
            // si no está es que se trata de una linea modificada o insertada
            var ok = false;
            pos = -1;
            // Comprobamos si la línea está en el otro texto
            for (var i = cont2; i < txt2.length; i++) {
                ok = ok || (txt1[cont1] == txt2[i]);
                if (ok && pos >= 0) {
                    pos = i;
                }
            }
            if (!ok) {
                // Texto modificado o insertado
                // Si hay texto previo distinto al tipo actual lo mostramos
                if (estado != 1) {
                    html += '<span class="cod' + estado + '">' + aux + '</span>';
                    aux = "";
                }
                estado = 1;
                aux += txt1[cont1++] + "\n";
            } else {
                // Texto insertado en el segundo texto
                // Si hay texto previo distinto al tipo actual lo mostramos
                if (estado != 2) {
                    html += '<span class="cod' + estado + '">' + aux + '</span>';
                    aux = "";
                }
                estado = 2;
                aux += txt2[cont2++] + "\n";
            }
        }
    }
    // Si hay texto auxiliar no mostrado lo mostramos
    if (aux != "") {
        html += '<span class="cod0">' + aux + '</span>';
    }
    // Si sobre texto en el segundo texto lo mostramos
    if (cont2 < txt2.length) {
        aux = '<span class="cod2">';
        for (var i = cont2; i < txt2.length; i++) {
            aux += txt2[i] + "\n";
        }
        aux += "</span>";
        html += aux;
    }
    // Si sobre texto en el segundo texto lo mostramos
    if (cont1 < txt1.length - 1) {
        aux = '<span class="cod1">';
        for (var i = cont1; i < txt1.length; i++) {
            aux += txt1[i] + "\n";
        }
        aux += "</span>";
        html += aux;
    }
    // Modificamos el contenedor del resultado
    //
    /* var areahtml=document.getElementById("final");
    var contenido= document.createElement("div");
        contenido.innerHTML = html;
    areahtml.appendChild(contenido); */

    // Modificamos el contenedor del resultado
    var md = window.markdownit({
        highlight: function (str, lang) {
          if (lang && hljs.getLanguage(lang)) {
            try {
              return hljs.highlight(str, { language: lang }).value;
            } catch (__) {}
          }
  
          return ""; // use external default escaping
        },
      });
    var html2 = md.render(" ```java\n" + html + "\n``` ")
    html2 = html2.replace(';&lt;','<').replace('&gt;','>');
    console.log(html2);
    document.getElementById("final").innerHTML = html2;
}