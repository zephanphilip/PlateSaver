const express = require('express');

const {getItem,postItem,updateItem,deleteItem,getExpiredItem} = require('../controllers/itemController');

const router = express.Router();

router.get('/',getItem);
router.post('/',postItem);
router.put("/:id",updateItem);
router.delete("/:id",deleteItem);
router.get('/getexpired',getExpiredItem);

module.exports = router;