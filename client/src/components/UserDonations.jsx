
// import React, { useState, useEffect } from "react";
// import { useUser } from "@clerk/clerk-react";
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   Button,
//   CircularProgress,
//   Divider,
//   Grid,
//   Alert,
// } from "@mui/material";
// import { styled } from "@mui/system";
// import General from "../constants/General";

// const StyledButton = styled(Button)({
//   backgroundColor: "#FF6B6B",
//   color: "white",
//   fontWeight: "bold",
//   textTransform: "none",
//   padding: "8px 16px",
//   borderRadius: "8px",
//   "&:hover": {
//     backgroundColor: "#ff5252",
//     boxShadow: "0 4px 8px rgba(255, 107, 107, 0.2)",
//   },
//   transition: "all 0.3s ease",
// });

// const StyledCard = styled(Card)({
//   backgroundColor: "white",
//   boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
//   borderRadius: "16px",
//   transition: "transform 0.3s ease, box-shadow 0.3s ease",
//   "&:hover": {
//     transform: "translateY(-4px)",
//     boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
//   },
// });

// const StatusChip = styled(Box)(({ status }) => ({
//   display: "inline-block",
//   padding: "4px 12px",
//   borderRadius: "20px",
//   fontSize: "0.875rem",
//   fontWeight: 600,
//   backgroundColor: status === "Accepted" ? "rgba(76, 175, 80, 0.1)" : "rgba(255, 107, 107, 0.1)",
//   color: status === "Accepted" ? "#4CAF50" : "#FF6B6B",
// }));

// const UserDonations = ({ refreshTrigger }) => {
//   const { user, isLoaded } = useUser();
//   const [donations, setDonations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (isLoaded && user) {
//       fetchUserDonations();
//     }
//   }, [isLoaded, user, refreshTrigger]);

//   const fetchUserDonations = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await fetch(`${General.API_BASE_URL}api/donate/${user.id}`);
//       if (!response.ok) throw new Error("Failed to fetch donations.");
//       const data = await response.json();
//       setDonations(data.donations);
//     } catch (err) {
//       setError(err.message || "An error occurred while fetching donations.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const openMap = (latitude, longitude) => {
//     window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, "_blank");
//   };

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" height="70vh">
//         <CircularProgress sx={{ color: "#FF6B6B" }} />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Box display="flex" flexDirection="column" alignItems="center" height="70vh" gap={2} >
//         <Alert 
//           severity="error" 
//           sx={{ 
//             borderRadius: "8px",
//             backgroundColor: "#FFE5E5",
//             color: "#FF6B6B",
//             "& .MuiAlert-icon": { color: "#FF6B6B" }
//           }}
//         >
//           {error}
//         </Alert>
//         <StyledButton onClick={fetchUserDonations}>Try Again</StyledButton>
//       </Box>
//     );
//   }

//   return (
//     <Box 
//       sx={{ 
//         backgroundColor: "white",
//         width: "100%",
//         maxWidth: "2000px",
//         margin: "32px auto",
//         borderRadius: "24px",
//         boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
//         overflow: "hidden"
//       }}
//     >
//       <Box 
//         sx={{ 
//           borderBottom: "2px solid #FFE5E5",
//           py: 3,
//           px: 4,
//           backgroundColor: "white"
//         }}
//       >
//         <Typography 
//           variant="h4" 
//           sx={{
//             color: "#FF6B6B",
//             textAlign: "center",
//             fontWeight: 700,
//             letterSpacing: "-0.5px"
//           }}
//         >
//           My Donations
//         </Typography>
//       </Box>

//       {donations.length === 0 ? (
//         <Box 
//           display="flex" 
//           flexDirection="column" 
//           justifyContent="center" 
//           alignItems="center" 
//           height="50vh"
//           gap={2}
//         >
//           <Typography 
//             color="#666" 
//             variant="h6" 
//             sx={{ fontWeight: 500 }}
//           >
//             You have no active donations.
//           </Typography>
//           <StyledButton onClick={fetchUserDonations}>Refresh</StyledButton>
//         </Box>
//       ) : (
//         <Box sx={{ p: 4 }}>
//           <Grid container spacing={3}>
//             {donations.map((item) => (
//               <Grid item xs={12} sm={6} md={4} key={item._id.toString()}>
//                 <StyledCard>
//                   <CardContent sx={{ p: 3 }}>
//                     <StatusChip status={item.isAccepted ? "Accepted" : "Pending"}>
//                       {item.isAccepted ? "Accepted" : "Pending"}
//                     </StatusChip>

