import { By, until } from "selenium-webdriver";
import config from "../test-config.js";

export default class BookingPage {
  constructor(driver) {
    this.driver = driver;
  }

  async selectDate(dateStr) {
    const dateInput = await this.driver.findElement(By.css("input[type='date']"));
    await dateInput.sendKeys(dateStr);
  }

  async selectCourt(courtName) {
    const dropdown = await this.driver.findElement(By.css("select"));
    await dropdown.click();
    const option = await dropdown.findElement(By.xpath(`//option[contains(text(),'${courtName}')]`));
    await option.click();
  }

  // ⭐ NEW: WAIT FOR SLOT BUTTONS TO APPEAR
  async waitForSlots() {
    await this.driver.wait(
      until.elementLocated(By.css("button.slot-button")),
      10000
    );
  }

  async selectSlot() {
    // wait for at least one slot button
    await this.driver.wait(
      until.elementLocated(By.css("button.slot-button")),
      15000
    );

    // get ALL slots
    const slots = await this.driver.findElements(By.css("button.slot-button"));

    console.log("Slot count:", slots.length);

    if (slots.length === 0) {
      throw new Error("No slots found on UI");
    }

    // print slot texts to console (for debug)
    for (let i = 0; i < slots.length; i++) {
      const text = await slots[i].getText();
      console.log(`Slot ${i}:`, text);
    }

    // click the FIRST available slot
    await slots[0].click();
  }


  async addPlayer(name, email) {
    const nameInput = await this.driver.findElement(By.css("input[name='name'], input[id='name']"));
    const emailInput = await this.driver.findElement(By.css("input[name='email'], input[id='email']"));

    await nameInput.sendKeys(name);
    await emailInput.sendKeys(email);
  }

  async submitBooking() {
  const btn = await this.driver.findElement(
    By.xpath("//button[contains(text(),'Confirm Booking')]")
  );
  await this.driver.executeScript("arguments[0].scrollIntoView(true);", btn);
  await btn.click();
}


  async getSuccessMessage() {
    // wait for the success message to appear
    const msgEl = await this.driver.wait(
      until.elementLocated(By.css("p.success-message")),
      15000
    );
    await this.driver.executeScript("arguments[0].scrollIntoView(true);", msgEl);

    return await msgEl.getText();
  }

}
