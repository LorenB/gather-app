const Item = require('../../models/item');
const {assert} = require('chai');
const {mongoose, databaseUrl, options} = require('../../database');

describe('Model: Item', () => {
  beforeEach(async () => {
    await mongoose.connect(databaseUrl, options);
    await mongoose.connection.db.dropDatabase();
  });

  afterEach(async () => {
    await mongoose.disconnect();
  });

  // Write your tests below:
  describe('#title', () => {
    it('is a String', () => {
      const titleInvalid = 0;
      const item = new Item({
        title: titleInvalid,
        description: 'something',
        imageUrl: 'http://example.com/image.jpeg'
      });
      assert.strictEqual(item.title, titleInvalid.toString() );
    });
    
    it('is required', async () => {
      const titleInvalid = 0;
      const item = await new Item({
        description: 'something',
        imageUrl: 'http://example.com/image.jpeg'
      });

      const error = item.validateSync();
      assert.equal(error.errors.title.message, 'Path `title` is required.');
    });
  });
});
