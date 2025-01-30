const express = require('express');

const { CookLikeAChef, WhatToCook, MealPlan} = require('../controllers/aiController');

const router = express.Router();
console.log("ai router used");
router.post("/cooklikeachef",CookLikeAChef);

router.get("/whattocook",WhatToCook);

router.get("/mealplan", MealPlan);

module.exports = router;