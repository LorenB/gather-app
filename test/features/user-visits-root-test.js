const {assert} = require('chai');

describe('User visits root', () => {
  describe('without existing items', () => {
    it('starts blank', () => {
      browser.url('/');
      assert.equal(browser.getText('#items-container'), '');
    });
  });
  describe('then visits create', () => {
    it('starts with empty input fields', () => {
      browser.url('/');
      browser.click('a[href="create.html"]');
    });
  });
});
