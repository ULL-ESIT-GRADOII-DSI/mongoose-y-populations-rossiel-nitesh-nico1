"use strict";

const mongoose = require('mongoose');
const express = require('express');
const app = express();
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const utils = require("util");

const calculate = require('./models/calculate.js');
const basedatos = require('./models/schema.js');
const Person = basedatos.Person;
const Story = basedatos.Story;
const Owner = basedatos.Owner;
const Csv = basedatos.Csv;

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

/*app.get('/usuario', (request, response) => {
    console.log ("usuario");
    
    
    //console.log(request.query.user);
    //console.log(Person);    

      Person.find({
          name: request.query.user},
            function(err,data) {
                if(err)
                {
                    console.error("Se ha producido un error");
                }
                else
                {
                   // console.log("data   ");  
                    //console.log(data);
                    //console.log("data de 0");  
                    //console.log(data[0]);
                    //console.log("Enviando datos a csv.js => Id de usuario:"+data[0].name);
                    const id = mongoose.Types.ObjectId(data[0]._id);
                    
                    Story.find({_creator: id},{upsert: true},
                        function(err,docs) {
                            if(err)
                            {
                                console.error("Se ha producido un error->"+err);
                            }
                            else
                            {
                                console.log("Enviando datos a csv.js => Tablas asociadas:"+data);    
                            }
                            response.send({contenido: docs, usuario: id});
                    });
                    
                    
                }
    });
    
  
});*/

//Cuando se guarda el nombre

app.get('/mongo/:nombre', function(req, res) {
    
    console.log ("entrando en mongo");
  /* ... Consultar la base de datos y retornar contenidos de input1 ... */
  basedatos.Csv.find({}, function(err, docs) {
        if (err)
            return err;
        if (docs.length >= 4) {
            basedatos.Csv.remove({ id: docs[3].id }).exec();
        }
  });
        //este let se hace en el schema (no se puede crear una variable nueva así) [mirar como se ha de hacer]
        let c4 = new basedatos.Csv({
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
    console.log("tu prima");
    basedatos.Csv.find({}, function(err, docs) {
        if (err)
            return err;
        res.send(docs);
    });
});





app.get('/bonito', function(req, res) {
    console.log ("primero " + req.query.informacion);
    Person.findOneAndUpdate({name: req.query.informacion}, {upsert: true, 'new':true}, function(err, docs) {
        if (err){
            console.log (err);
        } 
        console.log ("docs " + utils.inspect(docs, {depth: null}));
        
        console.log("id aaron " + docs[0]._id);
    basedatos.Owner.find({}, function (err, datos){
        if (err){
            
            console.log (err);
        }
        console.log ("prueba " + datos );
        res.send(datos);
        });
    });
});

/*

app.get('/bonito', function(req, res) {
    console.log ("primero " + req.query.informacion);
    Person.find({name: req.query.informacion},function(err, docs) {
        if (err){
            console.log (err);
        } 
        console.log ("docs " + utils.inspect(docs, {depth: null}));
        
        console.log("id aaron " + docs[0]._id);
        //const id = mongoose.Types.ObjectId(docs._id);
       //console.log("textaco " + id);
    basedatos.Owner.find({}, function (err, datos){
        if (err){
            console.log (err);
        }
        console.log ("prueba " + datos );
        res.send(datos);
        });
    });
});*/


/*Se devuelve como respuesta la entrada correspondiente al nombre
  especificado en la request*/
app.get('/imput', function(req, res) {
    basedatos.Csv.find({
        id: req.query.id
    }, function(err, docs) {
        res.send(docs);
    });
});


app.get('/strong', function(req, res) {
    basedatos.Owner.find({
        id: req.query.id
    }, function(err, docs) {
        res.send(docs);
    });
});


app.listen(app.get('port'), () => {
    console.log(`Node app is running at localhost:${app.get('port')}` );
});
