const express = require('express')
const {Builder, By, Key, until} = require('selenium-webdriver');
const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');
const { response } = require('express');

chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());
const app = express()
const screen = {
    width: 1920,
    height: 1080
  };
 

app.get('/translate',async (req,res,next) => {

    // **********************************   add or remove languages here  **************************************** //
    let languages = ['tamil','Gujarati','BENGALI','hindi','Kannada','Arabic','Malayalam','Marathi','Telugu','Odia']

    // ***********************************  add [label,text] pairs on ths input list to be translated ****************** //

    const input =[['salesIqFailMessage','Problem in reaching Support. Please contact shop owner!']]

    ////////////////////////////////////////////////////////////// selenium js ////////////////////////////////////////////////////////////////
    const output =  []
    input.map((el) => output.push([el[0],'']))
    let finalOutput = []
    let i = 0 // languages
    let j = 0 // labels
    let currentLanguage
    var finalstr = ''
    let driver = await new Builder()
    .forBrowser('chrome')
//    .setChromeOptions(new chrome.Options().headless().windowSize(screen)).withCapabilities(webdriver.Capabilities.chrome()).build()
      .setChromeOptions(new chrome.Options().windowSize(screen)).withCapabilities(webdriver.Capabilities.chrome()).build()
    try {
        // translate one label at a time 
        const translateLabel = async (language) => {
            try {
                    (i < 1 && j < 1 )? null : await driver.findElement(By.className('er8xn')).clear()
                    await driver.findElement(By.className('er8xn')).sendKeys(input[j][1], Key.RETURN)
                    await driver.findElement(By.xpath("/html/body/c-wiz/div/div[2]/c-wiz/div[2]/c-wiz/div[1]/div[1]/c-wiz/div[5]/button/span")).click()
                    await driver.findElement(By.xpath("/html/body/c-wiz/div/div[2]/c-wiz/div[2]/c-wiz/div[3]/c-wiz/div[2]/div/div[2]/input")).sendKeys(language, Key.RETURN)
                    await driver.sleep(1000)
                    const whatElement = driver.findElement(el);
                    await whatElement.click()
                    await driver.sleep(1000)
                var translatedText = await driver.findElement(tr).getText()
                console.log(translatedText);
                finalOutput.push(`${input[j][0]}:'${translatedText}'`)
                if(j >= input.length-1){
                    console.log('completed languages',languages[i]);
                    j = 0
                    i++
                    getlanguages(res)
                }else{
                    j++
                    translateLabel(languages[i])
                }
            } catch (error) {
                console.log(error);
            }
         }

        // handle language one by one 
        const getlanguages = async (response) => {
            if(i > languages.length-1) {
               let res = []
                finalstr = ''
               finalOutput.map((el) => finalstr = finalstr +'<div>'+ el+','+'</div>'  )
               console.log(finalstr);
               response.send(finalstr)
               await driver.quit();
               return next()
            }
            currentLanguage = languages[i]
            translateLabel(languages[i])
        }

        // init
            var el = By.xpath("/html/body/c-wiz/div/div[2]/c-wiz/div[2]/c-wiz/div[3]/c-wiz/div[2]/div/div[4]/div/div[1]/div[2]/span")
            var tr = By.xpath("/html/body/c-wiz/div/div[2]/c-wiz/div[2]/c-wiz/div[1]/div[2]/div[2]/c-wiz[2]/div[5]/div/div[1]/span[1]")
            await driver.get('https://translate.google.co.in/');
            await driver.manage().window().maximize().then(() => {
                getlanguages()
            })
            return finalstr
        
    }catch(e){
        console.log(e);
    }
     finally {
    }
})

app.listen(3000,() => {
    console.log('server started');
})