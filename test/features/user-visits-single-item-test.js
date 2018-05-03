const {assert} = require('chai');
const {buildItemObject} = require('../test-utils');


describe('User visits Single Item page', () => {
  describe('after entering data', () => {
    it('render data for that item only', () => {
      browser.url('/items/create');
      const itemToCreate = buildItemObject();
      browser.setValue('#title-input', itemToCreate.title);
      browser.setValue('#description-input', itemToCreate.description);
      browser.setValue('#imageUrl-input', itemToCreate.imageUrl);
      browser.click('#submit-button');
      browser.click('.item-card a');
      assert.include(browser.getText('body'), itemToCreate.description);

    });
  });
});
