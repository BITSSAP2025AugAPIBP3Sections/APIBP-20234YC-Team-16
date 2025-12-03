describe('AUTH TESTS', () => {
  it('register and login', async () => {
    await browser.url('/login');

    // Switch to register if your UI toggles
    const regBtn = await $('//button[contains(.,"Register")]').catch(()=>null);
    if (regBtn) await regBtn.click();

    // Fill register
    const name = await $("[name='name'], #name, input[placeholder*='Name']");
    const email = await $("[name='email'], #email, input[type='email']");
    const pass = await $("[name='password'], #password, input[type='password']");

    await name.setValue(`yuvi+${Date.now()}@test.com`);
    await email.setValue(`yuvi+${Date.now()}@test.com`);
    await pass.setValue('123456');

    await $("button[type='submit']").click();

    // wait for redirect to /book
    await browser.waitUntil(async () => (await browser.getUrl()).includes('/book'), {
      timeout: 10000,
      timeoutMsg: 'expected to be redirected to /book'
    });
  });
});
