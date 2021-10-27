'use strict';
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const api = require('./../config.json');

exports.test_puppetter = async (req, res) => {
    let urlsArray = req.body;
    fs.readdir('./screenshots', (err, files) => {
        const unlinkPromises = files.map(filename => fs.unlinkSync(path.resolve() + `/screenshots/${filename}`));
    });
    try {
        try {
            // launch a new headless browser
            const browser = await puppeteer.launch({
                args: [
                  '--no-sandbox',
                  '--disable-setuid-sandbox',
                ],
              });
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

exports.takeScreenshots = async (req, res) => {
    
    try {

        console.log('Api call started')

        const {urls} = req.body;



        let imageNames = [];

        const browser = await puppeteer.launch({
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
          });
    
          const page = await browser.newPage();
    
          page.setDefaultNavigationTimeout(0); 
          await page.setViewport({
            width: 1920,
            height: 1080,
            deviceScaleFactor: 1,
          });
    
          for (let i = 0; i < urls.length; i++) {
            if (urls[i].includes("https://")) {
              
              await page.goto(urls[i], { waitUntil: "networkidle0" });
    
              imageNames.push(`/uploads/image-${Date.now()}.jpeg`);
              await page.screenshot({
                quality: 50,
                path: `./uploads/image-${Date.now()}.jpeg`,
                fullPage: true,
              });
    
              console.log(`✅ Screenshot of ${urls[i]} saved!`);
            } else {
              console.log('ss not saved');
              throw new Error(`❌ Could not save screenshot of ${urls[i]}!`);
            }
          }
    
          await browser.close();

          return req.json({
              status:true,
              msg: 'Screenshot generated successfully',
              data : {
                  imageNames
              }
          })

    } catch (error) {
        console.log(error);
        return req.json({
            status:false,
            msg: 'Something went wrong',
            data: error
        })
    }
    
};