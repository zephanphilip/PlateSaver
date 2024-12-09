import React, { useState } from "react";
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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";

const CartCompanion = () => {
  const [cartItems, setCartItems] = useState([
    { name: "Milk", category: "Dairy", quantity: 1, price: 50, priority: "low", status: "fresh" },
    { name: "Carrots", category: "Produce", quantity: 2, price: 40, priority: "urgent", status: "warning" },
    { name: "Bread", category: "Grains", quantity: 1, price: 30, priority: "urgent", status: "expired" },
  ]);

  const [totalCost, setTotalCost] = useState(0);

  const categories = ["Dairy", "Produce", "Grains", "Meat", "Snacks", "Beverages", "Others"];

  // Handlers
  const addItem = () => {
    setCartItems([
      ...cartItems,
      { name: "", category: "Others", quantity: 1, price: 0, priority: "low", status: "fresh" },
    ]);
  };

  const updateItem = (index, key, value) => {
    const updatedCart = [...cartItems];
    updatedCart[index][key] = value;
    setCartItems(updatedCart);
  };

  const removeItem = (index) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCart);
  };

  const calculateTotalCost = () => {
    const cost = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalCost(cost);
  };

  return (
    <Box
      sx={{
        p: 2,
        bgcolor: "#f4f4f4",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Button
          startIcon={<ArrowBackIcon sx={{ color: "white" }} />}
          sx={{
            backgroundColor: "#2a1581",
            "&:hover": { backgroundColor: "#43018f" },
            fontWeight: "bold",
            color: "white",
          }}
          onClick={() => window.history.back()}
        >
          Back
        </Button>
        <Typography variant="h4" sx={{ flex: 1, textAlign: "center", fontWeight: "bold", color: "#2a1581" }}>
          Cart Companion
        </Typography>
      </Box>

      {/* Cart List */}
      <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
        {cartItems.map((item, index) => (
          <Box
            key={index}
            sx={{
              p: 2,
              mb: 2,
              borderRadius: 2,
              bgcolor: item.status === "expired" ? "#ffcdd2" : item.status === "warning" ? "#fff9c4" : "white",
              boxShadow: 1,
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <TextField
                label="Item Name"
                variant="outlined"
                size="small"
                value={item.name}
                onChange={(e) => updateItem(index, "name", e.target.value)}
                sx={{ flex: 1, mr: 1 }}
              />
              <Select
                value={item.category}
                onChange={(e) => updateItem(index, "category", e.target.value)}
                size="small"
                sx={{ minWidth: 120, mr: 1 }}
              >
                {categories.map((category, i) => (
                  <MenuItem key={i} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
              <TextField
                label="Price"
                variant="outlined"
                size="small"
                type="number"
                value={item.price}
                onChange={(e) => updateItem(index, "price", parseFloat(e.target.value) || 0)}
                sx={{ width: 100, mr: 1 }}
              />
              <Box>
                <IconButton onClick={() => updateItem(index, "quantity", Math.max(item.quantity - 1, 1))}>
                  <RemoveIcon />
                </IconButton>
                <Badge badgeContent={item.quantity} color="primary" />
                <IconButton onClick={() => updateItem(index, "quantity", item.quantity + 1)}>
                  <AddIcon />
                </IconButton>
              </Box>
              <Chip
                label={item.priority === "urgent" ? "Urgent" : "Low Priority"}
                color={item.priority === "urgent" ? "error" : "default"}
                onClick={() => updateItem(index, "priority", item.priority === "urgent" ? "low" : "urgent")}
                sx={{ mx: 1 }}
              />
              <IconButton onClick={() => removeItem(index)}>
                <DeleteIcon color="error" />
              </IconButton>
            </Box>
          </Box>
        ))}
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Add New Item and Budget Tracking */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Button
          variant="contained"
          onClick={addItem}
          sx={{
            bgcolor: "#2a1581",
            "&:hover": { bgcolor: "#43018f" },
          }}
        >
          Add Item
        </Button>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#2a1581" }}>
          Total Cost: ₹{totalCost}
        </Typography>
        <Button
          variant="contained"
          onClick={calculateTotalCost}
          sx={{
            bgcolor: "#2a1581",
            "&:hover": { bgcolor: "#43018f" },
          }}
        >
          Calculate
        </Button>
      </Box>
    </Box>
  );
};

export default CartCompanion;
