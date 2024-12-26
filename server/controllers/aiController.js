const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const Item = require('../models/itemModel');


// Function to remove * and # from the AI response
const sanitizeResponse = (response) => {
    return response.replace(/[*#]/g, '');
};


//Recipe Generation Function
const generateRecipe = async (prompt) => {
    try {
        console.log(prompt);
      if (!prompt) return "Please provide a valid prompt.";
  
      const model = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const result = await model.generateContent(["Generate ingredients first and then steps for a recipe of", prompt]);
  
      let aiResponse = await result.response.text();
      aiResponse = sanitizeResponse(aiResponse);
        console.log(aiResponse);
      return aiResponse;
    } catch (error) {
      if (error.status === 429) {
        console.warn("Rate limit exceeded. Retrying...");
        // Retry after a delay (e.g., 1 minute)
        await new Promise((resolve) => setTimeout(resolve, 60000));
        return generateRecipe(prompt);
      }
      console.error('Error in AI completion:', error);
      throw error;
    }
  };

  
  // API Endpoint for Recipe Generation
const CookLikeAChef = async (req, res) => {
    const { prompt } = req.body;
  
    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({ message: "Prompt is required." });
    }
  
    try {
      const recipe = await generateRecipe(prompt); // Await the async function
      res.status(200).json({ recipe }); // Send the resolved recipe
    } catch (error) {
      console.error("Error generating recipe:", error);
      res.status(500).json({ message: "Error generating recipe." });
    }
  };
  

// generate multiple recipies
  const generateMultipleRecipe = async (itemNames) => {
    try {
      if (!itemNames ) {
        return "No valid item names provided.";
      }
      
      console.log(itemNames);
      
      const model = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // prompt
      const prompt = `Generate steps for a recipe using these ingredients: ${itemNames.join(', ')}`;
      const result = await model.generateContent(prompt);
  
      let aiResponse = await result.response.text();
      aiResponse = sanitizeResponse(aiResponse);
      console.log(aiResponse);
      return aiResponse;
    } catch (error) {
      if (error.status === 429) {
        console.warn("Rate limit exceeded. Retrying...");
        await new Promise((resolve) => setTimeout(resolve, 60000)); // Wait 1 minute
        return generateMultipleRecipe(itemNames); // Retry the function
      }
      console.error('Error in AI completion:', error);
      throw error;
    }
  };
  
  const WhatToCook = async (req, res) => {
    const { userId } = req.query; // Extract userId from query parameters
    console.log(userId);
  
    try {
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
  
      const items = await Item.find({
        userId,
        category: { $nin: ["Packaged Foods", "others"] },
        status: { $in: ["warning", "fresh"] },
      });
  
      if (items.length === 0) {
        return res.status(400).json({ message: "No valid items found" });
      }
  
      const itemNames = items.map(item => item.name);
      
      const recipe = await generateMultipleRecipe(itemNames); // Await the async function
      res.status(200).json({ recipe }); // Send the resolved recipe
    } catch (error) {
      console.error("Error fetching items:", error);
      res.status(500).json({ message: "Error fetching items", error });
    }
  };

  // generate mealplanconst 
  const generateMealPlan = async (itemNames) => {
    const model = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Generate a detailed weekly meal plan with breakfast, lunch, and dinner, if possible using: ${itemNames.join(', ')}`;
    const result = await model.generateContent(prompt);

    let aiResponse = await result.response.text();
    aiResponse = sanitizeResponse(aiResponse); // Sanitize if necessary
    console.log('AI Response:', aiResponse); // Debugging: Log AI response

    // Initialize days and regex for parsing
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const dayRegex = new RegExp(`(${daysOfWeek.join("|")}):`, "gi");

    // Split the response into sections by day
    const sections = aiResponse.split(dayRegex).slice(1); // Skip the preamble
    const mealPlan = [];

    for (let i = 0; i < sections.length; i += 2) {
        const day = sections[i].trim(); // Get the day name
        const mealsSection = sections[i + 1].trim(); // Get the corresponding meal details

        const dayPlan = {
            day,
            meals: {
                breakfast: "",
                lunch: "",
                dinner: ""
            }
        };

        // Extract meal details using regex for Breakfast, Lunch, and Dinner
        const mealRegex = /(Breakfast:.*?)(Lunch:.*?)(Dinner:.*?)(?=\n|$)/is;
        const mealMatch = mealsSection.match(mealRegex);

        if (mealMatch) {
            dayPlan.meals.breakfast = mealMatch[1]?.replace(/Breakfast:/i, "").trim() || "";
            dayPlan.meals.lunch = mealMatch[2]?.replace(/Lunch:/i, "").trim() || "";
            dayPlan.meals.dinner = mealMatch[3]?.replace(/Dinner:/i, "").trim() || "";
        }

        mealPlan.push(dayPlan);
    }

    console.log('Parsed meal plan:', mealPlan); // Debugging: Log parsed meal plan
    return mealPlan;
};

  const parseResponse = (aiResponse) => {
    const days = [];
    const dayRegex = /(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday):/gi;
    const sections = aiResponse.split(dayRegex).slice(1); // Skip the first part if it's preamble
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    
    sections.forEach((section, index) => {
        const meals = section.split('\n').filter(line => line.trim());
        const dayPlan = {
            day: daysOfWeek[index],
            meals: {
                breakfast: "",
                lunch: "",
                dinner: ""
            }
        };
  
        meals.forEach((meal) => {
            if (meal.toLowerCase().startsWith("breakfast:")) {
                dayPlan.meals.breakfast = meal.replace(/breakfast:/i, "").trim();
            } else if (meal.toLowerCase().startsWith("lunch:")) {
                dayPlan.meals.lunch = meal.replace(/lunch:/i, "").trim();
            } else if (meal.toLowerCase().startsWith("dinner:")) {
                dayPlan.meals.dinner = meal.replace(/dinner:/i, "").trim();
            }
        });
  
        days.push(dayPlan);
    });
  
    console.log('Parsed meal plan:', days); // Log to check the final parsed structure
    return days;
  };
  
  



  const MealPlan = async (req, res) => {
    const { userId } = req.query;
    try {
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }
  
        const items = await Item.find({
            userId,
            category: { $nin: ["Packaged Foods", "others"] },
            status: { $in: ["warning", "fresh"] },
        });
  
        if (items.length === 0) {
            return res.status(400).json({ message: "No valid items found" });
        }
  
        const itemNames = items.map(item => item.name);
        console.log('Item names:', itemNames); // Check the list of items
  
        const mealplan = await generateMealPlan(itemNames);
        console.log('Generated meal plan:', mealplan); // Check the generated meal plan data
        
        res.status(200).json({ success: true, mealPlan: mealplan });
    } catch (error) {
        console.error("Error fetching items:", error);
        res.status(500).json({ message: "Error fetching items", error });
    }
  };
  


  module.exports = {CookLikeAChef,WhatToCook,MealPlan};