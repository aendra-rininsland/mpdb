var fs = require('fs');

var sparql = require('./sparqlOutput.json');

var items = [];

sparql.results.bindings.forEach(function(v, i){
  var row = {};
  row.name = typeof(v.mpName) !== 'undefined' ? v.mpName.value : '';
  row.party = typeof(v.mpPartyLabel) !== 'undefined' ? v.mpPartyLabel.value : '';
  row.terms = typeof(v.categories) !== 'undefined' ? v.categories.value.replace(/UK MPs /g, '').split(', ') : '';
  row.homepage = typeof(v.homepage) !== 'undefined' ? v.homepage.value : '';
  row.resource = typeof(v.member) !== 'undefined' ? v.member.value : '';
  row.description = typeof(v.mpComment) !== 'undefined' ? v.mpComment.value : '';
  row.image = typeof(v.foafDepiction) !== 'undefined' ? v.foafDepiction.value : '';
  row.thumbnail = typeof(v.thumb) !== 'undefined' ? v.thumb.value : '';
  items.push(row);
});

fs.writeFileSync('converted.json', JSON.stringify(items), {encoding: 'UTF-8'});