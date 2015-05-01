var mongojs = require('mongojs');
var db = mongojs('mps', ['members', 'newmembers']);


db.members.aggregate([
  {
    $group: {
      _id: '$name', 
      name: {$first: '$name'}, 
      party: {$first: '$party'}, 
      terms: {$first: '$terms'}, 
      homepage: {$first: '$homepage'}, 
      resource: {$first: '$resource'}, 
      description: {$first: '$description'}, 
      image: {$first: '$image'}, 
      thumbnail: {$first: '$thumbnail'}
    } 
  }
],
function(err, data){
  data.forEach(function(mp, i){
    delete mp._id;
    db.newmembers.insert(mp);
  });
});

// Ensure with "lastname, firstname" format.

// db.members.find({name: /^[^,]+$/g}).toArray(function(err, data){ // Get list of comma-less names
//   data.forEach(function(mp, i){
//     mp.name = mp.name.replace(' MP', ''); // Remove the "MP" part from anyone with that in their name.
//     var pos = mp.name.lastIndexOf(' ');
//     var lastname = mp.name.substring(pos + 1);
//     var firstname = mp.name.substring(0, pos);
//     var corrected = lastname + ', ' + firstname;
//     
//     db.members.update({_id: mp._id}, {$set: {name: corrected}});
//   });
// });