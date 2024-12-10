const express = require('express');

const {addItem, updateItem, deleteItem, fetchItem} = require('../controllers/cartController');

const router = express.Router();

router.get('/',fetchItem);
router.post('/',addItem);
router.put('/:id',updateItem);
router.delete('/:id',deleteItem);

module.exports = router;