const { url } = require("inspector");
const fs = require('fs');
const path = require('path');
const puppeteer = require("puppeteer-extra");
const stealthPlugin = require("puppeteer-extra-plugin-stealth")();
const adblockerPlugin = require('puppeteer-extra-plugin-adblocker');
require('dotenv').config();

["chrome.runtime", "navigator.languages"].forEach(a =>
  stealthPlugin.enabledEvasions.delete(a)
);
puppeteer.use(stealthPlugin);
// puppeteer.use(adblockerPlugin);

main();
async function main() {
  //////////////// DEFAULT ////////////////////////////////////
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.evaluateOnNewDocument(() => {
    delete navigator.__proto__.webdriver;
  });

  //We stop images and stylesheet to save data
  await page.setRequestInterception(true);

  page.on('request', (request) => {
    if (['image', 'stylesheet', 'font'].includes(request.resourceType())) {
      request.abort();
    } else {
      request.continue();
    }
  })
  ////////////////////////////////////////////////////////////
  // page.on('request', (request) => {
  //     if (['image', 'stylesheet', 'font'].includes(request.resourceType())) {
  //         request.abort();
  //     } else {
  //         request.continue();
  //     }
  // })

  // =======================> file <=======================
  const currentDate = new Date();
  const hours = currentDate.getHours().toString().padStart(2, '0');
  const minutes = currentDate.getMinutes().toString().padStart(2, '0');
  const seconds = currentDate.getSeconds().toString().padStart(2, '0');
  const filePath = `./data-language/${hours}-${minutes}-${seconds}_lang-${process.env.language}.txt`;
  fs.writeFileSync(filePath, '')
  console.log(`=======> create file ${filePath} success <=======`);

  // =======================> read path in file <=======================
  const directoryPath = './photo-storage';
  const pathImageArr = [];

  fs.readdirSync(directoryPath).forEach((file) => {
    const filePath = path.join(directoryPath, file);
    const fileStat = fs.statSync(filePath);

    if (fileStat.isFile()) {
      const absolutePath = path.resolve(filePath);
      pathImageArr.push(absolutePath);
    }
  });
  console.log(`=======> there are ${pathImageArr.length} files in total <=======`);
  // console.log(pathImageArr)
  // return
  console.log('=======> Switch Language <=======')
  // =======================> handle convert in web <=======================
  for (let i = 1; i < pathImageArr.length + 1; i++) {
    console.log(`=======> start convert image ${i} <=======`)
    function getRandomNumber() {
      var random = Math.floor(Math.random() * (500 - 300 + 1)) + 300;
      return random;
    };
    function getHighNumber() {
      var random = Math.floor(Math.random() * (500 - 300 + 1)) + 1150;
      return random;
    };

    try {
      await page.waitForTimeout(getRandomNumber());
      await page.goto('https://www.onlineocr.net/');
      await page.waitForTimeout(getHighNumber());

      const fileInput = await page.$('input#fileupload');
      if (fileInput) {
        await fileInput.uploadFile(pathImageArr[i - 1]);
        await page.select('#MainContent_comboLanguages', process.env.language);
        await page.select('#MainContent_comboOutput', process.env.output);
        await page.waitForTimeout(getRandomNumber());
        await page.click('#MainContent_btnOCRConvert');
        await page.waitForTimeout(getHighNumber());

        await page.waitForXPath('[@id="MainContent_lnkBtnDownloadOutput"]', { timeout: process.env.timeout });
        // await page.waitForXPath('//*[@id="MainContent_lnkBtnDownloadOutput"]', { timeout: process.env.timeout });
        // await page.click('#MainContent_lnkBtnDownloadOutput') not download file

        let text = await page.$eval('#MainContent_txtOCRResultText', (textarea) => {
          return textarea.value;
        });
        console.log('image : ' + pathImageArr[i - 1])
        console.log('text : ' + text)
        text = text + "______________________________________________________\n"
        fs.appendFile(filePath, text + '', function (err) {
          if (err) throw err;
          console.log(`=======> Done image ${i} <=======`)
        });
      } else {
        console.log(`=======> ERROR image ${i} <=======`)
      }
    } catch (error) {
      console.error(error.messager);
      continue
    }
    await page.waitForTimeout(getRandomNumber());
  }
  console.log(`=======> Download Success <=======`)
  browser.close();
}