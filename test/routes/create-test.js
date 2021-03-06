const {assert} = require('chai');
const request = require('supertest');
const {jsdom} = require('jsdom');

const app = require('../../app');
const Item = require('../../models/item');

const {parseTextFromHTML, buildItemObject} = require('../test-utils');
const {connectDatabaseAndDropData, diconnectDatabase} = require('../setup-teardown-utils');

const findImageElementBySource = (htmlAsString, src) => {
  const image = jsdom(htmlAsString).querySelector(`img[src="${src}"]`);
  if (image !== null) {
    return image;
  } else {
    throw new Error(`Image with src "${src}" not found in HTML string`);
  }
};

describe('Server path: /items/create', () => {
  const itemToCreate = buildItemObject();


  beforeEach(connectDatabaseAndDropData);

  afterEach(diconnectDatabase);

  // Write your describe blocks below:
  describe('GET', () => {
    it('renders empty input fields', async () => {
      const response = await request(app)
        .get('/items/create');
      assert.equal(parseTextFromHTML(response.text, `input#title-input`), '');
      assert.equal(parseTextFromHTML(response.text, `input#imageUrl-input`), '');
      assert.equal(parseTextFromHTML(response.text, `textarea#description-input`), '');

    });
  });
  describe('POST', () => {

    it('creates an item and persists it', async () => {
      const response = await request(app)
        .post('/items/create')
        .type('form')
        .send(itemToCreate);

      createdItem = await Item.findOne(itemToCreate);
      assert.isOk(createdItem);
    });

    it('redirects to / when a new item is created', async () => {
      const response = await request(app)
        .post('/items/create')
        .type('form')
        .send(itemToCreate);

      assert.equal(response.status, 302);
       assert.equal(response.headers.location, '/');
    });

    it('displays an error when empty title is passed', async () => {
      const itemToCreateWithError = {
        description: itemToCreate.description,
        imageUrl: itemToCreate.imageUrl
      };
      const response = await request(app)
        .post('/items/create')
        .type('form')
        .send(itemToCreateWithError);
      const items = await Item.find({});
      assert.equal(items.length, 0);
      assert.equal(response.status, 400);
      assert.include(parseTextFromHTML(response.text, '.error'), 'required');
    });

    it('displays an error when empty description is passed', async () => {
      const itemToCreateWithError = {
        imageUrl: itemToCreate.imageUrl,
        title: itemToCreate.title
      };
      const response = await request(app)
        .post('/items/create')
        .type('form')
        .send(itemToCreateWithError);
      const items = await Item.find({});
      assert.equal(items.length, 0);
      assert.equal(response.status, 400);
      assert.include(parseTextFromHTML(response.text, '.error'), 'required');
    });

    it('displays an error when empty imageUrl is passed', async () => {
      const itemToCreateWithError = {
        title: itemToCreate.title,
        description: itemToCreate.description
      };
      const response = await request(app)
        .post('/items/create')
        .type('form')
        .send(itemToCreateWithError);
      const items = await Item.find({});
      assert.equal(items.length, 0);
      assert.equal(response.status, 400);
      assert.include(parseTextFromHTML(response.text, '.error'), 'required');
    });
  });
});
