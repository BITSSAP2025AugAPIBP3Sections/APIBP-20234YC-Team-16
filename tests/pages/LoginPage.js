import { By, until } from "selenium-webdriver";
import config from "../test-config.js";

export default class LoginPage {
  constructor(driver) {
    this.driver = driver;
  }

  async open() {
    await this.driver.get(`${config.baseUrl}/login`);
  }

  async switchToRegister() {
    const btn = await this.driver.findElement(By.xpath("//button[contains(text(),'Register')]"));
    await btn.click();
  }

  async switchToLogin() {
    const btn = await this.driver.findElement(By.xpath("//button[contains(text(),'Login')]"));
    await btn.click();
  }

  // async fillRegisterForm(name, email, password) {
  //   await this.driver.findElement(By.css("input[placeholder='Name']")).sendKeys(name);
  //   await this.driver.findElement(By.css("input[type='email']")).sendKeys(email);
  //   await this.driver.findElement(By.css("input[type='password']")).sendKeys(password);
  // }
  async fillRegisterForm(name, email, password) {
    await this.driver.findElement(By.css("input[name='name'], input[id='name']")).sendKeys(name);
    await this.driver.findElement(By.css("input[name='email'], input[id='email']")).sendKeys(email);
    await this.driver.findElement(By.css("input[name='password'], input[id='password']")).sendKeys(password);
  }

  async fillLoginForm(email, password) {
    await this.driver.findElement(By.css("input[name='email'], input[id='email']")).sendKeys(email);
    await this.driver.findElement(By.css("input[name='password'], input[id='password']")).sendKeys(password);
  }


  async submit() {
    await this.driver.findElement(By.css("button[type='submit']")).click();
  }

  async waitForRedirectToBooking() {
    await this.driver.wait(until.urlContains("/book"), 10000);
  }
}
