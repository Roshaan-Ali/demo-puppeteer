var express = require('express'),
app = express(),
port = process.env.PORT || 5000;
var routes = require('./routes/puppeteer'); //importing route

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended:true}));
app.use('/uploads', express.static('uploads'));

app.use('/', routes)

app.listen(port);

console.log('server started on: ' + port);