const CartItem = require("../models/cartModel")

// Add a new item
// cartController.js
const addItem = async(req,res) => {
    const { userId, name, category, quantity, price, priority, status } = req.body;

    // Add more robust validation
    if (!userId) {
        return res.status(400).json({ 
            success: false, 
            message: "User ID is required" 
        });
    }

    try {
      // Add default values and ensure all required fields are present
      const newItem = new CartItem({ 
        userId, 
        name: name || '', 
        category: category || 'Others', 
        quantity: quantity || 1, 
        price: price || 0, 
        priority: priority || 'low', 
        status: status || 'fresh'
      });

      await newItem.save();
      
      // Log the saved item for debugging
      console.log('New item saved:', newItem);

      res.status(201).json({ 
        success: true, 
        item: newItem 
      });
    } catch (error) {
      // Log the full error for detailed debugging
      console.error('Error adding item:', error);

      res.status(500).json({ 
        success: false, 
        message: "Failed to add item", 
        error: {
          name: error.name,
          message: error.message,
          details: error.errors || error
        }
      });
    }
}

//fetch item
const fetchItem = async(req,res) => {
    const { userId } = req.query;

    try {
      const items = await CartItem.find({ userId });
      res.status(200).json({ success: true, items });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch items", error });
    }
}


//update item

const updateItem = async(req,res) => {
    const { id } = req.params;
    const { name, category, quantity, price, priority, status } = req.body;
  
    try {
      const updatedItem = await CartItem.findByIdAndUpdate(
        id,
        { name, category, quantity, price, priority, status },
        { new: true }
      );
      res.status(200).json({ success: true, item: updatedItem });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to update item", error });
    }
}


//delete item
const deleteItem = async(req,res) => {
    const { id } = req.params;

    try {
      await CartItem.findByIdAndDelete(id);
      res.status(200).json({ success: true, message: "Item deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to delete item", error });
    }
}

module.exports = {addItem, updateItem, deleteItem, fetchItem}