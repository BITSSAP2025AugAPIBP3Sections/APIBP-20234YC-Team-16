import { Builder } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";

async function test() {
  try {
    console.log("Launching Chrome...");
    const driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(new chrome.Options())
      .build();

    console.log("SUCCESS: Chrome launched!");
    await driver.quit();
  } catch (err) {
    console.error("FAILED:", err);
  }
}

await test();
