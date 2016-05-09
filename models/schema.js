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
  
 const personSchema = Schema({
    name    : String,
    stories : [{ type: Schema.Types.ObjectId, ref: 'Story' }]
  });

  const storySchema = Schema({
    _creator : { type: Schema.Types.ObjectId, ref: 'Person' },
    title    : String
  });
 
  
  const Csv = mongoose.model("Csv", CsvSchema);

  Csv.remove({}).exec();
  let c1 = new Csv({'id':'input1', 'data':'"producto","precio" "camisa","4,3" "libro de O\'Reilly", "7,2"'});
  let c2 = new Csv({'id':'input2', 'data':"'producto','precio' 'fecha' 'camisa','4,3','14/01' 'libro de O\"Reilly', '7,2' '13/02'"});
  let c3 = new Csv({'id':'input3', 'data':"'edad', 'sueldo','peso','6000€', '90Kg' 47, '3000€', '100Kg'"});


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
    console.log(util.inspect(value, {depth: null}));  
  //  mongoose.connection.close(); No cerrar nunca la conección, produce errores de sincronización
  });
  
  
  const Story  = mongoose.model('Story', storySchema);
  const Person = mongoose.model('Person', personSchema);

  Person.remove({}).then(()=>{
    Story.remove({}).then( () => {
      let aaron = new Person({ name: 'Aaron' });

      aaron.save(function (err) {
        if (err) return console.log(err);
      
        let story1 = new Story({
          title: "Once upon a timex.",
          _creator: aaron._id    // assign the _id from the person
        });
      
        story1.save(function (err) {
          if (err) return console.log(err);
          // thats it!
        }).then(()=>{

          Story
          .findOne({ title: 'Once upon a timex.' })
          .populate('_creator')
          .exec(function (err, story) {
            if (err) return console.log(err);
            console.log('The creator is %s', story._creator.name);
            // prints "The creator is Aaron"
          }).then( () => {
           // mongoose.connection.close(); 
          });

        });
      });
    });
  });
  
  
  
  module.exports.personSchema = personSchema;
  module.exports.storySchema = storySchema;
  module.exports.csv = Csv;
})();