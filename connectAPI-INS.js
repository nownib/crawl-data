const { Builder, By, Key, until } = require("selenium-webdriver");
const edge = require("selenium-webdriver/edge");
const { IgApiClient } = require("instagram-private-api");
const axios = require("axios");

async function createImageWithKeywordAndPostOnIg(keyword) {
  let driver = await new Builder().forBrowser("MicrosoftEdge").build();

  try {
    // Connect bing image creator and create image
    await driver.get("https://www.bing.com/images/create");
    await driver.wait(until.elementLocated(By.id("sb_form_q")), 5000);
    await driver.findElement(By.id("sb_form_q")).sendKeys(keyword, Key.RETURN);
    await driver.wait(until.elementLocated(By.css(".dgControl_list ")), 30000);
    const imageUrl = await driver
      .findElement(By.css(".mimg"))
      .getAttribute("src");
    console.log("Image URL:", imageUrl);
    // Lấy dữ liệu ảnh từ URL
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    // Chuyển dữ liệu binary thành Buffer
    const imageBuffer = Buffer.from(response.data, "binary");

    //click Create
    // await driver.wait(
    //   until.elementLocated(By.css(".x1lliihq.x1n2onr6.x5n08af")),
    //   10000
    // );
    // const createPost = await driver.findElement(
    //   By.css(".x1lliihq.x1n2onr6.x5n08af")
    // );
    // await createPost.click();

    const ig = new IgApiClient();
    ig.state.generateDevice("0387779614"); //
    await ig.simulate.preLoginFlow();
    await ig.account.login("0387779614", "ins@wonbin10");

    // Tìm và click vào nút "Select from computer"
    // await driver.wait(
    //   until.elementLocated(By.xpath('//button[text()="Select from computer"]')),
    //   10000
    // );
    // const selectImage = await driver.findElement(
    //   By.xpath('//button[text()="Select from computer"]')
    // );
    // await selectImage.click();

    // Đợi input upload xuất hiện
    // await driver.wait(
    //   until.elementLocated(By.css('input[type="file"]')),
    //   10000
    // );
    // await driver.findElement(By.xpath('//button[text()="Next"]')).click();
    // await driver.findElement(By.xpath('//button[text()="Next"]')).click();
    // // Add caption and share
    // await driver
    //   .findElement(By.css('textarea[aria-label="Write a caption…"]'))
    //   .sendKeys("I'm trying a few things. Sorry if I'm bothering you.");
    // await driver.findElement(By.xpath('//button[text()="Share"]')).click();
    // console.log("Image uploaded successfully.");

    //Post image
    const publishResult = await ig.publish.photo({
      file: imageBuffer,
      caption: "I'm trying a few things. Sorry if I'm bothering you.",
    });
    console.log("Published:", publishResult);

    // Lấy thông tin về bài đăng
    const mediaInfo = await ig.media.info(publishResult.media.id);
    console.log("Media info:", mediaInfo);
    const mediaCode = mediaInfo.items[0].code;

    //Connect to Ins
    const postUrl = `https://www.instagram.com/p/${mediaCode}`;
    await driver.get(postUrl);
    await driver.sleep(3000);
    // await driver.wait(until.elementLocated(By.name("username")), 10000);
    // await driver.findElement(By.name("username")).sendKeys("0387779614");
    // await driver.findElement(By.name("password")).sendKeys("ins@wonbin10");
    // await driver.findElement(By.css('button[type="submit"]')).click();
    // await driver.wait(until.urlContains("instagram.com"), 10000);
    // Connect to Instagram by url
    

    await driver.sleep(20000);

  } finally {
    await driver.quit();
  }
}

const keyword = "chihuahua";
createImageWithKeywordAndPostOnIg(keyword);
// bị lỗi chỗ chọn ảnh, giờ bing image creator nó méo lên. NGỦ
