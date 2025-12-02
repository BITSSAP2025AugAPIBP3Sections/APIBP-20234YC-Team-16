import { By } from "selenium-webdriver";

export default class MyBookingsPage {
  constructor(driver) {
    this.driver = driver;
  }

  async open() {
    await this.driver.get("http://localhost:3000/my-bookings");
  }

  async getBookings() {
    await this.driver.sleep(1500);
    const selectors = [
      ".booking-card",
      ".booking-item",
      "div.booking",
      "div[class*='card']",
      "div[class*='booking']",
      "//div[contains(@class,'card')]",
      "//div[contains(@class,'booking')]"
    ];

    for (let sel of selectors) {
      const elements = sel.startsWith("//")
        ? await this.driver.findElements(By.xpath(sel))
        : await this.driver.findElements(By.css(sel));

      if (elements.length > 0) return elements.length;
    }

    return 0; // no bookings found
  }
}
