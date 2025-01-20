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
//   Chip,
//   MenuItem,
// } from "@mui/material";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import AddIcon from "@mui/icons-material/Add";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
// import {useUser} from '@clerk/clerk-react' 

// const PantryPro = () => {
//   const { user, isLoaded } = useUser();
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
//     "Condiments & Spices",
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

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "fresh":
//         return "green";
//       case "warning":
//         return "yellow";
//       case "expired":
//         return "red";
//       default:
//         return "gray";
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
//           const response = await fetch(`http://localhost:3001/api/items/${editItem._id}`, {
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
//           const response = await fetch("http://localhost:3001/api/items/", {
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
//       const response = await fetch(`http://localhost:3001/api/items/${id}?userId=${user.id}`, {
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
//           const response = await fetch(`http://localhost:3001/api/items?userId=${user.id}`);
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

//   return (
//     <Box
//       sx={{
//         bgcolor: "#f4f4f4",
//         minHeight: "100vh",
//         px: 2,
//         py: 3,
//       }}
//     >
//       {/* Header Section */}
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           mb: 3,
//         }}
//       >
//         <Button
//           startIcon={<ArrowBackIcon sx={{ color: "white" }} />}
//           sx={{
//             backgroundColor: "#2a1581",
//             "&:hover": { backgroundColor: "#43018f" },
//             color: "white",
//           }}
//           onClick={() => window.history.back()}
//         >
//           Back
//         </Button>
//         <Typography variant="h3" fontWeight="bold">
//           Pantry Pro
//         </Typography>
//         <Button
//           startIcon={<AddIcon />}
//           variant="contained"
//           sx={{
//             backgroundColor: "#2a1581",
//             "&:hover": { backgroundColor: "#43018f" },
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
//             p: 2,
//             mb: 3,
//             bgcolor: "white",
//             borderRadius: 4,
//             boxShadow: 2,
//           }}
//         >
//           <Typography variant="h5" fontWeight="bold" mb={2}>
//             Add New Item
//           </Typography>
//           <Grid container spacing={2}>
//             <Grid item xs={12} md={6}>
//               <TextField
//                 fullWidth
//                 label="Name"
//                 variant="outlined"
//                 value={newItem.name}
//                 onChange={(e) =>
//                   setNewItem((prev) => ({ ...prev, name: e.target.value }))
//                 }
//               />
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <TextField
//                 fullWidth
//                 label="Quantity"
//                 type="number"
//                 variant="outlined"
//                 value={newItem.quantity}
//                 onChange={(e) =>
//                   setNewItem((prev) => ({ ...prev, quantity: e.target.value }))
//                 }
//               />
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <TextField
//                 fullWidth
//                 select
//                 label="Category"
//                 variant="outlined"
//                 value={newItem.category}
//                 onChange={(e) =>
//                   setNewItem((prev) => ({ ...prev, category: e.target.value }))
//                 }
//               >
//                 {categories.map((category, index) => (
//                   <MenuItem key={index} value={category}>
//                     {category}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <TextField
//                 fullWidth
//                 label="Expiry Date"
//                 type="date"
//                 variant="outlined"
//                 InputLabelProps={{
//                   shrink: true,
//                 }}
//                 value={newItem.expires}
//                 onChange={(e) =>
//                   setNewItem((prev) => ({ ...prev, expires: e.target.value }))
//                 }
//               />
//             </Grid>
//           </Grid>
//           <Box mt={2} display="flex" justifyContent="flex-end">
//             <Button
//               variant="contained"
//               sx={{
//                 backgroundColor: "#2a1581",
//                 "&:hover": { backgroundColor: "#43018f" },
//               }}
//               onClick={handleAddItem}
//             >
//               Save Item
//             </Button>
//           </Box>
//         </Box>
//       )}