//                     <Typography 
//                       variant="h6" 
//                       sx={{ 
//                         fontWeight: 700,
//                         mt: 2,
//                         color: "#333"
//                       }}
//                     >
//                       {item.foodDetails}
//                     </Typography>

//                     <Divider sx={{ my: 2, backgroundColor: "#FFE5E5" }} />
                    
//                     <Box sx={{ mb: 2 }}>
//                       <Typography variant="body1" sx={{ mb: 1, color: "#666" }}>
//                         Quantity: <strong>{item.quantity}</strong>
//                       </Typography>
//                       <Typography variant="body1" sx={{ mb: 1, color: "#666" }}>
//                         Expiry Date: <strong>{new Date(item.expiryDate).toLocaleDateString()}</strong>
//                       </Typography>
//                       {item.allergyInfo && (
//                         <Typography variant="body1" sx={{ color: "#666" }}>
//                           Allergy Info: <strong>{item.allergyInfo}</strong>
//                         </Typography>
//                       )}
//                     </Box>

//                     <StyledButton 
//                       fullWidth 
//                       onClick={() => openMap(item.location.latitude, item.location.longitude)}
//                     >
//                       View Location
//                     </StyledButton>

//                     {item.isAccepted && item.recipient && (
//                       <Box 
//                         sx={{ 
//                           mt: 3,
//                           p: 2.5,
//                           borderRadius: "12px",
//                           backgroundColor: "#FFE5E5",
//                         }}
//                       >
//                         <Typography 
//                           fontWeight="700" 
//                           sx={{ 
//                             color: "#FF6B6B",
//                             mb: 1
//                           }}
//                         >
//                           Recipient Details
//                         </Typography>
//                         <Divider sx={{ my: 1.5, backgroundColor: "rgba(255, 107, 107, 0.2)" }} />
//                         <Typography variant="body2" sx={{ mb: 0.5, color: "#666" }}>
//                           Name: <strong>{item.recipient.name || "N/A"}</strong>
//                         </Typography>
//                         <Typography variant="body2" sx={{ mb: 0.5, color: "#666" }}>
//                           Phone: <strong>{item.recipient.phoneNumber || "N/A"}</strong>
//                         </Typography>
//                         <Typography variant="body2" sx={{ color: "#666" }}>
//                           Accepted: <strong>
//                             {item.recipient.acceptedAt ? 
//                               new Date(item.recipient.acceptedAt).toLocaleDateString() : 
//                               "N/A"}
//                           </strong>
//                         </Typography>
//                       </Box>
//                     )}
//                   </CardContent>
//                 </StyledCard>
//               </Grid>
//             ))}
//           </Grid>
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default UserDonations;

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from "@mui/material";
import { styled } from "@mui/system";
import { ChevronDown } from "lucide-react";
import General from "../constants/General";

const StyledButton = styled(Button)({
  backgroundColor: "#FF6B6B",
  color: "white",
  fontWeight: "bold",
  textTransform: "none",
  padding: "8px 16px",
  borderRadius: "8px",
  "&:hover": {
    backgroundColor: "#ff5252",
    boxShadow: "0 4px 8px rgba(255, 107, 107, 0.2)",
  },
  transition: "all 0.3s ease",
});

const StyledCard = styled(Card)({
  backgroundColor: "white",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  borderRadius: "16px",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
  },
});

const StatusChip = styled(Box)(({ status }) => ({
  display: "inline-block",
  padding: "4px 12px",
  borderRadius: "20px",
  fontSize: "0.875rem",
  fontWeight: 600,
  backgroundColor: status === "Accepted" ? "rgba(76, 175, 80, 0.1)" : "rgba(255, 107, 107, 0.1)",
  color: status === "Accepted" ? "#4CAF50" : "#FF6B6B",
}));

