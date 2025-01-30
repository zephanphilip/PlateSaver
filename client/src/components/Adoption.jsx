import React, { useState, useEffect } from "react";
import { Box, Card, CardContent, CardHeader, Typography, Button, Input, Alert, CircularProgress, Slider } from "@mui/material";
import { MapPin, Clock, Info, X, Loader2, Navigation } from "lucide-react";
import { useUser } from "@clerk/clerk-react";

const Adoption = () => {
  // All state and function declarations remain the same
  const { user, isLoaded } = useUser();
  const [location, setLocation] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [searchRadius, setSearchRadius] = useState(10);
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    location: {
      latitude: "",
      longitude: "",
    },
  });

  // All utility functions remain exactly the same
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const openInGoogleMaps = (destinationLat, destinationLng) => {
    if (!location) {
      setError("Please enable location services first");
      return;
    }
    
    const url = `https://www.google.com/maps/dir/?api=1&origin=${location.latitude},${location.longitude}&destination=${destinationLat},${destinationLng}&travelmode=driving`;
    window.open(url, '_blank');
  };

  // All useEffect hooks remain the same
  useEffect(() => {
    if (isLoaded) {
      handleGetLocation();
    }
  }, [isLoaded]);

  useEffect(() => {
    if (location) {
      fetchDonations();
    }
  }, [location, searchRadius]);

  const fetchDonations = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/donate/available/${user.id}`
      );
      if (!response.ok) throw new Error("Failed to fetch donations.");
      const data = await response.json();
      
      const nearbyDonations = data.donations.filter(donation => {
        const distance = calculateDistance(
          location.latitude,
          location.longitude,
          donation.location.latitude,
          donation.location.longitude
        );
        return distance <= searchRadius;
      });
      
      setDonations(nearbyDonations);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch donations");
      setLoading(false);
    }
  };

  const handleGetLocation = () => {
    setLocationLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setFormData({
            ...formData,
            location: newLocation,
          });
          setLocation(newLocation);
          setLocationLoading(false);
        },
        () => {
          setError("Failed to get location. Please enable location services.");
          setLocationLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser");
      setLocationLoading(false);
    }
  };

  const sendEmailNotification= async(userEmail, message, data) => {
    try {
      const response = await fetch(`http://localhost:3001/api/notification/senddonationemail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail,
          message,
          data
        })
      });
      
      const datas = await response.json();
      console.log('Email notification response:', datas);
    } catch (error) {
      console.error('Error sending email notification:', error);
    }
  }
  const handleAccept = async (donationId) => {
    try {
       // Find the donation details before making the acceptance request
       const donation = donations.find(d => d._id === donationId);
       if (!donation) {
         setError("Donation not found");
         return;
       }
      const response = await fetch(
        `http://localhost:3001/api/donate/${donationId}/accept`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            ...formData,
          }),
        }
      );

      if (response.ok) {
        // Send email notification to the donor
        const donorMessage = `Your donation of ${donation.foodDetails} has been accepted by ${formData.name}. 
          They can be reached at ${formData.phoneNumber}.`;
        console.log(donation);
        await sendEmailNotification(
          donation.email, // donor's email from donation data
          donorMessage,
          {
            foodDetails: donation.foodDetails,
            acceptedBy: formData.name,
            phoneNumber: formData.phoneNumber,
            acceptedAt: new Date().toISOString()
          }
        );

        // Send confirmation email to the recipient
        const recipientMessage = `You have successfully accepted the donation of ${donation.foodDetails}. 
          Please collect it before ${new Date(donation.expiryDate).toLocaleDateString()}.`;
        
        await sendEmailNotification(
          user.primaryEmailAddress.emailAddress, // current user's email
          recipientMessage,
          {
            foodDetails: donation.foodDetails,
            expiryDate: donation.expiryDate,
            location: donation.location,
            acceptedAt: new Date().toISOString()
          }
        );
        await fetchDonations();
        setSelectedDonation(null);
        setFormData({
          name: "",
          phoneNumber: "",
          location: location,
        });
      } else {
        const data = await response.json();
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to accept donation");
    }
  };

  if (loading)
    return (
      <Box 
        sx={{ 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center", 
          minHeight: "100vh",
          backgroundColor: "#FFE5E5"
        }}
      >
        <CircularProgress sx={{ color: "#FF6B6B" }} />
      </Box>
    );

  return (
    <Box 
      sx={{ 
        maxWidth: "100%", 
        margin: "0 auto", 
        p: 3,
        backgroundColor: "#FFE5E5",
        minHeight: "100vh"
      }}
    >
      <Box 
        sx={{ 
          mb: 4, 
          textAlign: "center",
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "20px",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)"
        }}
      >
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: "bold", 
            mb: 1,
            color: "#FF6B6B"
          }}
        >
          Nearby Food Donations
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: "#FF6B6B",
            mb: 3
          }}
        >
          Showing available donations within {searchRadius}km of your location
        </Typography>
        <Box sx={{ maxWidth: 300, margin: "0 auto" }}>
          <Typography gutterBottom sx={{ color: "#FF6B6B" }}>
            Search Radius: {searchRadius}km
          </Typography>
          <Slider
            value={searchRadius}
            onChange={(_, value) => setSearchRadius(value)}
            min={1}
            max={50}
            step={1}
            marks={[
              { value: 1, label: '1km' },
              { value: 25, label: '25km' },
              { value: 50, label: '50km' },
            ]}
            sx={{ 
              color: "#FF6B6B",
              '& .MuiSlider-markLabel': {
                color: "#FF6B6B"
              }
            }}
          />
        </Box>
        <Typography 
          variant="body1" 
          sx={{ 
            color: "red",
            mt: 3,
            fontWeight: "bold",
          }}
        >
          Note : You cannot CANCEL an adoption after you accept it.
        </Typography>
      </Box>

      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            '& .MuiAlert-icon': {
              color: "#FF6B6B"
            }
          }}
        >
          {error}
        </Alert>
      )}

      {donations.length === 0 ? (
        <Alert 
          severity="info"
          sx={{
            backgroundColor: "white",
            color: "#FF6B6B",
            '& .MuiAlert-icon': {
              color: "#FF6B6B"
            }
          }}
        >
          No donations available within {searchRadius}km of your location.
        </Alert>
      ) : (
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 3 }}>
          {donations.map((donation) => (
            <Card
              key={donation._id}
              sx={{ 
                border: "1px solid #FFE5E5",
                borderRadius: "20px",
                transition: "transform 0.2s, box-shadow 0.2s",
                backgroundColor: "white",
                '&:hover': { 
                  transform: "translateY(-5px)",
                  boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.1)"
                }
              }}
            >
              <CardHeader
                title={
                  <Typography variant="h6" sx={{ fontWeight: 600, color: "#FF6B6B" }}>
                    {donation.foodDetails}
                  </Typography>
                }
                subheader={
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      bgcolor: "#FFE5E5",
                      color: "#FF6B6B",
                      px: 1.5,
                      py: 0.5,
                      borderRadius: "20px",
                      display: "inline-block"
                    }}
                  >
                    Available
                  </Typography>
                }
              />
              <CardContent>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Clock style={{ width: "16px", height: "16px", color: "#FF6B6B" }} />
                    <Typography variant="body2" sx={{ color: "#FF6B6B" }}>
                      Expires: {new Date(donation.expiryDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <MapPin style={{ width: "16px", height: "16px", color: "#FF6B6B" }} />
                      <Typography variant="body2" sx={{ color: "#FF6B6B" }}>
                        {calculateDistance(
                          location.latitude,
                          location.longitude,
                          donation.location.latitude,
                          donation.location.longitude
                        ).toFixed(1)} km away
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Navigation style={{ width: "16px", height: "16px" }} />}
                      onClick={() => openInGoogleMaps(donation.location.latitude, donation.location.longitude)}
                      sx={{
                        borderColor: "#FF6B6B",
                        color: "#FF6B6B",
                        '&:hover': {
                          borderColor: "#ff5252",
                          backgroundColor: "#FFE5E5"
                        }
                      }}
                    >
                      Directions
                    </Button>
                  </Box>
                  {donation.allergyInfo && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Info style={{ width: "16px", height: "16px", color: "#FF6B6B" }} />
                      <Typography variant="body2" sx={{ color: "#FF6B6B" }}>
                        Allergy Info: {donation.allergyInfo}
                      </Typography>
                    </Box>
                  )}
                  <Typography variant="body2" sx={{ color: "#FF6B6B" }}>
                    Quantity: {donation.quantity}
                  </Typography>

                  {selectedDonation === donation._id ? (
                    <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
                      <Input
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        sx={{
                          '&:before': { borderColor: "#FF6B6B" },
                          '&:after': { borderColor: "#FF6B6B" },
                        }}
                      />
                      <Input
                        placeholder="Phone Number"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        sx={{
                          '&:before': { borderColor: "#FF6B6B" },
                          '&:after': { borderColor: "#FF6B6B" },
                        }}
                      />
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                          variant="contained"
                          onClick={() => handleAccept(donation._id)}
                          sx={{
                            backgroundColor: "#FF6B6B",
                            '&:hover': {
                              backgroundColor: "#ff5252"
                            }
                          }}
                        >
                          Confirm
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={() => setSelectedDonation(null)}
                          sx={{
                            borderColor: "#FF6B6B",
                            color: "#FF6B6B",
                            '&:hover': {
                              borderColor: "#ff5252",
                              backgroundColor: "#FFE5E5"
                            }
                          }}
                        >
                          Cancel
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    <Button
                      variant="contained"
                      sx={{ 
                        mt: 2,
                        backgroundColor: "#FF6B6B",
                        width: "100%",
                        '&:hover': {
                          backgroundColor: "#ff5252"
                        }
                      }}
                      onClick={() => setSelectedDonation(donation._id)}
                    >
                      Accept Donation
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Adoption;

