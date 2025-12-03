describe('BOOKING FLOW', () => {
  beforeEach(async () => {
    await browser.url('/login');
    // quick login with existing test account (or reuse token)
    const email = await $("[name='email'], #email");
    const pass = await $("[name='password'], #password");
    await email.setValue('krish@gm.c');
    await pass.setValue('123456');
    await $("button[type='submit']").click();
    await browser.waitUntil(async () => (await browser.getUrl()).includes('/book'), { timeout: 10000 });
  });

  it('creates a booking and shows in my bookings', async () => {
    // fill date
    const dateInput = await $("input[type='date']");
    await dateInput.setValue('2025-01-01');

    // select court
    const sel = await $("select");
    await sel.selectByVisibleText('Court 1');

    // wait for slots then click first slot
    await browser.waitUntil(async () => (await $$('button.slot-button')).length > 0, { timeout: 10000 });
    const slots = await $$('button.slot-button');
    await slots[0].click();

    // fill player
    const pname = await $("[name='name'], input[placeholder*='Name'], input[class*='player']");
    const pemail = await $("[name='email'], input[placeholder*='Email'], input[class*='player']");
    await pname.setValue('Yuvi');
    await pemail.setValue('yuvi@test.com');

    // confirm
    await $("//button[contains(.,'Confirm Booking')]").click();

    // wait for success message
    const msg = await $('p.success-message');
    await msg.waitForDisplayed({ timeout: 10000 });
    expect(await msg.getText()).toContain('Booking successful');

    // go to my bookings
    await browser.url('/my-bookings');
    await browser.pause(1000);
    const cards = await $$('div[class*="booking"], .booking-card, .booking-item');
    expect(cards.length).toBeGreaterThan(0);
  });
});
 