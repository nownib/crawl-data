const { Builder, By, Key, until } = require("selenium-webdriver");
const fs = require("fs");
//LẶP QUA CÁC PAGE ĐỂ LẤY THÔNG TIN NHƯNG CHƯA ĐẦY ĐỦ, CẦN PHẢI CLICK VÀO SẢN PHẨM
async function searchAndDownloadImages(keyword) {
    // Initialize the Edge driver
    const driver = await new Builder().forBrowser("MicrosoftEdge").build();

    try {
        // Navigate to Tiki website
        await driver.get("https://tiki.vn/");
        //Tạo for lấy all thẻ a
        // Wait for the search bar input to be present
        const searchBox = await driver.wait(until.elementLocated(By.css('input')), 10000);
        await searchBox.sendKeys(keyword, Key.RETURN);

        const csvHeader = "ID@Type@SKU@Name@Published@'Is featured?'@'Visibility in catalog'@'Short description'@Description@'Date sale price starts'@'Date sale price ends'@'Tax status'@'Tax class'@'In stock?'@Stock@'Low stock amount'@'Backorders allowed?'@'Sold individually?'@'Weight(kg)'@'Length(cm)'@'Width(cm)'@'Height(cm)'@'Allow customer reviews?'@'Purchase note'@'Sale price'@'Regular price'@Categories@Tags@'Shipping class'@Images@'Download limit'@'Download expiry days'@Parent@'Grouped products'@Upsells@Cross-sells@'External URL'@'Button text'@Position@'Attribute 1 name'@'Attribute 1 value(s)'@'Attribute 1 visible'@'Attribute 1 global'@'Attribute 1 default'@'Attribute 2 name'@'Attribute 2 value(s)'@'Attribute 2 visible'@'Attribute 2 global'@'Attribute 2 default'@'Attribute 3 name'@'Attribute 3 value(s)'@'Attribute 3 visible'@'Attribute 3 global'@'Attribute 3 default'@'Attribute 4 name'@'Attribute 4 value(s)'@'Attribute 4 visible'@'Attribute 4 global'@'Attribute 4 default'@'Attribute 5 name'@'Attribute 5 value(s)'@'Attribute 5 visible'@'Attribute 5 global'@'Attribute 5 default'@'Attribute 6 name'@'Attribute 6 value(s)'@'Attribute 6 visible'@'Attribute 6 global'@'Attribute 6 default'@'Attribute 7 name'@'Attribute 7 value(s)'@'Attribute 7 visible'@'Attribute 7 global'@'Attribute 7 default'@'Attribute 8 name'@'Attribute 8 value(s)'@'Attribute 8 visible'@'Attribute 8 global'@'Attribute 8 default'@'Attribute 9 name'@'Attribute 9 value(s)'@'Attribute 9 visible'@'Attribute 9 global'@'Attribute 9 default'\n";
        fs.writeFileSync("tiki.csv", csvHeader);

        for (let pageNum = 0; pageNum < 3; pageNum++) {
            // Wait for search results to load
            await driver.sleep(5000);

            // Wait for the specific element you're interested in
            // const container = await driver.wait(until.elementLocated(By.css('#__next > div:nth-child(1) > main > div > div.styles__FlexContainer-sc-mp632j-1.czHakJ > div.styles__MainContainer-sc-mp632j-2.ddTQeK > div:nth-child(2) > div.CatalogProducts__Wrapper-sc-1r8ct7c-0.jOZPiC')), 10000);

            // Find all elements with class 'info' within the container
            const infos = await driver.findElements(By.className('info'));

            // Initialize an array to store product data
            // const productsData = [];

            // Iterate over each info element
            for (let info of infos) {
                // Find the price element within the info element
                const price = await info.findElement(By.className('price-discount__price'));
                const productName = await info.findElement(By.css('h3'));

                // Get text of the price element
                const priceText = await price.getText();
                const productNameText = await productName.getText();

                // Add product data to array
                // productsData.push([productNameText,priceText])
                const newDataRow = `@simple@""@"${productNameText}"@1@"0"@"visible"@""@"Mô tả nè"@""@""@"taxable"@""@"1"@@""@"0"@"0"@""@""@""@""@"1"@""@""@"${priceText}"@""@@""@""@""@""@@""@@@""@""@0@""@""@"0"@"1"@""@""@""@"0"@"1"@""@""@""@"0"@"1"@""@""@""@"0"@"1"@""@""@""@"0"@"1"@""@""@""@"0"@"1"@""@""@""@"0"@"1"@""@""@""@"0"@"1"@""@""@""@"0"@"1"@""`;                // Thêm dòng mới vào nội dung CSV
                let csvData = "";
                csvData += newDataRow + "\n";

                // Ghi nội dung CSV mới vào file
                fs.appendFileSync("tiki.csv", csvData);
            }

            // Write product data to CSV file
            // const csvData = productsData.map(row => row.join(",")).join("\n");
            // fs.appendFileSync("tiki.csv", csvData + "\n");

            // Click on the next page button if it's not the last page
            if (pageNum < 2) {
                const nextPageButton = await driver.findElement(By.css(`#__next > div:nth-child(1) > main > div > div.styles__FlexContainer-sc-mp632j-1.czHakJ > div.styles__MainContainer-sc-mp632j-2.ddTQeK > div:nth-child(2) > div.Pagination__Root-sc-1lprxge-0.ipxgGX > div > ul > li:nth-child(${pageNum + 2}) > a`));
                await nextPageButton.click();
            }
        }
    } catch (error) {
        console.error("Error occurred:", error);
    } finally {
        // Close the browser
        await driver.quit();
    }
}

// Execute the function
searchAndDownloadImages("sách công nghệ");
