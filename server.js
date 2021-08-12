// imported lib
var express = require('express'),
    app = express(),
    port = process.env.PORT || 5000;

var bodyParser = require('body-parser');
var cors = require('cors')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/screenshots', express.static('screenshots'));
app.use(cors())


var routes = require('./api/routes/demo-puppeteer-routes'); //importing route
routes(app); //register the route

app.listen(port);

console.log('todo list RESTful API server started on: ' + port);