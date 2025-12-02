import { expect } from "chai";
import buildDriver from "../base/driver.js";
import LoginPage from "../pages/LoginPage.js";

describe("AUTH TESTS", function () {
  this.timeout(30000);
  let driver;

  before(async () => {
    console.log("Starting ChromeDriver...");
    driver = await buildDriver();
    console.log("Driver started:", !!driver);
  });

  after(async () => {
    await driver.quit();
  });

  it("should register successfully", async () => {
    const loginPage = new LoginPage(driver);

    await loginPage.open();
    await loginPage.switchToRegister();
    await loginPage.fillRegisterForm(
      "krish",
      "krish+" + Date.now() + "@gm.c",
      "123456"
    );
    await loginPage.submit();

    await loginPage.waitForRedirectToBooking();
  });
});
