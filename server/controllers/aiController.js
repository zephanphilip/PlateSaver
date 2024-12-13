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

  // generate mealplan
  const generateMealPlan = async (itemNames) => {
    try {
      if (!itemNames ) {
        return "No valid item names provided.";
      }
      
      console.log(itemNames);
      
      const model = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // prompt
      const prompt = `Generate meal plan with ingredients: ${itemNames.join(', ')}`;
      const result = await model.generateContent(prompt);
  
      let aiResponse = await result.response.text();
      aiResponse = sanitizeResponse(aiResponse);
      console.log(aiResponse);
      return aiResponse;
    } catch (error) {
      if (error.status === 429) {
        console.warn("Rate limit exceeded. Retrying...");
        await new Promise((resolve) => setTimeout(resolve, 60000)); // Wait 1 minute
        return generateMealPlan(itemNames); // Retry the function
      }
      console.error('Error in AI completion:', error);
      throw error;
    }
  };

  const MealPlan = async (req,res) => {
    const { userId } = req.query;
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
        
        const mealplan = await generateMealPlan(itemNames); // Await the async function
        res.status(200).json({ mealplan }); // Send the resolved recipe
      } catch (error) {
        console.error("Error fetching items:", error);
        res.status(500).json({ message: "Error fetching items", error });
      }
  }

  module.exports = {CookLikeAChef,WhatToCook,MealPlan};