import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Chip,
  IconButton,
  Divider,
  Badge,
  MenuItem,
  Select,
  Autocomplete,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import { useUser } from "@clerk/clerk-react";
import General from "../constants/General";



const CartCompanion = () => {
   const { user, isLoaded } = useUser();
  const [inventory, setInventory] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [selectedInventoryItem, setSelectedInventoryItem] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`${General.API_BASE_URL}api/items/getexpired?userId=${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setInventory(data);
        }
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };
    
    if (isLoaded && user) {
      fetchItems();
    }
  }, [user, isLoaded]);

  const categories = ["Fruits & Vegetables", "Dairy & Eggs", "Grains & Cereals", "Meat & Fish", "Packaged Foods", "Beverages","Condiments & Spices", "Others"];

  // Fetch cart items from backend
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await fetch(`${General.API_BASE_URL}api/cart?userId=${user.id}`);
        const data = await response.json();
  
        if (Array.isArray(data.items)) {
          setCartItems(data.items);
        } else {
          console.error("Invalid response format: Expected an array", data);
          setCartItems([]); 
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
        setCartItems([]); 
      }
    };
  
    if (isLoaded && user) {
      fetchCartItems();
    }
  }, [user, isLoaded]);

  // Add new item to backend
  const addItem = async (inventoryItem = null) => {
    const newItem = inventoryItem ? {
      userId: user.id,
      name: inventoryItem.name,
      category: inventoryItem.category || "Others",
      quantity: 1,
      price: inventoryItem.price || 0,
      priority: inventoryItem.daysToExpire < 3 ? "urgent" : "low",
      status: inventoryItem.status || "fresh",
    } : {
      userId: user.id,
      name: "",
      category: "Others",
      quantity: 1,
      price: 0,
      priority: "low",
      status: "fresh",
    };

    try {
      const response = await fetch(`${General.API_BASE_URL}api/cart/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newItem),
      });
      
      const responseData = await response.json();
      
      console.log('Add Item Response:', responseData);
      
      if (responseData.success) {
        setCartItems([...cartItems, responseData.item]);
        setSelectedInventoryItem(null); // Reset selection
      } else {
        console.error("Failed to add item:", {
          message: responseData.message,
          error: responseData.error
        });
        
        alert(`Failed to add item: ${responseData.message}`);
      }
    } catch (error) {
      console.error("Network or parsing error adding item:", error);
      alert('Failed to add item. Please check your connection.');
    }
  };

  // Update item in backend
  const updateItem = async (index, key, value) => {
    const updatedCart = [...cartItems];
    updatedCart[index] = { ...updatedCart[index], [key]: value };

    try {
      const response = await fetch(`${General.API_BASE_URL}api/cart/${updatedCart[index]._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedCart[index]),
      });
      
      const responseData = await response.json();
      
      if (responseData.success) {
        setCartItems(updatedCart);
      } else {
        console.error("Failed to update item:", responseData);
      }
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  // Delete item from backend
  const removeItem = async (index) => {
    const itemToRemove = cartItems[index];

    try {
      const response = await fetch(`${General.API_BASE_URL}api/cart/${itemToRemove._id}`, {
        method: "DELETE",
      });
      
      const responseData = await response.json();
      
      if (responseData.success) {
        const updatedCart = cartItems.filter((_, i) => i !== index);
        setCartItems(updatedCart);
      } else {
        console.error("Failed to delete item:", responseData);
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  // Calculate total cost
  const calculateTotalCost = () => {
    const cost = cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
    setTotalCost(cost);
  };

  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      '&:hover fieldset': {
        borderColor: '#FF6B6B',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#FF6B6B',
      },
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#FF6B6B',
    },
  };

  return (
    <Box
      sx={{
        p: { xs: 1, sm: 2, md: 3 },
        bgcolor: "#FFE5E5",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Box 
        sx={{ 
          display: "flex", 
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center", 
          gap: 2,
          mb: 3 
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          sx={{
            backgroundColor: "#FF6B6B",
            "&:hover": { backgroundColor: "#ff8585" },
            fontWeight: "bold",
            color: "white",
            width: { xs: "100%", sm: "auto" },
          }}
          onClick={() => window.history.back()}
        >
          Back
        </Button>
        <Typography 
          variant="h4" 
          sx={{ 
            flex: 1, 
            textAlign: "center", 
            fontWeight: "bold", 
            color: "#FF6B6B",
            fontSize: { xs: "1.75rem", sm: "2.25rem", md: "2.5rem" }
          }}
        >
          Cart Companion
        </Typography>
      </Box>

      {/* Inventory Suggestions */}
      <Box 
        sx={{ 
          display: "flex", 
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          mb: 3 
        }}
      >
        <Autocomplete
          options={inventory}
          getOptionLabel={(option) => `${option.name} (${option.category}) - Expiry Date: ${new Date(option.expires).toLocaleDateString('en-GB')}`}

          renderInput={(params) => (
            <TextField 
              {...params} 
              label="Suggestions from your Inventory" 
              variant="outlined"
              sx={textFieldStyles}
            />
          )}
          value={selectedInventoryItem}
          onChange={(event, newValue) => {
            setSelectedInventoryItem(newValue);
          }}
          sx={{ flexGrow: 1 }}
        />
        <Button
          variant="contained"
          onClick={() => selectedInventoryItem && addItem(selectedInventoryItem)}
          disabled={!selectedInventoryItem}
          sx={{
            bgcolor: "#FF6B6B",
            "&:hover": { bgcolor: "#ff8585" },
            "&.Mui-disabled": {
              bgcolor: "#FFB5B5",
              color: "white",
            },
            width: { xs: "100%", sm: "auto" },
          }}
        >
          Add from Inventory
        </Button>
      </Box>

      {/* Cart List */}
      <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
        {cartItems.map((item, index) => (
          <Box
            key={index}
            sx={{
              p: { xs: 2, sm: 3 },
              mb: 2,
              borderRadius: 2,
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              backgroundColor: "white",
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
              },
            }}
          >
            <Box 
              sx={{ 
                display: "flex", 
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                alignItems: { xs: "stretch", sm: "center" },
              }}
            >
              <TextField
                label="Item Name"
                variant="outlined"
                size="small"
                value={item.name || ""}
                onChange={(e) => updateItem(index, "name", e.target.value)}
                sx={{ ...textFieldStyles, flex: 1 }}
              />
              <Select
                value={item.category || "Others"}
                onChange={(e) => updateItem(index, "category", e.target.value)}
                size="small"
                sx={{
                  minWidth: 120,
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#FF6B6B',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#FF6B6B',
                    },
                  },
                }}
              >
                {categories.map((category, i) => (
                  <MenuItem key={i} value={category}>{category}</MenuItem>
                ))}
              </Select>
              <TextField
                label="Price"
                variant="outlined"
                size="small"
                type="number"
                value={item.price || 0}
                onChange={(e) => updateItem(index, "price", parseFloat(e.target.value) || 0)}
                sx={{ ...textFieldStyles, width: { xs: "100%", sm: 100 } }}
              />
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <IconButton 
                  onClick={() => updateItem(index, "quantity", Math.max(item.quantity - 1, 1))}
                  sx={{ color: '#FF6B6B' }}
                >
                  <RemoveIcon />
                </IconButton>
                <Badge 
                  badgeContent={item.quantity || 1} 
                  sx={{ 
                    '& .MuiBadge-badge': {
                      bgcolor: '#FF6B6B',
                      color: 'white'
                    }
                  }}
                />
                <IconButton 
                  onClick={() => updateItem(index, "quantity", (item.quantity || 1) + 1)}
                  sx={{ color: '#FF6B6B' }}
                >
                  <AddIcon />
                </IconButton>
              </Box>
              <Chip
                label={item.priority === "urgent" ? "Urgent" : "Low Priority"}
                color={item.priority === "urgent" ? "error" : "default"}
                onClick={() => updateItem(index, "priority", item.priority === "urgent" ? "low" : "urgent")}
                sx={{ 
                  bgcolor: item.priority === "urgent" ? "#FF6B6B" : "#FFE5E5",
                  color: item.priority === "urgent" ? "white" : "#FF6B6B",
                  '&:hover': {
                    bgcolor: item.priority === "urgent" ? "#ff8585" : "#FFD1D1"
                  }
                }}
              />
              <IconButton 
                onClick={() => removeItem(index)}
                sx={{
                  color: '#FF6B6B',
                  '&:hover': {
                    bgcolor: '#FFE5E5'
                  }
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
        ))}
      </Box>

      <Divider sx={{ my: 3, borderColor: '#FFB5B5' }} />

      {/* Add New Item and Budget Tracking */}
      <Box 
        sx={{ 
          display: "flex", 
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between", 
          alignItems: "center",
          gap: 2
        }}
      >
        <Button
          variant="contained"
          onClick={() => addItem()}
          sx={{
            bgcolor: "#FF6B6B",
            "&:hover": { bgcolor: "#ff8585" },
            width: { xs: "100%", sm: "auto" },
          }}
        >
          Add Item
        </Button>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: "bold", 
            color: "#FF6B6B",
            order: { xs: -1, sm: 0 }
          }}
        >
          Total Cost: ₹{totalCost}
        </Typography>
        <Button
          variant="contained"
          onClick={calculateTotalCost}
          sx={{
            bgcolor: "#FF6B6B",
            "&:hover": { bgcolor: "#ff8585" },
            width: { xs: "100%", sm: "auto" },
          }}
        >
          Calculate
        </Button>
      </Box>
    </Box>
  );
};

export default CartCompanion;

