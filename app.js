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
        let c4 = new basedatos.Csv({
        "id": req.params.nombre,
        "data": req.query.dataString
        });
        
        c4.save(function(err) {
        if (err) {
            return err;
        }
        console.log(`Guardado mongo/nombre: ${c4}`);
        
        });
});



app.get('/botonusuario/:nombre', function(req, res) {

  /* ... Consultar la base de datos y retornar contenidos de input1 ... */
        let numero_creador;
        console.log ("quinto " + req.query.informacion);
        Person.find({name: req.query.informacion}, function(err, docu){
            if (err) return err;
            
            console.log("docu " + docu);

            numero_creador = docu[0]._id;
           
            Owner.find({"_creator": docu._id}, function (err, datos){
                if (err) console.log (err);
                console.log("length" + datos.length);
                if(datos.length >=4){
                    Owner.remove({ id: datos[3].id }).exec();
                }

            
            
            let c4 = new basedatos.Owner({
                    "id": req.params.nombre,
                    "data": req.query.dataString,
                    "_creator": numero_creador
                });

           
                c4.save(function(err) {
                    if (err) return err;
                    console.log(`Guardado: ${c4}`);
                });
                
                
               // console.log("Botones que se han guardando" + docu); 
                
            });
                
        });    

});



app.get('/encuentra', function(req, res) {
    basedatos.Csv.find({}, function(err, docs) {
        if (err)
            return err;
        res.send(docs);
    });
});





app.get('/bonito', function(req, res) {
        var update = {name: req.query.informacion, csv: []}
    Person.findOneAndUpdate({name: req.query.informacion}, update, {upsert: true, 'new':true}, function(err, docs) {
        if (err)  console.log (err);
        
        
       // console.log ("Bonito docs " + utils.inspect(docs, {depth: null}));
        
        
    basedatos.Owner.find({"_creator": docs._id}, function (err, datos){
        if (err) console.log (err);
        //console.log("Owners" + datos);
        res.send(datos);
        }); // owner.find
    }); //person.find
}); // call bonito



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
    //    console.log("Rellena textarea" + docs);
        res.send(docs);
    });
});


app.listen(app.get('port'), () => {
    console.log(`Node app is running at localhost:${app.get('port')}` );
});
