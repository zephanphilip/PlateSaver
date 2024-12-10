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

const API_BASE_URL = "http://localhost:3001/api/cart"; 

const CartCompanion = () => {
  const { user, isLoaded } = useUser();
  const [inventory, setInventory] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [selectedInventoryItem, setSelectedInventoryItem] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/items/getexpired?userId=${user.id}`);
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

  const categories = ["Dairy", "Produce", "Grains", "Meat", "Snacks", "Beverages", "Others"];

  // Fetch cart items from backend
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}?userId=${user.id}`);
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
      const response = await fetch(`${API_BASE_URL}/`, {
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
      const response = await fetch(`${API_BASE_URL}/${updatedCart[index]._id}`, {
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
      const response = await fetch(`${API_BASE_URL}/${itemToRemove._id}`, {
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

      {/* Inventory Suggestions */}
      <Box sx={{ display: "flex", mb: 2 }}>
        <Autocomplete
          options={inventory}
          getOptionLabel={(option) => `${option.name} (${option.category}) - Expires in ${option.expires} days`}
          renderInput={(params) => <TextField {...params} label="Suggestions from your Inventory" variant="outlined" />}
          value={selectedInventoryItem}
          onChange={(event, newValue) => {
            setSelectedInventoryItem(newValue);
          }}
          sx={{ flexGrow: 1, mr: 1 }}
        />
        <Button
          variant="contained"
          onClick={() => selectedInventoryItem && addItem(selectedInventoryItem)}
          disabled={!selectedInventoryItem}
          sx={{
            bgcolor: "#2a1581",
            "&:hover": { bgcolor: "#43018f" },
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
              p: 2,
              mb: 2,
              borderRadius: 2,
              boxShadow: 1,
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <TextField
                label="Item Name"
                variant="outlined"
                size="small"
                value={item.name || ""}
                onChange={(e) => updateItem(index, "name", e.target.value)}
                sx={{ flex: 1, mr: 1 }}
              />
              <Select
                value={item.category || "Others"}
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
                value={item.price || 0}
                onChange={(e) => updateItem(index, "price", parseFloat(e.target.value) || 0)}
                sx={{ width: 100, mr: 1 }}
              />
              <Box>
                <IconButton onClick={() => updateItem(index, "quantity", Math.max(item.quantity - 1, 1))}>
                  <RemoveIcon />
                </IconButton>
                <Badge badgeContent={item.quantity || 1} color="primary" />
                <IconButton onClick={() => updateItem(index, "quantity", (item.quantity || 1) + 1)}>
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
          onClick={() => addItem()}
          sx={{
            bgcolor: "#2a1581",
            "&:hover": { bgcolor: "#43018f" },
          }}
        >
          Add Empty Item
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

// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Button,
//   Typography,
//   TextField,
//   Chip,
//   IconButton,
//   Divider,
//   Badge,
//   MenuItem,
//   Select,
// } from "@mui/material";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import AddIcon from "@mui/icons-material/Add";
// import RemoveIcon from "@mui/icons-material/Remove";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { useUser } from "@clerk/clerk-react";

// const API_BASE_URL = "http://localhost:3001/api/cart"; 

// const CartCompanion = () => {
//   const { user, isLoaded } = useUser();
//   const [inventory, setInventory] = useState([]);
//   const [cartItems, setCartItems] = useState([]);
//   const [totalCost, setTotalCost] = useState(0);
//   useEffect(() => {
//     const fetchItems = async () => {
//       try {
//         const response = await fetch(`http://localhost:3001/api/items/getexpired?userId=${user.id}`);
//         if (response.ok) {
//           const data = await response.json();
//           setInventory(data);
//         }
//       } catch (error) {
//         console.error("Error fetching items:", error);
//       }
//     };
    
//   fetchItems();
// }, [user]);

//   const categories = ["Dairy", "Produce", "Grains", "Meat", "Snacks", "Beverages", "Others"];

//   // Fetch cart items from backend
//   useEffect(() => {
//     const fetchCartItems = async () => {
//       try {
//         const response = await fetch(`${API_BASE_URL}?userId=${user.id}`);
//         const data = await response.json();
  
//         // Ensure `data.items` is an array before setting state
//         if (Array.isArray(data.items)) {
//           setCartItems(data.items);
//         } else {
//           console.error("Invalid response format: Expected an array", data);
//           setCartItems([]); // Fallback to empty array
//         }
//       } catch (error) {
//         console.error("Error fetching cart items:", error);
//         setCartItems([]); // Fallback to empty array on error
//       }
//     };
  
//     fetchCartItems();
//   }, []);
//   // Add new item to backend
//  // CartCompanion.jsx
// const addItem = async () => {
//   const newItem = {
//     userId: user.id,
//     name: "",
//     category: "Others",
//     quantity: 1,
//     price: 0,
//     priority: "low",
//     status: "fresh",
//   };

//   try {
//     const response = await fetch(`${API_BASE_URL}/`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(newItem),
//     });
    
//     // Parse the response
//     const responseData = await response.json();
    
//     // Log the full response for debugging
//     console.log('Add Item Response:', responseData);
    
//     if (responseData.success) {
//       setCartItems([...cartItems, responseData.item]);
//     } else {
//       // More detailed error logging
//       console.error("Failed to add item:", {
//         message: responseData.message,
//         error: responseData.error
//       });
      
//       // Optionally, show an error message to the user
//       alert(`Failed to add item: ${responseData.message}`);
//     }
//   } catch (error) {
//     console.error("Network or parsing error adding item:", error);
//     alert('Failed to add item. Please check your connection.');
//   }
// };
//   // Update item in backend
//   const updateItem = async (index, key, value) => {
//     const updatedCart = [...cartItems];
//     updatedCart[index] = { ...updatedCart[index], [key]: value };

//     try {
//       const response = await fetch(`${API_BASE_URL}/${updatedCart[index]._id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(updatedCart[index]),
//       });
      
//       const responseData = await response.json();
      
//       if (responseData.success) {
//         setCartItems(updatedCart);
//       } else {
//         console.error("Failed to update item:", responseData);
//       }
//     } catch (error) {
//       console.error("Error updating item:", error);
//     }
//   };

//   // Delete item from backend
//   const removeItem = async (index) => {
//     const itemToRemove = cartItems[index];

//     try {
//       const response = await fetch(`${API_BASE_URL}/${itemToRemove._id}`, {
//         method: "DELETE",
//       });
      
//       const responseData = await response.json();
      
//       if (responseData.success) {
//         const updatedCart = cartItems.filter((_, i) => i !== index);
//         setCartItems(updatedCart);
//       } else {
//         console.error("Failed to delete item:", responseData);
//       }
//     } catch (error) {
//       console.error("Error deleting item:", error);
//     }
//   };

//   // Calculate total cost
//   const calculateTotalCost = () => {
//     const cost = cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
//     setTotalCost(cost);
//   };

//   return (
//     <Box
//       sx={{
//         p: 2,
//         bgcolor: "#f4f4f4",
//         minHeight: "100vh",
//         display: "flex",
//         flexDirection: "column",
//       }}
//     >
//       {/* Header */}
//       <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//         <Button
//           startIcon={<ArrowBackIcon sx={{ color: "white" }} />}
//           sx={{
//             backgroundColor: "#2a1581",
//             "&:hover": { backgroundColor: "#43018f" },
//             fontWeight: "bold",
//             color: "white",
//           }}
//           onClick={() => window.history.back()}
//         >
//           Back
//         </Button>
//         <Typography variant="h4" sx={{ flex: 1, textAlign: "center", fontWeight: "bold", color: "#2a1581" }}>
//           Cart Companion
//         </Typography>
//       </Box>

//       {/* Cart List */}
//       <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
//         {cartItems.map((item, index) => (
//           <Box
//             key={index}
//             sx={{
//               p: 2,
//               mb: 2,
//               borderRadius: 2,
//               boxShadow: 1,
//             }}
//           >
//             <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//               <TextField
//                 label="Item Name"
//                 variant="outlined"
//                 size="small"
//                 value={item.name || ""}
//                 onChange={(e) => updateItem(index, "name", e.target.value)}
//                 sx={{ flex: 1, mr: 1 }}
//               />
//               <Select
//                 value={item.category || "Others"}
//                 onChange={(e) => updateItem(index, "category", e.target.value)}
//                 size="small"
//                 sx={{ minWidth: 120, mr: 1 }}
//               >
//                 {categories.map((category, i) => (
//                   <MenuItem key={i} value={category}>
//                     {category}
//                   </MenuItem>
//                 ))}
//               </Select>
//               <TextField
//                 label="Price"
//                 variant="outlined"
//                 size="small"
//                 type="number"
//                 value={item.price || 0}
//                 onChange={(e) => updateItem(index, "price", parseFloat(e.target.value) || 0)}
//                 sx={{ width: 100, mr: 1 }}
//               />
//               <Box>
//                 <IconButton onClick={() => updateItem(index, "quantity", Math.max(item.quantity - 1, 1))}>
//                   <RemoveIcon />
//                 </IconButton>
//                 <Badge badgeContent={item.quantity || 1} color="primary" />
//                 <IconButton onClick={() => updateItem(index, "quantity", (item.quantity || 1) + 1)}>
//                   <AddIcon />
//                 </IconButton>
//               </Box>
//               <Chip
//                 label={item.priority === "urgent" ? "Urgent" : "Low Priority"}
//                 color={item.priority === "urgent" ? "error" : "default"}
//                 onClick={() => updateItem(index, "priority", item.priority === "urgent" ? "low" : "urgent")}
//                 sx={{ mx: 1 }}
//               />
//               <IconButton onClick={() => removeItem(index)}>
//                 <DeleteIcon color="error" />
//               </IconButton>
//             </Box>
//           </Box>
//         ))}
//       </Box>

//       <Divider sx={{ my: 2 }} />

//       {/* Add New Item and Budget Tracking */}
//       <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//         <Button
//           variant="contained"
//           onClick={addItem}
//           sx={{
//             bgcolor: "#2a1581",
//             "&:hover": { bgcolor: "#43018f" },
//           }}
//         >
//           Add Item
//         </Button>
//         <Typography variant="h6" sx={{ fontWeight: "bold", color: "#2a1581" }}>
//           Total Cost: ₹{totalCost}
//         </Typography>
//         <Button
//           variant="contained"
//           onClick={calculateTotalCost}
//           sx={{
//             bgcolor: "#2a1581",
//             "&:hover": { bgcolor: "#43018f" },
//           }}
//         >
//           Calculate
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// export default CartCompanion;
