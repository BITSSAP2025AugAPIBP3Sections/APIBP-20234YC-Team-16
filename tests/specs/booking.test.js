import { expect } from "chai";
import buildDriver from "../base/driver.js";
import LoginPage from "../pages/LoginPage.js";
import BookingPage from "../pages/BookingPage.js";
import MyBookingsPage from "../pages/MyBookingsPage.js";

describe("BOOKING FLOW TESTS", function () {
  this.timeout(40000);
  let driver;

  before(async () => {
    driver = await buildDriver();

    const loginPage = new LoginPage(driver);
    await loginPage.open();
    await loginPage.switchToLogin();
    await loginPage.fillLoginForm("krish@gm.c", "123456");
    await loginPage.submit();
    await loginPage.waitForRedirectToBooking();
  });

  after(async () => {
    await driver.quit();
  });

  it("should create a booking", async () => {
    const bookingPage = new BookingPage(driver);

    await bookingPage.selectDate("2025-01-01");
    await bookingPage.selectCourt("Court 1");
    await bookingPage.waitForSlots();
    await bookingPage.selectSlot();
    await bookingPage.addPlayer("krish", "krish@gm.c");

    await bookingPage.submitBooking();

    const msg = await bookingPage.getSuccessMessage();
    expect(msg).to.include("Booking successful");
  });

  it("should show booking in My Bookings page", async () => {
    const myBookings = new MyBookingsPage(driver);
    await myBookings.open();

    const count = await myBookings.getBookings();
    expect(count).to.be.greaterThan(0);
  });
});