//       {/* Inventory Categories */}
//       {categories.map((category) => (
//         <Accordion key={category} defaultExpanded>
//           <AccordionSummary
//             expandIcon={<ExpandMoreIcon />}
//             sx={{
//               bgcolor: "#2a1581",
//               color: "white",
//               borderRadius: "4px",
//               "&:hover": { bgcolor: "#43018f" },
//             }}
//           >
//             <Typography variant="h6" fontWeight="bold" sx={{ color: "#fff" }}>
//               {category}
//             </Typography>
//           </AccordionSummary>
//           <AccordionDetails>
//             <Grid container spacing={3}>
//               {inventory
//                 .filter((item) => item.category === category)
//                 .map((item, index) => (
//                   <Grid item xs={12} sm={6} md={4} key={index}>
//                     <Card
//                       sx={{
//                         borderRadius: 4,
//                         boxShadow: 3,
//                         position: "relative",
//                         border: `4px solid ${getStatusColor(item.status)}`,
//                       }}
//                     >
//                       <CardContent>
//                         <Typography variant="h6" fontWeight="bold">
//                           {item.name}
//                         </Typography>
//                         <Typography variant="body2" color="text.secondary">
//                           Quantity: {item.quantity}
//                         </Typography>
//                         <Typography variant="body2" color="text.secondary">
//                           Expires: {item.expires}
//                         </Typography>
//                         <Box
//                           sx={{
//                             display: "flex",
//                             justifyContent: "space-between",
//                             mt: 2,
//                           }}
//                         >
//                           <IconButton color="primary" onClick={() => handleEditClick(item)}>
//                             <EditIcon />
//                           </IconButton>
//                           <IconButton color="error"  onClick={() => handleDeleteItem(item._id)}>
//                             <DeleteIcon />
//                           </IconButton>
//                           <IconButton color="success"  onClick={() => handleDeleteItem(item._id)}>
//                             <CheckCircleOutlineIcon />
//                           </IconButton>
//                         </Box>
//                       </CardContent>
//                     </Card>
//                   </Grid>
//                 ))}
//             </Grid>
//           </AccordionDetails>
//         </Accordion>
//       ))}
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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useUser } from '@clerk/clerk-react';

const PantryPro = () => {
    const { user, isLoaded } = useUser();
  const [editItem, setEditItem] = useState(null); // Tracks the item being edited

  const [inventory, setInventory] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: "",
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
    "Condiments & Spices",
  ];
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

 
  const handleEditClick = (item) => {
    setEditItem(item);
    setShowAddForm(true); // Reuse the add form for editing
    setNewItem(item);     // Prefill the form with existing item details
  };
  
  const handleAddItem = async () => {
    if (newItem.name && newItem.quantity && newItem.category && newItem.expires) {
       // Determine status directly here
       const status = determineItemStatus(newItem.expires);
      const payload = {
        ...newItem,
        status,
        userId: user.id, // Include user ID
      };
      console.log(editItem);
      console.log(payload);
      if (editItem) {
        // Update existing item
        try {
          const response = await fetch(`http://localhost:3001/api/items/${editItem._id}`, {
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
          const response = await fetch("http://localhost:3001/api/items/", {
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
      const response = await fetch(`http://localhost:3001/api/items/${id}?userId=${user.id}`, {
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
          const response = await fetch(`http://localhost:3001/api/items?userId=${user.id}`);
          if (response.ok) {
            const data = await response.json();
            const updatedInventory = data.map(item => ({
              ...item,
              status: determineItemStatus(item.expires)}));

              setInventory(updatedInventory);
          }
        } catch (error) {
          console.error("Error fetching items:", error);
        }
      };
      
    fetchItems();
  }, [user]);


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
            {/* Replace the comment in the previous code with these form fields */}
<Grid item xs={12} md={6}>
  <TextField
    fullWidth
    label="Quantity"
    type="number"
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
                            border: `2px solid ${getStatusColor(item.status)}`,
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
                            <Typography variant="body2" color="text.secondary">
                              Expires: {item.expires}
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
