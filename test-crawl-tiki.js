const { Builder, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const fs = require("fs");
const { createObjectCsvWriter } = require("csv-writer");

async function crawlProductOnTiki(keyword) {
  let driver = await new Builder().forBrowser("chrome").build();

  try {
    // Truy cập trang Tiki
    await driver.get("https://tiki.vn/");
    // Tìm kiếm sản phẩm
    await driver
      .findElement(By.css('input[type="text"]'))
      .sendKeys(keyword, Key.RETURN);

    await driver.wait(until.elementLocated(By.css(".product-item")), 5000);
    // Tìm tất cả các phần tử chứa thông tin sản phẩm
    const productElements = await driver.findElements(By.css(".product-item"));

    // Tạo một MẢNGGGGG để lưu trữ thông tin
    const products = [];
    //TAO DÙNG CHUỖIIIII
    // let products = '';
    // Lặp qua mỗi phần tử để lấy thông tin của từng sản phẩm
    for (let i = 0; i < productElements.length; i++) {
      const productNameElement = await productElements[i].findElement(
        By.css(".ibOlar")
      );
      const productName = await productNameElement.getText();
      const productPriceElement = await productElements[i].findElement(
        By.css(".price-discount__price")
      );
      const productPrice = await productPriceElement.getText();
      const productImageElement = await productElements[i].findElement(
        By.css(".hbqSye")
      );
      const productImageUrl = await productImageElement.getAttribute("srcset");

      // products += `${productName};${productPrice};${productImageUrl}\n`;
      // // Thêm thông tin của sản phẩm vào MẢNGGGGGGG products
      products.push({
        name: productName,
        price: productPrice,
        imageUrl: productImageUrl,
      });
    }

    console.log("Danh sách các sản phẩm: ", products);

    const csvWriter = createObjectCsvWriter({
      path: "tiki.csv",
      header: [
        { id: "name", title: "Name" },
        { id: "price", title: "Price" },
        { id: "imageUrl", title: "Image URL" },
      ],
      encoding: "utf8",
      bom: true,
    });
    // const csvHeader = "ID@Type@SKU@Name@Published@'Is featured?'@'Visibility in catalog'@'Short description'@Description@'Date sale price starts'@'Date sale price ends'@'Tax status'@'Tax class'@'In stock?'@Stock@'Low stock amount'@'Backorders allowed?'@'Sold individually?'@'Weight(kg)'@'Length(cm)'@'Width(cm)'@'Height(cm)'@'Allow customer reviews?'@'Purchase note'@'Sale price'@'Regular price'@Categories@Tags@'Shipping class'@Images@'Download limit'@'Download expiry days'@Parent@'Grouped products'@Upsells@Cross-sells@'External URL'@'Button text'@Position@'Attribute 1 name'@'Attribute 1 value(s)'@'Attribute 1 visible'@'Attribute 1 global'@'Attribute 1 default'@'Attribute 2 name'@'Attribute 2 value(s)'@'Attribute 2 visible'@'Attribute 2 global'@'Attribute 2 default'@'Attribute 3 name'@'Attribute 3 value(s)'@'Attribute 3 visible'@'Attribute 3 global'@'Attribute 3 default'@'Attribute 4 name'@'Attribute 4 value(s)'@'Attribute 4 visible'@'Attribute 4 global'@'Attribute 4 default'@'Attribute 5 name'@'Attribute 5 value(s)'@'Attribute 5 visible'@'Attribute 5 global'@'Attribute 5 default'@'Attribute 6 name'@'Attribute 6 value(s)'@'Attribute 6 visible'@'Attribute 6 global'@'Attribute 6 default'@'Attribute 7 name'@'Attribute 7 value(s)'@'Attribute 7 visible'@'Attribute 7 global'@'Attribute 7 default'@'Attribute 8 name'@'Attribute 8 value(s)'@'Attribute 8 visible'@'Attribute 8 global'@'Attribute 8 default'@'Attribute 9 name'@'Attribute 9 value(s)'@'Attribute 9 visible'@'Attribute 9 global'@'Attribute 9 default'\n";
    // const newDataRow = `@simple@""@"${productNameText}"@1@"0"@"visible"@""@"Mô tả nè"@""@""@"taxable"@""@"1"@@""@"0"@"0"
    // @""@""@""@""@"1"@""@""@"${priceText}"@""@@""@"https:urlimage"@""@""@@""@@@""@""@0@""@""@"0"@"1"@""@""@""@"0"@"1"
    // @""@""@""@"0"@"1"@""@""@""@"0"@"1"@""@""@""@"0"@"1"@""@""@""@"0"@"1"@""@""@""@"0"@"1"@""@""@""@"0"@"1"@""@""@""@"0"@"1"@""`;  
    // Ghi dữ liệu vào file CSV
    csvWriter
      .writeRecords(products)
      .then(() => console.log("Dữ liệu đã được ghi vào file CSV"))
      .catch((error) =>
        console.error("Lỗi khi ghi dữ liệu vào file CSV:", error)
      );

  } finally {
    await driver.quit();
  }
}

const keyword = "áo khoác nam";
crawlProductOnTiki(keyword);