const QuantityDisplay = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  marginBottom: "12px",
});

const UserDonations = ({ refreshTrigger }) => {
  const { user, isLoaded } = useUser();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isLoaded && user) {
      fetchUserDonations();
    }
  }, [isLoaded, user, refreshTrigger]);

  const fetchUserDonations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${General.API_BASE_URL}api/donate/${user.id}`);
      if (!response.ok) throw new Error("Failed to fetch donations.");
      const data = await response.json();
      setDonations(data.donations);
    } catch (err) {
      setError(err.message || "An error occurred while fetching donations.");
    } finally {
      setLoading(false);
    }
  };

  const openMap = (latitude, longitude) => {
    window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, "_blank");
  };

  const getStatusText = (donation) => {
    if (!donation.isAccepted) return "Pending";
    if (donation.remainingQuantity > 0) return "Partially Accepted";
    return "Fully Accepted";
  };

  const getStatusColor = (donation) => {
    if (!donation.isAccepted) return "#FF6B6B";
    if (donation.remainingQuantity > 0) return "#FFA726"; // Orange for partial
    return "#4CAF50"; // Green for full
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="70vh">
        <CircularProgress sx={{ color: "#FF6B6B" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" height="70vh" gap={2} >
        <Alert 
          severity="error" 
          sx={{ 
            borderRadius: "8px",
            backgroundColor: "#FFE5E5",
            color: "#FF6B6B",
            "& .MuiAlert-icon": { color: "#FF6B6B" }
          }}
        >
          {error}
        </Alert>
        <StyledButton onClick={fetchUserDonations}>Try Again</StyledButton>
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        backgroundColor: "white",
        width: "100%",
        maxWidth: "2000px",
        margin: "32px auto",
        borderRadius: "24px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        overflow: "hidden"
      }}
    >
      <Box 
        sx={{ 
          borderBottom: "2px solid #FFE5E5",
          py: 3,
          px: 4,
          backgroundColor: "white"
        }}
      >
        <Typography 
          variant="h4" 
          sx={{
            color: "#FF6B6B",
            textAlign: "center",
            fontWeight: 700,
            letterSpacing: "-0.5px"
          }}
        >
          My Donations
        </Typography>
      </Box>

      {donations.length === 0 ? (
        <Box 
          display="flex" 
          flexDirection="column" 
          justifyContent="center" 
          alignItems="center" 
          height="50vh"
          gap={2}
        >
          <Typography 
            color="#666" 
            variant="h6" 
            sx={{ fontWeight: 500 }}
          >
            You have no active donations.
          </Typography>
          <StyledButton onClick={fetchUserDonations}>Refresh</StyledButton>
        </Box>
      ) : (
        <Box sx={{ p: 4 }}>
          <Grid container spacing={3}>
            {donations.map((item) => {
              // Safely handle missing fields
              const status = getStatusText(item);
              const statusColor = getStatusColor(item);
              
              // Check if we have recipients array data
              const hasRecipientsArray = Array.isArray(item.recipients) && item.recipients.length > 0;
              
              // Check if we have legacy recipient data
              const hasLegacyRecipient = item.recipient && item.recipient.userId;
              
              // Combine recipients from both sources to ensure we catch all data
              let allRecipients = [];
              if (hasRecipientsArray) {
                allRecipients = [...item.recipients];
              }
              
              // Add legacy recipient to the list if it's not already included
              if (hasLegacyRecipient) {
                // Check if this recipient is already in the array (by userId)
                const isDuplicate = allRecipients.some(r => r.userId === item.recipient.userId);
                if (!isDuplicate) {
                  allRecipients.push(item.recipient);
                }
              }
              
              const hasMultipleRecipients = allRecipients.length > 0;
              const totalAccepted = allRecipients.reduce((sum, r) => sum + (r.requestedQuantity || 1), 0);
              
              return (
                <Grid item xs={12} sm={6} md={4} key={item._id.toString()}>
                  <StyledCard>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <StatusChip status={status} sx={{ backgroundColor: `${statusColor}20`, color: statusColor }}>
                          {status}
                        </StatusChip>
                       
                      </Box>

                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 700,
                          mt: 2,
                          color: "#333"
                        }}
                      >
                        {item.foodDetails}
                      </Typography>

                      <Divider sx={{ my: 2, backgroundColor: "#FFE5E5" }} />
                      
                      <Box sx={{ mb: 2 }}>
                        <QuantityDisplay>
                          <Typography variant="body1" sx={{ color: "#666" }}>
                            Total Quantity:
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: "bold", color: "#333" }}>
                            {item.quantity}
                          </Typography>
                        </QuantityDisplay>
                        
                        {item.remainingQuantity !== undefined && (
                          <QuantityDisplay>
                            <Typography variant="body1" sx={{ color: "#666" }}>
                              Remaining:
                            </Typography>
                            <Typography variant="body1" sx={{ 
                              fontWeight: "bold", 
                              color: item.remainingQuantity === 0 ? "#4CAF50" : "#FF6B6B" 
                            }}>
                              {item.remainingQuantity}
                            </Typography>
                          </QuantityDisplay>
                        )}
                        
                        <Typography variant="body1" sx={{ mb: 1, color: "#666" }}>
                          Expiry Date: <strong>{new Date(item.expiryDate).toLocaleDateString()}</strong>
                        </Typography>
                        {item.allergyInfo && (
                          <Typography variant="body1" sx={{ color: "#666" }}>
                            Allergy Info: <strong>{item.allergyInfo}</strong>
                          </Typography>
                        )}
                      </Box>

                      <StyledButton 
                        fullWidth 
                        onClick={() => openMap(item.location.latitude, item.location.longitude)}
                      >
                        View Location
                      </StyledButton>

                      {item.isAccepted && hasMultipleRecipients && (
                        <Box sx={{ mt: 3 }}>
                          <Typography 
                            fontWeight="700" 
                            sx={{ 
                              color: "#FF6B6B",
                              mb: 1
                            }}
                          >
                            {`Recipients (${allRecipients.length})`}
                          </Typography>
                          
                          {allRecipients.map((recipient, index) => (
                            <Accordion 
                              key={index}
                              sx={{ 
                                mb: 1, 
                                boxShadow: 'none',
                                backgroundColor: '#FFE5E5',
                                borderRadius: '8px',
                                '&:before': {
                                  display: 'none',
                                },
                                '&.Mui-expanded': {
                                  margin: '0 0 8px 0',
                                }
                              }}
                            >
                              <AccordionSummary
                                expandIcon={<ChevronDown size={20} color="#FF6B6B" />}
                                sx={{ 
                                  padding: '4px 16px',
                                  '& .MuiAccordionSummary-content': {
                                    margin: '8px 0'
                                  }
                                }}
                              >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                  <Typography fontWeight="600" color="#333">
                                    {recipient.name || "Recipient"}
                                  </Typography>
                                  <Chip 
                                    label={`${recipient.requestedQuantity || 1} items`} 
                                    size="small"
                                    sx={{ 
                                      backgroundColor: 'rgba(255, 107, 107, 0.2)',
                                      color: '#FF6B6B'
                                    }}
                                  />
                                </Box>
                              </AccordionSummary>
                              <AccordionDetails sx={{ padding: '0 16px 16px' }}>
                                <Divider sx={{ mb: 1.5, backgroundColor: "rgba(255, 107, 107, 0.2)" }} />
                                <Typography variant="body2" sx={{ mb: 0.5, color: "#666" }}>
                                  Name: <strong>{recipient.name || "N/A"}</strong>
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 0.5, color: "#666" }}>
                                  Phone: <strong>{recipient.phoneNumber || "N/A"}</strong>
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 0.5, color: "#666" }}>
                                  Quantity: <strong>{recipient.requestedQuantity || 1}</strong>
                                </Typography>
                                <Typography variant="body2" sx={{ color: "#666" }}>
                                  Accepted: <strong>
                                    {recipient.acceptedAt ? 
                                      new Date(recipient.acceptedAt).toLocaleDateString() : 
                                      "N/A"}
                                  </strong>
                                </Typography>
                              </AccordionDetails>
                            </Accordion>
                          ))}
                        </Box>
                      )}
                    </CardContent>
                  </StyledCard>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default UserDonations;