const router = require('express').Router();

const Item = require('../models/item');

router.get('/', async (req, res, next) => {
  const items = await Item.find({});
  res.render('index', {items});
});

// Add additional routes below:
router.get('/items/create', (req, res, next) => {
  res.render('create');
});

router.post('/items/create', async (req, res) => {
  // TODO: fix - stop rasing UnhandledPromiseRejectionWarning
  const title = req.body.title;
  const description = req.body.description;
  const imageUrl= req.body.imageUrl;
  const newItem = new Item({title, description, imageUrl});
  const error = newItem.validateSync();
  if(newItem.errors) {
    res
      .status(400)
      .render('create', {newItem});
  } else {
    await newItem.save();
    res.redirect('/');
  }
});

router.get('/items/:itemId', async (req, res, next) => {
  console.log('handling /items/:itemId');
  var item = await Item.findById(req.params.itemId);
  console.log('item', item._id);
  res.render('item', {item});
});


module.exports = router;
