const Item = require('../models/itemModel');

//get items
const getItem =  async (req, res) => {
    const { userId } = req.query; // Extract userId from query parameters

    try {
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
  
      // Find items for the specific user
      const items = await Item.find({ userId });
  
      res.json(items);
    } catch (error) {
      console.error("Error fetching items:", error);
      res.status(500).json({ message: "Error fetching items", error });
    }
  
}
//fetch expired item
const getExpiredItem = async (req, res) => {
  const { userId } = req.query; // Extract userId from query parameters
  try {
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const currentDate = new Date();
    const twoDaysFromNow = new Date();
    twoDaysFromNow.setDate(currentDate.getDate() + 2);
    
    // Find items that are expired OR will expire in next 2 days
    const items = await Item.find({
      userId,
      $or: [
        { expires: { $lt: currentDate } },  // already expired
        { expires: { 
            $gte: currentDate,              // not expired yet but...
            $lte: twoDaysFromNow           // will expire within 2 days
          }
        }
      ]
    });
    
    console.log(items);
    res.json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ message: "Error fetching items", error });
  }
};


//post items
const postItem = async (req, res) => {
    try {
        const { userId, name, quantity, category, expires, status } = req.body;
        if (!userId) {
          return res.status(400).json({ message: "User ID is required" });
        }
        const newItem = new Item({ userId, name, quantity, category, expires, status });
        const savedItem = await newItem.save();
        res.json({ item: savedItem });
      } catch (error) {
        res.status(500).json({ message: "Error adding item", error });
      }
}

//update item

const updateItem = async (req, res) => {
    const { id } = req.params; // Item ID from URL params
  const { userId, name, quantity, category, expires, status } = req.body; // Extract details from request body

  try {
    // Find the item by ID
    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Check if the userId matches
    if (item.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Update the item fields
    item.name = name || item.name;
    item.quantity = quantity || item.quantity;
    item.category = category || item.category;
    item.expires = expires || item.expires;
    item.status = status || item.status;

    // Save the updated item
    const updatedItem = await item.save();

    res.json({ item: updatedItem, message: "Item updated successfully" });
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({ message: "Error updating item", error });
  }
}

//delete item

const deleteItem = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.query;

  try {
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Ensure the item belongs to the requesting user
    const item = await Item.findOne({ _id: id, userId });
    if (!item) {
      return res.status(404).json({ message: "Item not found or unauthorized access" });
    }

    await Item.deleteOne({ _id: id });
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ message: "Error deleting item", error });
  }
}

const updateNotified = async (req, res) => {
  try {
    const { itemId } = req.body;
    
    if (!itemId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Item ID is required' 
      });
    }

    const updatedItem = await Item.findByIdAndUpdate(
      itemId,
      { notified: true },
      { new: true }  // Returns the updated document
    );

    if (!updatedItem) {
      return res.status(404).json({ 
        success: false, 
        message: 'Item not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Notification status updated successfully',
      item: updatedItem 
    });

  } catch (error) {
    console.error('Error updating notification status:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating notification status',
      error: error.message 
    });
  }
}

module.exports = {getItem, deleteItem, updateItem, postItem, getExpiredItem, updateNotified}