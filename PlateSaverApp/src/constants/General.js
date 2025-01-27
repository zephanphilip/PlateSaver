const WELCOME_CONTENTS = [
    {
        image: 'i1',
        title: 'Smart Meal Management',
        content: 'Plan your week effortlessly with AI-driven meal plans, find recipes instantly using your pantry items, and explore exciting new dishes tailored to your tastes.'
    },
    {
        image: 'i2',
        title: 'Food Inventory & Shopping',
        content: 'Track your pantry with ease, avoid food waste with inventory tools, and create smart shopping lists to simplify grocery trips.'
    },
    {
        image: 'i3',
        title: 'Community Sharing',
        content: 'Donate surplus food to those in need or claim available food nearby, fostering a community committed to reducing food waste.'
    },
]

const API_BASE_URL = "http://172.30.29.4:3001/"

const MENUS_CONTENTS =[{
    name: 'Cook Like A Chef!',
    desc: 'Discover recipes tailored to your cravings or dietary needs',
    img: 'w1',
    route: 'CookLikeAChef',
  },
  {
    name: 'What to Cook?',
    desc: 'Discover recipes using only what\'s in your pantry',
    img: 'whatscooking',
    route: 'WhatToCook',
  },
  {
    name: 'Smart Meal Planner',
    desc: 'Plan your meals with personalized suggestions',
    img: 'mealplan',
    route: 'SmartMealPlanner',
  },
  {
    name: 'Pantry Pro',
    desc: 'Organize your food inventory and manage your list',
    img: 'cartcomp',
    route: 'PantryPro',
  },
  {
    name: 'Cart Companion',
    desc: 'Manage your shopping list and be ready for grocery runs',
    img: 'pantrypro',
    route: 'CartCompanion',
  },
]

export default {WELCOME_CONTENTS,MENUS_CONTENTS,API_BASE_URL}