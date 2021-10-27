var express = require('express');
var Router = express.Router();
var puppeteerController = require('../controllers/puppeteer_controller');

var router = function () {
    
    Router.post('/', puppeteerController.all_images);
    Router.post('/test', puppeteerController.test_puppetter);
    Router.post('/takescreenshots', puppeteerController.takeScreenshots);
    
    return Router;
}

module.exports = router()