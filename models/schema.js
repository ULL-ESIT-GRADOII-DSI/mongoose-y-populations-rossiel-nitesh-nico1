(function(exports)
{
  "use strict";
  const util = require('util');
  const mongoose = require('mongoose');

  mongoose.connect('mongodb://localhost/schema');
  
   const Schema = mongoose.Schema;
  
  const CsvSchema = Schema({ 
    id : String,
    data : String
  });
  
    const CsvUser = Schema({ 
    id : String,
    data : String,
    _creator : { type: Schema.Types.ObjectId, ref: 'Person' }
  });
  
 const personSchema = Schema({
    name: String,
    csv : [{ type: Schema.Types.ObjectId, ref: 'Owner' }]
  });
 
  
  const Csv = mongoose.model("Csv", CsvSchema);

  Csv.remove({}).then(() =>{
  let c1 = new Csv({'id':'Ejemplo1', 'data':'"producto","precio" "camisa","4,3" "libro de O\'Reilly", "7,2"'});
  let c2 = new Csv({'id':'Ejemplo2', 'data':"'producto','precio' 'fecha' 'camisa','4,3','14/01' 'libro de O\"Reilly', '7,2' '13/02'"});
  let c3 = new Csv({'id':'Ejemplo3', 'data':"'edad', 'sueldo','peso','6000€', '90Kg' 47, '3000€', '100Kg'"});


  let p1 = c1.save(function (err) {
    if (err) { console.log(`Hubieron errores:\n${err}`); return err; }
    console.log(`Saved: ${c1}`);
  });
  
    let p2 = c2.save(function (err) {
    if (err) { console.log(`Hubieron errores:\n${err}`); return err; }
    console.log(`Saved: ${c2}`);
  });

  let p3 = c3.save(function (err) {
    if (err) { console.log(`Hubieron errores:\n${err}`); return err; }
    console.log(`Saved: ${c3}`);
  });


Promise.all([p1,p2,p3]).then( (value) => { 
    //console.log(util.inspect(value, {depth: null}));  
  //  mongoose.connection.close(); No cerrar nunca la conección, produce errores de sincronización
  });
});
  
  
  const Person = mongoose.model('Person', personSchema);
  const Owner = mongoose.model('Owner', CsvUser);

  Person.remove({}).then(()=>{
      let aaron = new Person({ name: 'Aaron' });

      aaron.save(function (err) {
        if (err) 
          return console.log(err);
        Owner.remove({}).then(() =>{
             let c1 = new Owner({
                'id':'prueba1',
                'data':'probando',
                _creator: aaron._id
              });
             let c2 = new Owner({
                'id':'prueba2',
                'data':'tuprima',
                _creator: aaron._id
              });
             let c3 = new Owner({
                'id':'prueba3',
                'data':'tuabuela',
                _creator: aaron._id
              });

             c1.save(function (err) {
                if (err) return console.log(err);
              });
             c2.save(function (err) {
                if (err) return console.log(err);
              }); 
              c3.save(function (err) {
                if (err) return console.log(err);
               });
         }); // owner remove
        }); // aaron save
    }); //person remove
  
  module.exports.Person = Person;
  module.exports.Csv = Csv;
  module.exports.Owner = Owner;
})();