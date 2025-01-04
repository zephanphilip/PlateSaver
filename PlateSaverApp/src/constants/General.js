const WELCOME_CONTENTS = [
    {
        image: 'w1',
        title: 'sample data 1',
        content: 'blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah'
    },
    {
        image: 'w1',
        title: 'sample data 2',
        content: 'blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah'
    },
    {
        image: 'w1',
        title: 'sample data 3',
        content: 'blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah'
    },
]

const MENUS_CONTENTS =[{
    name: 'Cook Like A Chef!',
    desc: 'Discover recipes tailored to your cravings or dietary needs',
    img: 'w1',
    route: '/cooklikeachef',
  },
  {
    name: 'What to Cook?',
    desc: 'Discover recipes using only what\'s in your pantry',
    img: 'whatscooking',
    route: '/whattocook',
  },
  {
    name: 'Smart Meal Planner',
    desc: 'Plan your meals with personalized suggestions',
    img: 'mealplan',
    route: '/mealplan',
  },
  {
    name: 'Pantry Pro',
    desc: 'Organize your food inventory and manage your list',
    img: 'cartcomp',
    route: '/pantrypro',
  },
  {
    name: 'Cart Companion',
    desc: 'Manage your shopping list and be ready for grocery runs',
    img: 'pantrypro',
    route: '/cartcomp',
  },
]

export default {WELCOME_CONTENTS,MENUS_CONTENTS}