import React from "react";
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
  Chip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const PantryPro = () => {
  const inventory = [
  { name: "Milk", quantity: "1L", category: "Dairy & Eggs", expires: "2024-12-10", status: "fresh" },
  { name: "Carrots", quantity: "2kg", category: "Fruits & Vegetables", expires: "2024-12-06", status: "warning" },
  { name: "Bread", quantity: "1 loaf", category: "Grains & Cereals", expires: "2024-12-01", status: "expired" },
  { name: "Chicken", quantity: "1kg", category: "Meat & Fish", expires: "2024-12-05", status: "fresh" },
  { name: "Apples", quantity: "6 pcs", category: "Fruits & Vegetables", expires: "2024-12-15", status: "fresh" },
  { name: "Cheese", quantity: "500g", category: "Dairy & Eggs", expires: "2024-12-18", status: "fresh" },
  { name: "Rice", quantity: "5kg", category: "Grains & Cereals", expires: "2025-01-15", status: "fresh" },
  { name: "Fish", quantity: "2kg", category: "Meat & Fish", expires: "2024-12-07", status: "warning" },
  { name: "Potatoes", quantity: "3kg", category: "Fruits & Vegetables", expires: "2024-12-11", status: "fresh" },
  { name: "Eggs", quantity: "12 pcs", category: "Dairy & Eggs", expires: "2024-12-05", status: "expired" },
  { name: "Cereal", quantity: "750g", category: "Grains & Cereals", expires: "2024-12-25", status: "fresh" },
  { name: "Yogurt", quantity: "1kg", category: "Dairy & Eggs", expires: "2024-12-08", status: "warning" },
  { name: "Tomatoes", quantity: "1.5kg", category: "Fruits & Vegetables", expires: "2024-12-04", status: "expired" },
  { name: "Beef", quantity: "1kg", category: "Meat & Fish", expires: "2024-12-12", status: "fresh" },
  { name: "Butter", quantity: "250g", category: "Dairy & Eggs", expires: "2024-12-14", status: "fresh" },
  { name: "Pasta", quantity: "500g", category: "Grains & Cereals", expires: "2025-02-20", status: "fresh" },
  { name: "Canned Beans", quantity: "3 cans", category: "Packaged Foods", expires: "2025-05-01", status: "fresh" },
  { name: "Salt", quantity: "1kg", category: "Condiments & Spices", expires: "2026-12-31", status: "fresh" },
  { name: "Pepper", quantity: "200g", category: "Condiments & Spices", expires: "2025-08-10", status: "fresh" },
  { name: "Chocolate", quantity: "2 bars", category: "Packaged Foods", expires: "2024-12-20", status: "fresh" },
  { name: "Garlic", quantity: "1kg", category: "Fruits & Vegetables", expires: "2024-12-13", status: "fresh" },
  { name: "Onions", quantity: "2kg", category: "Fruits & Vegetables", expires: "2024-12-08", status: "warning" },
  { name: "Ice Cream", quantity: "2 tubs", category: "Dairy & Eggs", expires: "2024-12-28", status: "fresh" },
  { name: "Bananas", quantity: "1 dozen", category: "Fruits & Vegetables", expires: "2024-12-03", status: "expired" },
  { name: "Honey", quantity: "1 bottle", category: "Condiments & Spices", expires: "2026-05-10", status: "fresh" },
  { name: "Bacon", quantity: "500g", category: "Meat & Fish", expires: "2024-12-09", status: "warning" },
];


  const categories = [
    "Fruits & Vegetables",
    "Dairy & Eggs",
    "Grains & Cereals",
    "Meat & Fish",
    "Packaged Foods",
    "Condiments & Spices",
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "fresh":
        return "green";
      case "warning":
        return "yellow";
      case "expired":
        return "red";
      default:
        return "gray";
    }
  };

  return (
    <Box
      sx={{
        bgcolor: "#f4f4f4",
        minHeight: "100vh",
        px: 2,
        py: 3,
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Button
          startIcon={<ArrowBackIcon sx={{ color: "white" }} />}
          sx={{
            backgroundColor: "#2a1581",
            "&:hover": { backgroundColor: "#43018f" },
            color: "white",
          }}
          onClick={() => window.history.back()}
        >
          Back
        </Button>
        <Typography variant="h3" fontWeight="bold">
          Pantry Pro
        </Typography>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          sx={{
            backgroundColor: "#2a1581",
            "&:hover": { backgroundColor: "#43018f" },
          }}
        >
          Add Item
        </Button>
      </Box>

      {/* Search & Filter Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          gap: 2,
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search inventory..."
          sx={{ bgcolor: "white", borderRadius: 2 }}
        />
        <Button variant="outlined">Filter</Button>
      </Box>

      {/* Inventory Categories */}
      {categories.map((category) => (
        <Accordion key={category} defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              bgcolor: "#2a1581",
              color: "white",
              borderRadius: "4px",
              "&:hover": { bgcolor: "#43018f" },
            }}
          >
            <Typography variant="h6" fontWeight="bold" sx={{color:"#fff"}}>
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
                        boxShadow: 3,
                        position: "relative",
                        border: `4px solid ${getStatusColor(item.status)}`,
                      }}
                    >
                      <CardContent>
                        <Typography variant="h6" fontWeight="bold">
                          {item.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
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
                          }}
                        >
                          <IconButton color="primary">
                            <EditIcon />
                          </IconButton>
                          <IconButton color="error">
                            <DeleteIcon />
                          </IconButton>
                          <IconButton color="success">
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
      ))}

      {/* Expired Items Section */}
      <Box
        sx={{
          mt: 4,
          p: 2,
          border: "2px solid red",
          borderRadius: 4,
          bgcolor: "#ffe5e5",
        }}
      >
        <Typography variant="h5" color="error" fontWeight="bold">
          Expired Items
        </Typography>
        {inventory.filter((item) => item.status === "expired").length === 0 ? (
          <Typography>No expired items.</Typography>
        ) : (
          inventory
            .filter((item) => item.status === "expired")
            .map((item, index) => (
              <Chip
                key={index}
                label={`${item.name} (${item.quantity})`}
                color="error"
                sx={{ m: 1 }}
              />
            ))
        )}
      </Box>
    </Box>
  );
};

export default PantryPro;
