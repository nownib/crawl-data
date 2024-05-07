const { Builder, By, Key, until } = require('selenium-webdriver');
const edge = require('selenium-webdriver/edge');

async function createImageWithKeyword(keyword) {
    let driver = await new Builder()
        .forBrowser('MicrosoftEdge')
        .build();

    try {
 
        await driver.get('https://www.bing.com/images/create');
        await driver.wait(until.elementLocated(By.id('sb_form_q')), 3000);
        await driver.findElement(By.id('sb_form_q')).sendKeys(keyword, Key.RETURN);
        await driver.wait(until.elementLocated(By.css('.dgControl dtl')), 60000);
        const imageUrl = await driver.findElement(By.css('.mimg')).getAttribute('src');
        console.log('Image URL:', imageUrl);

    } finally {
        await driver.quit();
    }
}

const keyword = 'dog love cat';
createImageWithKeyword(keyword);
