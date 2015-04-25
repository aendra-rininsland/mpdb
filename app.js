var restify = require('restify');
var mongojs = require('mongojs');

var db;

if (process.env.NODE_ENV === 'prod') {
  db = mongojs(process.env.mongourl, ['members']);
} else {
  db = mongojs('mps', ['members']);
}

 
// Server
var server = restify.createServer();
 
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.CORS());
 
server.listen(process.env.PORT || 3000, function () {
    console.log('Server started @ ' + process.env.PORT || 3000);
});

// Get party profile
server.get('/api/v1/mps', function (req, res, next) {
  var params = req.query;
  var query = params.filters ? params.filters : {};
  
  db.members.find(query, function(err, data){
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8'
    });
    res.end(JSON.stringify(data));
  });
  
  return next();
});
 
// Get MP by ID
server.get('/api/v1/mps/id/:id', function (req, res, next) {
  var id = req.params.id;
  
  db.members.find({
    '_id': id
  }, function(err, data){
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8'
    });
    res.end(JSON.stringify(data));
  });
  
  return next();
});

// Search MP by name
server.get('/api/v1/mps/name/:name', function (req, res, next) {
  var name = req.params.name;
  var nameRegexp = new RegExp(name, 'gi');
  db.members.find({
    'name': nameRegexp,
  }, function(err, data){
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8'
    });
    res.end(JSON.stringify(data));
  });
  
  return next();
});