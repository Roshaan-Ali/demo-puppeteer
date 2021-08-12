'use strict';

module.exports = function (app) {
    var demo_puppeteer = require('../controllers/demo-puppeteer-controller');

//     // Routes
    app.route('/')
        .get(demo_puppeteer.all_images);

    app.route('/test')
        .post(demo_puppeteer.test_puppetter);
};