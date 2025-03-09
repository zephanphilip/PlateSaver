


// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Card,
//   CardContent,
//   Grid,
//   IconButton,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
//   MenuItem,
// } from "@mui/material";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import AddIcon from "@mui/icons-material/Add";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
// import { useUser } from '@clerk/clerk-react';
// import General from "../constants/General";

// const PantryPro = () => {
//     const { user, isLoaded } = useUser();
//   const [editItem, setEditItem] = useState(null); // Tracks the item being edited

//   const [inventory, setInventory] = useState([]);
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [newItem, setNewItem] = useState({
//     name: "",
//     quantity: "",
//     category: "",
//     expires: "",
//     status: "fresh",
//   });

//   const categories = [
//     "Fruits & Vegetables",
//     "Dairy & Eggs",
//     "Grains & Cereals",
//     "Meat & Fish",
//     "Packaged Foods",
//     "Beverages",
//     "Condiments & Spices",
//      "Others"
//   ];
//    // Function to determine item status based on expiry date
//    const determineItemStatus = (expiryDate) => {
//     if (!expiryDate) return "fresh";

//     const today = new Date();
//     const expiry = new Date(expiryDate);
//     const threeDaysFromNow = new Date();
//     threeDaysFromNow.setDate(today.getDate() + 3);

//     if (expiry < today) {
//       return "expired";
//     } else if (expiry <= threeDaysFromNow) {
//       return "warning";
//     } else {
//       return "fresh";
//     }
//   };

 
//   const handleEditClick = (item) => {
//     setEditItem(item);
//     setShowAddForm(true); // Reuse the add form for editing
//     setNewItem(item);     // Prefill the form with existing item details
//   };
  
//   const handleAddItem = async () => {
//     if (newItem.name && newItem.quantity && newItem.category && newItem.expires) {
//        // Determine status directly here
//        const status = determineItemStatus(newItem.expires);
//       const payload = {
//         ...newItem,
//         status,
//         userId: user.id, // Include user ID
//       };
//       console.log(editItem);
//       console.log(payload);
//       if (editItem) {
//         // Update existing item
//         try {
//           const response = await fetch(`${General.API_BASE_URL}api/items/${editItem._id}`, {
//             method: "PUT",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify(payload),
//           });
//           if (response.ok) {
//             const data = await response.json();
//             setInventory((prev) =>
//               prev.map((item) => (item._id === data.item._id ? data.item : item))
//             );
//           }
//         } catch (error) {
//           console.error("Error updating item:", error);
//         }
//       } else {
//         // Add new item
//         try {
//           const response = await fetch(`${General.API_BASE_URL}api/items/`, {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify(payload),
//           });
//           if (response.ok) {
//             const data = await response.json();
//             setInventory((prev) => [...prev, data.item]);
//           }
//         } catch (error) {
//           console.error("Error adding item:", error);
//         }
//       }
  
//       // Reset form
//       setNewItem({
//         name: "",
//         quantity: "",
//         category: "",
//         expires: "",
//         status: "fresh",
//       });
//       setEditItem(null);
//       setShowAddForm(false);
//     }
//   };
//   const handleDeleteItem = async (id) => {
//     try {
//       const response = await fetch(`${General.API_BASE_URL}api/items/${id}?userId=${user.id}`, {
//         method: "DELETE",
//       });
//       if (response.ok) {
//         setInventory((prev) => prev.filter((item) => item._id !== id));
//       } else {
//         console.error("Failed to delete item:", response.statusText);
//       }
//     } catch (error) {
//       console.error("Error deleting item:", error);
//     }
//   };
  
//     useEffect(() => {
//       const fetchItems = async () => {
//         try {
//           const response = await fetch(`${General.API_BASE_URL}api/items?userId=${user.id}`);
//           if (response.ok) {
//             const data = await response.json();
//             const updatedInventory = data.map(item => ({
//               ...item,
//               status: determineItemStatus(item.expires)}));

//               setInventory(updatedInventory);
//           }
//         } catch (error) {
//           console.error("Error fetching items:", error);
//         }
//       };
      
//     fetchItems();
//   }, [user]);


//   const getStatusColor = (status) => {
//     switch (status) {
//       case "fresh":
//         return "#4CAF50";
//       case "warning":
//         return "#FFA726";
//       case "expired":
//         return "#FF6B6B";
//       default:
//         return "#gray";
//     }
//   };

//   return (
//     <Box
//       sx={{
//         bgcolor: "#FFE5E5",
//         minHeight: "100vh",
//         px: { xs: 1, sm: 2, md: 3 },
//         py: 3,
//       }}
//     >
//       {/* Header Section */}
//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: { xs: "column", sm: "row" },
//           justifyContent: "space-between",
//           alignItems: "center",
//           gap: 2,
//           mb: 4,
//           textAlign: "center",
//         }}
//       >
//         <Button
//           startIcon={<ArrowBackIcon />}
//           sx={{
//             backgroundColor: "#FF6B6B",
//             "&:hover": { backgroundColor: "#ff8585" },
//             color: "white",
//             width: { xs: "100%", sm: "auto" },
//           }}
//           onClick={() => window.history.back()}
//         >
//           Back
//         </Button>
//         <Typography 
//           variant="h3" 
//           fontWeight="bold"
//           sx={{
//             color: "#FF6B6B",
//             fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" }
//           }}
//         >
//           Pantry Pro
//         </Typography>
//         <Button
//           startIcon={<AddIcon />}
//           variant="contained"
//           sx={{
//             backgroundColor: "#FF6B6B",
//             "&:hover": { backgroundColor: "#ff8585" },
//             width: { xs: "100%", sm: "auto" },
//           }}
//           onClick={() => setShowAddForm((prev) => !prev)}
//         >
//           {showAddForm ? "Cancel" : "Add Item"}
//         </Button>
//       </Box>

//       {/* Add Item Form */}
//       {showAddForm && (
//         <Box
//           sx={{
//             p: { xs: 2, sm: 3 },
//             mb: 3,
//             bgcolor: "white",
//             borderRadius: 4,
//             boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
//             transition: "transform 0.2s",
//             "&:hover": {
//               transform: "translateY(-2px)",
//             },
//           }}
//         >
//           <Typography variant="h5" fontWeight="bold" mb={3} color="#FF6B6B">
//             {editItem ? "Edit Item" : "Add New Item"}
//           </Typography>
//           <Grid container spacing={3}>
//             <Grid item xs={12} md={6}>
//               <TextField
//                 fullWidth
//                 label="Name"
//                 variant="outlined"
//                 value={newItem.name}
//                 onChange={(e) => setNewItem((prev) => ({ ...prev, name: e.target.value }))}
//                 sx={{
//                   '& .MuiOutlinedInput-root': {
//                     '&:hover fieldset': {
//                       borderColor: '#FF6B6B',
//                     },
//                     '&.Mui-focused fieldset': {
//                       borderColor: '#FF6B6B',
//                     },
//                   },
//                 }}
//               />
//             </Grid>
//             {/* Replace the comment in the previous code with these form fields */}
// <Grid item xs={12} md={6}>
//   <TextField
//     fullWidth
//     label="Quantity"
  
//     variant="outlined"
//     value={newItem.quantity}
//     onChange={(e) => setNewItem((prev) => ({ ...prev, quantity: e.target.value }))}
//     sx={{
//       '& .MuiOutlinedInput-root': {
//         '&:hover fieldset': {
//           borderColor: '#FF6B6B',
//         },
//         '&.Mui-focused fieldset': {
//           borderColor: '#FF6B6B',
//         },
//       },
//     }}
//   />
// </Grid>
// <Grid item xs={12} md={6}>
//   <TextField
//     fullWidth
//     select
//     label="Category"
//     variant="outlined"
//     value={newItem.category}
//     onChange={(e) => setNewItem((prev) => ({ ...prev, category: e.target.value }))}
//     sx={{
//       '& .MuiOutlinedInput-root': {
//         '&:hover fieldset': {
//           borderColor: '#FF6B6B',
//         },
//         '&.Mui-focused fieldset': {
//           borderColor: '#FF6B6B',
//         },
//       },
//     }}
//   >
//     {categories.map((category, index) => (
//       <MenuItem 
//         key={index} 
//         value={category}
//         sx={{
//           '&:hover': {
//             backgroundColor: '#FFE5E5',
//           },
//           '&.Mui-selected': {
//             backgroundColor: '#FFE5E5',
//             '&:hover': {
//               backgroundColor: '#FFE5E5',
//             },
//           },
//         }}
//       >
//         {category}
//       </MenuItem>
//     ))}
//   </TextField>
// </Grid>
// <Grid item xs={12} md={6}>
//   <TextField
//     fullWidth
//     label="Expiry Date"
//     type="date"
//     variant="outlined"
//     InputLabelProps={{
//       shrink: true,
//     }}
//     value={newItem.expires}
//     onChange={(e) => setNewItem((prev) => ({ ...prev, expires: e.target.value }))}
//     sx={{
//       '& .MuiOutlinedInput-root': {
//         '&:hover fieldset': {
//           borderColor: '#FF6B6B',
//         },
//         '&.Mui-focused fieldset': {
//           borderColor: '#FF6B6B',
//         },
//       },
//     }}
//   />
// </Grid>
//           </Grid>
//           <Box mt={3} display="flex" justifyContent="flex-end">
//             <Button
//               variant="contained"
//               sx={{
//                 backgroundColor: "#FF6B6B",
//                 "&:hover": { backgroundColor: "#ff8585" },
//                 px: 4,
//                 py: 1.5,
//                 borderRadius: 2,
//               }}
//               onClick={handleAddItem}
//             >
//               {editItem ? "Update Item" : "Save Item"}
//             </Button>
//           </Box>
//         </Box>
//       )}

//       {/* Inventory Categories */}
//       <Grid container spacing={2}>
//         {categories.map((category) => (
//           <Grid item xs={12} key={category}>
//             <Accordion 
//               defaultExpanded
//               sx={{
//                 backgroundColor: 'transparent',
//                 '&:before': {
//                   display: 'none',
//                 },
//               }}
//             >
//               <AccordionSummary
//                 expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
//                 sx={{
//                   bgcolor: "#FF6B6B",
//                   color: "white",
//                   borderRadius: "8px",
//                   '&:hover': {
//                     bgcolor: "#ff8585",
//                   },
//                   transition: 'all 0.2s',
//                 }}
//               >
//                 <Typography variant="h6" fontWeight="bold">
//                   {category}
//                 </Typography>
//               </AccordionSummary>
//               <AccordionDetails>
//                 <Grid container spacing={3}>
//                   {inventory
//                     .filter((item) => item.category === category)
//                     .map((item, index) => (
//                       <Grid item xs={12} sm={6} md={4} key={index}>
//                         <Card
//                           sx={{
//                             borderRadius: 4,
//                             boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
//                             position: "relative",
//                             border: `3px solid ${getStatusColor(item.status)}`,
//                             transition: 'transform 0.2s',
//                             '&:hover': {
//                               transform: 'translateY(-4px)',
//                               boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
//                             },
//                             backgroundColor: 'white',
//                           }}
//                         >
//                           <CardContent>
//                             <Typography variant="h6" fontWeight="bold" color="#FF6B6B">
//                               {item.name}
//                             </Typography>
//                             <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
//                               Quantity: {item.quantity}
//                             </Typography>
//                             <Typography variant="body2" sx={{fontWeight:'bold'}} color="text.secondary">
//                               {item.status === "expired" ? "Expired!" : `Expiry Date: ${new Date(item.expires).toLocaleDateString('en-GB')}`}
//                             </Typography>
//                             <Box
//                               sx={{
//                                 display: "flex",
//                                 justifyContent: "space-between",
//                                 mt: 2,
//                                 pt: 2,
//                                 borderTop: '1px solid #eee',
//                               }}
//                             >
//                               <IconButton 
//                                 sx={{ 
//                                   color: "#FF6B6B",
//                                   '&:hover': { backgroundColor: '#FFE5E5' }
//                                 }}
//                                 onClick={() => handleEditClick(item)}
//                               >
//                                 <EditIcon />
//                               </IconButton>
//                               <IconButton 
//                                 sx={{ 
//                                   color: "#FF6B6B",
//                                   '&:hover': { backgroundColor: '#FFE5E5' }
//                                 }}
//                                 onClick={() => handleDeleteItem(item._id)}
//                               >
//                                 <DeleteIcon />
//                               </IconButton>
//                               <IconButton 
//                                 sx={{ 
//                                   color: "#4CAF50",
//                                   '&:hover': { backgroundColor: '#FFE5E5' }
//                                 }}
//                                 onClick={() => handleDeleteItem(item._id)}
//                               >
//                                 <CheckCircleOutlineIcon />
//                               </IconButton>
//                             </Box>
//                           </CardContent>
//                         </Card>
//                       </Grid>
//                     ))}
//                 </Grid>
//               </AccordionDetails>
//             </Accordion>
//           </Grid>
//         ))}
//       </Grid>
//     </Box>
//   );
// };

// export default PantryPro;


import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useUser } from '@clerk/clerk-react';
import General from "../constants/General";

const PantryPro = () => {
  const { user, isLoaded } = useUser();
  const [editItem, setEditItem] = useState(null); // Tracks the item being edited

  const [inventory, setInventory] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: "",
    unit: "kg", // Default unit
    category: "",
    expires: "",
    status: "fresh",
  });

  const categories = [
    "Fruits & Vegetables",
    "Dairy & Eggs",
    "Grains & Cereals",
    "Meat & Fish",
    "Packaged Foods",
    "Beverages",
    "Condiments & Spices",
    "Others"
  ];

  const units = ["kg", "gm", "ltr", "pcs", "box", "packet"];

  // Function to determine item status based on expiry date
  const determineItemStatus = (expiryDate) => {
    if (!expiryDate) return "fresh";

    const today = new Date();
    const expiry = new Date(expiryDate);
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(today.getDate() + 3);

    if (expiry < today) {
      return "expired";
    } else if (expiry <= threeDaysFromNow) {
      return "warning";
    } else {
      return "fresh";
    }
  };

  // Function to format quantity with unit
  const formatQuantityWithUnit = (quantity, unit) => {
    return `${quantity} ${unit}`;
  };

  // Function to parse quantity string back to separate values
  const parseQuantityString = (quantityString) => {
    if (!quantityString) return { quantity: "", unit: "kg" };
    
    const parts = quantityString.trim().split(" ");
    if (parts.length >= 2) {
      return {
        quantity: parts[0],
        unit: parts[1]
      };
    }
    return { quantity: parts[0], unit: "kg" };
  };

  const handleEditClick = (item) => {
    // Parse the quantity string when editing an item
    const { quantity, unit } = parseQuantityString(item.quantity);
    
    setEditItem(item);
    setShowAddForm(true); // Reuse the add form for editing
    setNewItem({
      ...item,
      quantity: quantity,
      unit: unit
    });
  };
  
  const handleAddItem = async () => {
    if (newItem.name && newItem.quantity && newItem.category && newItem.expires) {
      // Combine quantity and unit into a single string
      const combinedQuantity = formatQuantityWithUnit(newItem.quantity, newItem.unit);
      
      // Determine status directly here
      const status = determineItemStatus(newItem.expires);
      
      const payload = {
        ...newItem,
        quantity: combinedQuantity, // Send the combined string
        status,
        userId: user.id,
      };
      
      // Remove the unit field as it's now combined with quantity
      delete payload.unit;
      
      if (editItem) {
        // Update existing item
        try {
          const response = await fetch(`${General.API_BASE_URL}api/items/${editItem._id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });
          if (response.ok) {
            const data = await response.json();
            setInventory((prev) =>
              prev.map((item) => (item._id === data.item._id ? data.item : item))
            );
          }
        } catch (error) {
          console.error("Error updating item:", error);
        }
      } else {
        // Add new item
        try {
          const response = await fetch(`${General.API_BASE_URL}api/items/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });
          if (response.ok) {
            const data = await response.json();
            setInventory((prev) => [...prev, data.item]);
          }
        } catch (error) {
          console.error("Error adding item:", error);
        }
      }
  
      // Reset form
      setNewItem({
        name: "",
        quantity: "",
        unit: "kg",
        category: "",
        expires: "",
        status: "fresh",
      });
      setEditItem(null);
      setShowAddForm(false);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      const response = await fetch(`${General.API_BASE_URL}api/items/${id}?userId=${user.id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setInventory((prev) => prev.filter((item) => item._id !== id));
      } else {
        console.error("Failed to delete item:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };
  
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`${General.API_BASE_URL}api/items?userId=${user.id}`);
        if (response.ok) {
          const data = await response.json();
          const updatedInventory = data.map(item => ({
            ...item,
            status: determineItemStatus(item.expires)
          }));

          setInventory(updatedInventory);
        }
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };
      
    if (isLoaded && user) {
      fetchItems();
    }
  }, [user, isLoaded]);

  const getStatusColor = (status) => {
    switch (status) {
      case "fresh":
        return "#4CAF50";
      case "warning":
        return "#FFA726";
      case "expired":
        return "#FF6B6B";
      default:
        return "#gray";
    }
  };

  return (
    <Box
      sx={{
        bgcolor: "#FFE5E5",
        minHeight: "100vh",
        px: { xs: 1, sm: 2, md: 3 },
        py: 3,
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          mb: 4,
          textAlign: "center",
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          sx={{
            backgroundColor: "#FF6B6B",
            "&:hover": { backgroundColor: "#ff8585" },
            color: "white",
            width: { xs: "100%", sm: "auto" },
          }}
          onClick={() => window.history.back()}
        >
          Back
        </Button>
        <Typography 
          variant="h3" 
          fontWeight="bold"
          sx={{
            color: "#FF6B6B",
            fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" }
          }}
        >
          Pantry Pro
        </Typography>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          sx={{
            backgroundColor: "#FF6B6B",
            "&:hover": { backgroundColor: "#ff8585" },
            width: { xs: "100%", sm: "auto" },
          }}
          onClick={() => setShowAddForm((prev) => !prev)}
        >
          {showAddForm ? "Cancel" : "Add Item"}
        </Button>
      </Box>

      {/* Add Item Form */}
      {showAddForm && (
        <Box
          sx={{
            p: { xs: 2, sm: 3 },
            mb: 3,
            bgcolor: "white",
            borderRadius: 4,
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            transition: "transform 0.2s",
            "&:hover": {
              transform: "translateY(-2px)",
            },
          }}
        >
          <Typography variant="h5" fontWeight="bold" mb={3} color="#FF6B6B">
            {editItem ? "Edit Item" : "Add New Item"}
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Name"
                variant="outlined"
                value={newItem.name}
                onChange={(e) => setNewItem((prev) => ({ ...prev, name: e.target.value }))}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#FF6B6B',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#FF6B6B',
                    },
                  },
                }}
              />
            </Grid>
            {/* Quantity Field with Unit Selection */}
            <Grid item xs={12} md={6}>
              <Grid container spacing={2}>
                <Grid item xs={7}>
                  <TextField
                    fullWidth
                    label="Quantity"
                    variant="outlined"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem((prev) => ({ ...prev, quantity: e.target.value }))}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: '#FF6B6B',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#FF6B6B',
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={5}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="unit-select-label">Unit</InputLabel>
                    <Select
                      labelId="unit-select-label"
                      id="unit-select"
                      value={newItem.unit}
                      onChange={(e) => setNewItem((prev) => ({ ...prev, unit: e.target.value }))}
                      label="Unit"
                      sx={{
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
                      {units.map((unit) => (
                        <MenuItem 
                          key={unit} 
                          value={unit}
                          sx={{
                            '&:hover': {
                              backgroundColor: '#FFE5E5',
                            },
                            '&.Mui-selected': {
                              backgroundColor: '#FFE5E5',
                              '&:hover': {
                                backgroundColor: '#FFE5E5',
                              },
                            },
                          }}
                        >
                          {unit}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Category"
                variant="outlined"
                value={newItem.category}
                onChange={(e) => setNewItem((prev) => ({ ...prev, category: e.target.value }))}
                sx={{
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
                {categories.map((category, index) => (
                  <MenuItem 
                    key={index} 
                    value={category}
                    sx={{
                      '&:hover': {
                        backgroundColor: '#FFE5E5',
                      },
                      '&.Mui-selected': {
                        backgroundColor: '#FFE5E5',
                        '&:hover': {
                          backgroundColor: '#FFE5E5',
                        },
                      },
                    }}
                  >
                    {category}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Expiry Date"
                type="date"
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                value={newItem.expires}
                onChange={(e) => setNewItem((prev) => ({ ...prev, expires: e.target.value }))}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#FF6B6B',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#FF6B6B',
                    },
                  },
                }}
              />
            </Grid>
          </Grid>
          <Box mt={3} display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#FF6B6B",
                "&:hover": { backgroundColor: "#ff8585" },
                px: 4,
                py: 1.5,
                borderRadius: 2,
              }}
              onClick={handleAddItem}
            >
              {editItem ? "Update Item" : "Save Item"}
            </Button>
          </Box>
        </Box>
      )}

      {/* Inventory Categories */}
      <Grid container spacing={2}>
        {categories.map((category) => (
          <Grid item xs={12} key={category}>
            <Accordion 
              defaultExpanded
              sx={{
                backgroundColor: 'transparent',
                '&:before': {
                  display: 'none',
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
                sx={{
                  bgcolor: "#FF6B6B",
                  color: "white",
                  borderRadius: "8px",
                  '&:hover': {
                    bgcolor: "#ff8585",
                  },
                  transition: 'all 0.2s',
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  {category}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  {inventory
                    .filter((item) => item.category === category)
                    .map((item, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card
                          sx={{
                            borderRadius: 4,
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                            position: "relative",
                            border: `3px solid ${getStatusColor(item.status)}`,
                            transition: 'transform 0.2s',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
                            },
                            backgroundColor: 'white',
                          }}
                        >
                          <CardContent>
                            <Typography variant="h6" fontWeight="bold" color="#FF6B6B">
                              {item.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                              Quantity: {item.quantity}
                            </Typography>
                            <Typography variant="body2" sx={{fontWeight:'bold'}} color="text.secondary">
                              {item.status === "expired" ? "Expired!" : `Expiry Date: ${new Date(item.expires).toLocaleDateString('en-GB')}`}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mt: 2,
                                pt: 2,
                                borderTop: '1px solid #eee',
                              }}
                            >
                              <IconButton 
                                sx={{ 
                                  color: "#FF6B6B",
                                  '&:hover': { backgroundColor: '#FFE5E5' }
                                }}
                                onClick={() => handleEditClick(item)}
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton 
                                sx={{ 
                                  color: "#FF6B6B",
                                  '&:hover': { backgroundColor: '#FFE5E5' }
                                }}
                                onClick={() => handleDeleteItem(item._id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                              <IconButton 
                                sx={{ 
                                  color: "#4CAF50",
                                  '&:hover': { backgroundColor: '#FFE5E5' }
                                }}
                                onClick={() => handleDeleteItem(item._id)}
                              >
                                <CheckCircleOutlineIcon />
                              </IconButton>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PantryPro;