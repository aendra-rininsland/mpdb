var restify = require('restify');
var mongojs = require('mongojs');

var db;

if (process.env.NODE_ENV === 'prod') {
  db = mongojs(process.env.mongourl, ['members']);
} else {
  db = mongojs('mps', ['members']);
}

 
// Server
var server = restify.createServer({
  formatters: {
    'application/json': function customizedFormatJSON( req, res, body ) {
        // Copied from restify/lib/formatters/json.js

        if ( body instanceof Error ) {
            // snoop for RestError or HttpError, but don't rely on
            // instanceof
            res.statusCode = body.statusCode || 500;

            if ( body.body ) {
                body = {
                    code: 10001,
                    scode: body.body.code,
                    msg: body.body.message
                };
            } else {
                body = {
                    code: 10001,
                    msg: body.message
                };
            }
        } else if ( Buffer.isBuffer( body ) ) {
            body = body.toString( 'base64' );
        }

        var data = JSON.stringify( body );
        res.setHeader( 'Content-Length', Buffer.byteLength( data ) );

        return data;
    }
  }
});
 
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.CORS());
 
server.listen(process.env.PORT || 3000, function () {
    console.log('Server started @ ' + process.env.PORT || 3000);
});

// Get party profile
server.get('/api/v1/mps/:name', function (req, res, next) {
  var name = req.params.name;
  var params = req.query;
  var query = params.filters ? params.filters : {};
  
  if (name) {
    query.name = new RegExp(name, 'gi');
  }
  
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
    '_id': mongojs.ObjectId(id)
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