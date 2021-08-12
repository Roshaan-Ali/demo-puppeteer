'use strict';
const puppeteer = require('puppeteer');
const path = require('path');
const api = require('./../../config.json');
const fs = require('fs');

exports.test_puppetter = async (req, res) => {
    let urlsArray = req.body;
    let numOfiles;
    fs.readdir('./screenshots', (err, files) => {
        console.log({ number: files.length });
        numOfiles = files.length;
        const unlinkPromises = files.map(filename => fs.unlinkSync(path.resolve() + `/screenshots/${filename}`));
    });
    console.log("=-==",numOfiles)
    try {
        try {
            // launch a new headless browser
            const browser = await puppeteer.launch();
            // loop over the urls
            for (let i = 0; i < urlsArray.length; i++) {
                // check for https for safety!
                if (urlsArray[i].includes("https://")) {
                    const page = await browser.newPage();

                    // set the viewport size
                    await page.setViewport({
                        width: 1920,
                        height: 1080,
                        // defaultViewport: '1920x1080',
                        deviceScaleFactor: 1,
                    });

                    // tell the page to visit the url
                    await page.goto(urlsArray[i], {"waitUntil" : "networkidle0"});
                    // await page.goto('https://www.digg.com/', {"waitUntil" : "networkidle0"});
                    // take a screenshot and save it in the screenshots directory

                    await page.screenshot({ path: `./screenshots/image${i}.png` });

                    // done!
                    console.log(`✅ Screenshot of ${urlsArray[i]} saved!`);
                } else {
                    throw new Error(`❌ Could not save screenshot of ${urlsArray[i]}!`);
                }
            }

            // close the browser
            await browser.close();
            res.status(200).send({
                message: "Got Screenshots!!",
            })
        } catch (error) {
            res.status(400).send({
                message: "Provide Proper Links!!",
            })
        }
    } catch (error) {
        res.status(400).send({
            message: "SOmething went wrong",
        })
    }
};

exports.all_images = async (req, res) => {
    console.log("calling", req.body)
    var numfiles;
    
    // try {
    //      fs.readdirSync('./screenshots', (err, files) => {
    //         console.log({ numfiles: files.length }, files)
    //         numfiles = files.length;
    //     });
    // } catch (error) {
    //     res.status(400).send({
    //         message: "SOmething went wrong",
    //     })
    // }
    let urlsData = [];
    fs.readdir('./screenshots', (err, files) => {
        // console.log({ numfiles: files.length }, files)
          numfiles = files.length;
          console.log({ nummmmmmmmmmmmmm: numfiles }, 0 < numfiles)
            
            for (let index = 0; index < numfiles; index++) {
                urlsData.push({ id: index, img: `${api.api}/screenshots/image${index}.png` })
            }
            res.json({ data: urlsData });
    })
    
};