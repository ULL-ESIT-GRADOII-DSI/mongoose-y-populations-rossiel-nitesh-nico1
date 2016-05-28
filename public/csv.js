// See http://en.wikipedia.org/wiki/Comma-separated_values
(() => {
"use strict"; // Use ECMAScript 5 strict mode in browsers that support it
 
const handleFileSelect = (evt) => {
  evt.stopPropagation();
  evt.preventDefault();

 var files = evt.target.files; 

  var reader = new FileReader();
  reader.onload = (e) => {
  
    $("#original").val(e.target.result);
  };
  reader.readAsText(files[0])
}

// Drag and drop: el fichero arrastrado se vuelca en la textarea de entrada 
const handleDragFileSelect = (evt) => {
  evt.stopPropagation();
  evt.preventDefault();

  var files = evt.dataTransfer.files; // FileList object.

  var reader = new FileReader();
  reader.onload = (e) => {
  
    $("#original").val(e.target.result);
    evt.target.style.background = "white";
  };
  reader.readAsText(files[0])
}

const handleDragOver = (evt) => {
  evt.stopPropagation();
  evt.preventDefault();
  evt.target.style.background = "yellow";
}


$(document).ready(() => {
    let original = document.getElementById("original");  
    if (window.localStorage && localStorage.original) {
      original.value = localStorage.original;
    }
    
    
    
    
 $("#usuario").click( () => { 
      var informacion = $('#userid').val();
      $.get('/bonito' , {
         informacion},
         (data) => {
        for (var i = 0; i < 4; i++) {
            console.log ("mostrando pepino %o", data);
            
            if (data[i]) {
                $('button.example2').get(i).className = "example2";
                $('button.example2').get(i).textContent = data[i].id;
            }
            else{
                 $('button.example2').get(i).className = "example2";
                $('button.example2').get(i).textContent = "Elemento vacío";
            }
        }
            
         
        });
    });
    
    
    
 $("#parse").click( () => {
        if (window.localStorage) localStorage.original = original.value;
        $.get("/csv", 
          { input: original.value }, 
          fillTable,
          'json'
        );
   });

    //Request AJAX para que se calcule la tabla 
    $("#parse").click( () => {
        if (window.localStorage) localStorage.original = original.value;
        $.get("/csv", 
          { input: original.value }, 
          fillTable,
          'json'
        );
   });
   
//Botones de ejemplo   
   
   $("#saving").click( () => { 
      var dataString = $('#original').val();
  
      console.log('Valor dataString: '+ dataString);
      if (window.localStorage) localStorage.original = original.value;
      var id=$('#id').val();
      
      $.get('/mongo/' + id , {
         dataString
        });
        
        
       $.get("/encuentra", {}, (data) => {

        for (var i = 0; i < 4; i++) {
            if (data[i]) {
                $('button.example').get(i).className = "example";
                $('button.example').get(i).textContent = data[i].id;

            }
        }
    });
});



//Botones de usuario

      $("#saving_usuario").click( () => { 
       var dataString = $('#original').val();
       var informacion = $('#userid').val();
      console.log('Valor dataString: '+ dataString);
     // if (window.localStorage) localStorage.original = original.value;
      var id=$('#id2').val();
      
      console.log('Valor id: ' + id);
      
      $.get('/botonusuario/' + id, {
         dataString,
         informacion 
        });
        
        console.log('Valor informacion: ' + informacion);
      $.get('/bonito' , {
         informacion},
         (data) => {
        console.log ("entrando aqui ");
        for (var i = 0; i < 4; i++) {
            console.log ("mostrando pepino %o", data);
            
            if (data[i]) {
                $('button.example2').get(i).className = "example2";
                $('button.example2').get(i).textContent = data[i].id;
            }
            else{
                 $('button.example2').get(i).className = "example2";
                $('button.example2').get(i).textContent = "Elemento vacío";
            }
        }
            
         
    });
          
});

    
    
const resultTemplate = `
<div class="contenido">
      <table class="center" id="result">
          <% _.each(rows, (row) => { %>
          <tr class="<%=row.type%>">
              <% _.each(row.items, (name) =>{ %>
              <td><%= name %></td>
              <% }); %>
          </tr>
          <% }); %>
      </table>
  </p>
</div>
`;

// Volcar la tabla con el resultado en el HTML 
const fillTable = (data) => { 
  $("#finaltable").html(_.template(resultTemplate, { rows: data.rows })); 
};
    
   // botones para rellenar el textarea 
    $('button.example').each( (_,y) => {
         //console.log($(y).text());

     $(y).click( () => { 
       $.get("/imput", {
            id: $(y).text()
       },
        (data) => {
            $("#original").val(data[0].data);
        });
       });
   });

   
// Botones para rellenar el textarea 
    $('button.example2').each( (_,y) => {
         //console.log($(y).text());
     $(y).click( () => { 
       $.get("/strong", {
            id: $(y).text(),
       },
        (data) => {
            console.log("datamagico" + data + "tuprimalacoja");
            if (data==""){
                $("#original").val("Elemento vacío");
            }
            else
            $("#original").val(data[0].data);
        });
       });
   });
   
   
    $.get("/encuentra", {}, (data) => {

        for (var i = 0; i < 4; i++) {
            if (data[i]) {
                $('button.example').get(i).className = "example";
                $('button.example').get(i).textContent = data[i].id;

            }
        }
    });
    

    // Setup the drag and drop listeners.
    //var dropZone = document.getElementsByClassName('drop_zone')[0];
    let dropZone = $('.drop_zone')[0];
    dropZone.addEventListener('dragover', handleDragOver, false);
    dropZone.addEventListener('drop', handleDragFileSelect, false);
    let inputFile = $('.inputfile')[0];
    inputFile.addEventListener('change', handleFileSelect, false);
 }); // document.ready

    
    
})();

