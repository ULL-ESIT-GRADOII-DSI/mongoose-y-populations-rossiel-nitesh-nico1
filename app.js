"use strict";

const express = require('express');
const app = express();
const path = require('path');
const expressLayouts = require('express-ejs-layouts');

const calculate = require('./models/calculate.js');
const basedatos = require('./models/schema.js');
const Person = basedatos.personSchema;
const Story = basedatos.storySchema;

app.set('port', (process.env.PORT || 5000));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

app.use(express.static(__dirname + '/public'));


app.get('/', (request, response) => {     

 response.render ('index', {title: 'Ajax' })
});

app.get('/csv', (request, response) => {
 response.send({"rows": calculate(request.query.input)}) 
  
});

//Cuando se introduce un nombre de usuario

app.get('/usuario', (request, response) => {
    /* ... Consultar la base de datos y retornar contenidos de usuario si existe... */
    
    console.log(basedatos.personSchema);
    
      Person.find({name: request.params.usuario},
            function(err,data) {
                if(err)
                {
                    console.error("Se ha producido un error");
                }
                else
                {
                    console.log("Enviando datos a csv.js => Id de usuario:"+data[0]._id);
                    const id = mongoose.Types.ObjectId(data[0]._id);
                    
                    Story.find({_creator: id},
                        function(err,data_tablas) {
                            if(err)
                            {
                                console.error("Se ha producido un error->"+err);
                            }
                            else
                            {
                                console.log("Enviando dattos a csv.js => Tablas asociadas:"+data_tablas);    
                            }
                            response.send({contenido: data_tablas, usuario_propietario: id});
                    });
                }
    });
    
    /* ... si no existe, crear usuario con una colección de imputs vacía... */
});

//Cuando se guarda el nombre

app.get('/mongo/:nombre', function(req, res) {
  /* ... Consultar la base de datos y retornar contenidos de input1 ... */
  basedatos.CsvSchema.find({}, function(err, docs) {
        if (err)
            return err;
        if (docs.length >= 4) {
            basedatos.CsvSchema.remove({ id: docs[3].id }).exec();
        }
  });
        //este let se hace en el schema (no se puede crear una variable nueva así) [mirar como se ha de hacer]
        let c4 = new basedatos.CsvSchema({
        "id": req.params.nombre,
        "data": req.query.dataString
        });
        
        c4.save(function(err) {
        if (err) {
            return err;
        }
        console.log(`Guardado: ${c4}`);
    });
});


app.get('/encuentra', function(req, res) {
    basedatos.csv.find({}, function(err, docs) {
        if (err)
            return err;
        res.send(docs);
    });
});

/*Se devuelve como respuesta la entrada correspondiente al nombre
  especificado en la request*/
app.get('/imput', function(req, res) {
    basedatos.csv.find({
        id: req.query.id
    }, function(err, docs) {
        res.send(docs);
    });
});

app.listen(app.get('port'), () => {
    console.log(`Node app is running at localhost:${app.get('port')}` );
});
