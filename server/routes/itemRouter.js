const express = require('express');

const {getItem,postItem,updateItem,deleteItem,getExpiredItem, updateNotified} = require('../controllers/itemController');

const router = express.Router();

router.get('/',getItem);
router.post('/',postItem);
router.put("/:id",updateItem);
router.delete("/:id",deleteItem);
router.get('/getexpired',getExpiredItem);
router.post('/update-notification',updateNotified);

module.exports = router;