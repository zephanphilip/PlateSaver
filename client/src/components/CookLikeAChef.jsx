import React from "react";
import { Box, Button, TextField, Typography, CircularProgress, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { motion } from "framer-motion";

const CookLikeAChef = () => {
  const [prompt, setPrompt] = React.useState("");
  const [result, setResult] = React.useState(["Generate your magic recipe!"]);
  const [loading, setLoading] = React.useState(false);

  const parseRecipe = (text) => {
    // Split the text into sections
    const sections = text.split(/\n(?=[A-Za-z]+:)/);
    return sections.map(section => {
      const lines = section.split('\n').map(line => line.trim()).filter(line => line);
      return lines;
    }).flat();
  };

  const handleGenerateRecipe = async () => {
    if (prompt.trim()) {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:3001/api/ai/cooklikeachef", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch recipe");
        }

        const data = await response.json();
        setResult(parseRecipe(data.recipe || "No recipe found."));
      } catch (error) {
        console.error("Error generating recipe:", error);
        setResult(["Failed to generate the recipe. Try again later."]);
      } finally {
        setLoading(false);
      }
    } else {
      setResult(["Please enter a valid prompt."]);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result.join("\n"));
    alert("Recipe copied to clipboard!");
  };

  const getLineStyle = (line) => {
    if (line.endsWith(':')) {
      return {
        fontWeight: 'bold',
        fontSize: '1.2rem',
        marginTop: 2,
        marginBottom: 1
      };
    } else if (line.match(/^\d+\./)) {
      return {
        marginLeft: 2,
        marginBottom: 1
      };
    } else if (line.startsWith(' ')) {
      return {
        marginLeft: 3,
        marginBottom: 0.5
      };
    }
    return {
      marginBottom: 0.5
    };
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        height: "100vh",
        px: 2,
        py: 0,
        bgcolor: "#F9F9F9",
      }}
    >
      {/* Top Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          mt: 2,
        }}
      >
        <Button startIcon={<ArrowBackIcon sx={{ color: "#FF6B6B" }} />} onClick={() => window.history.back()} />
        <Typography variant="h3" fontWeight="bold" sx={{ color: "#333" }}>
          Cook Like a Chef
        </Typography>
        <Box sx={{ width: 56 }} />
      </Box>

      {/* Middle Section */}
      <Box
        component={motion.div}
        initial={{ boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}
        animate={{ boxShadow: ["0 0 30px rgba(255,255,255,0.5)", "0 0 40px rgba(255,255,255,0.7)"] }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
        sx={{
          borderRadius: 2,
          width: "100%",
          maxWidth: "800px",
          minHeight: "200px",
          padding: 3,
          backgroundColor: "#FF6B6B",
          color: "white",
          textAlign: "left",
          position: "relative",
          overflowY: "auto",
          maxHeight: "60vh"
        }}
      >
        {loading ? (
          <CircularProgress color="inherit" />
        ) : (
          result.map((line, index) => (
            <Typography 
              key={index} 
              sx={getLineStyle(line)}
            >
              {line}
            </Typography>
          ))
        )}
        <IconButton
          onClick={handleCopy}
          sx={{ position: "absolute", top: 10, right: 10, color: "white" }}
        >
          <ContentCopyIcon />
        </IconButton>
      </Box>

      {/* Bottom Section */}
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", mt: 4, mb: 4 }}>
        <TextField
          variant="outlined"
          placeholder="Type a dish (e.g., Spicy Biryani)"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          sx={{
            width: "90%",
            maxWidth: "600px",
            bgcolor: "#FFF",
            borderRadius: 2,
            mb: 2,
            boxShadow: "0 1px 5px rgba(0,0,0,0.1)",
            "& .MuiOutlinedInput-input": {
              color: "#333",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#FF6B6B",
              },
              "&:hover fieldset": {
                borderColor: "#FF6B6B",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#FF6B6B",
              },
            },
          }}
        />
        <Button
          variant="contained"
          onClick={handleGenerateRecipe}
          sx={{
            borderRadius: 8,
            px: 4,
            py: 1,
            backgroundColor: "#FF6B6B",
            color: "white",
            boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
            "&:hover": {
              backgroundColor: "#D64D4D",
            },
          }}
        >
          Generate Recipe
        </Button>
      </Box>
    </Box>
  );
};

export default CookLikeAChef;



// import React from "react";
// import { Box, Button, TextField, Typography, CircularProgress } from "@mui/material";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import { motion } from "framer-motion";

// const CookLikeAChef = () => {
//   const [prompt, setPrompt] = React.useState("");
//   const [result, setResult] = React.useState(["Generate your Magic recipe!"]);
//   const [loading, setLoading] = React.useState(false);

//   const parseRecipe = (text) => {
//     // Split recipe into steps using regex that captures the number and step together
//   const steps = text.match(/(\d+\.\s[^\n]+)/g);
  
//   // Return the steps as an array, with each step on a new line
//   return steps || [];
//   };

//   const handleGenerateRecipe = async () => {
//     if (prompt.trim()) {
//       setLoading(true);
//       try {
//         const response = await fetch("http://localhost:3001/api/ai/cooklikeachef", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ prompt }),
//         });

//         if (!response.ok) {
//           throw new Error("Failed to fetch recipe");
//         }

//         const data = await response.json();
//         setResult(parseRecipe(data.recipe || "No recipe found."));
//       } catch (error) {
//         console.error("Error generating recipe:", error);
//         setResult(["Failed to generate the recipe. Try again later."]);
//       } finally {
//         setLoading(false);
//       }
//     } else {
//       setResult(["Please enter a valid prompt."]);
//     }
//   };

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "space-between",
//         height: "100vh",
//         px: 2,
//         py: 0,
//         bgcolor: "white",
//       }}
//     >
//       {/* Top Section */}
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           width: "100%",
//         }}
//       >
//         <Button
//           startIcon={<ArrowBackIcon sx={{ color: "#FF6B6B" }} />}
//           onClick={() => window.history.back()}
//         >
          
//         </Button>
//         <Typography
//           variant="h2"
//           fontWeight="bold"
//           sx={{ textAlign: "center", color: "#FF6B6B" }}
//         >
//           COOK LIKE A CHEF
//         </Typography>
//         <Box sx={{ width: "56px" }} /> {/* Placeholder for spacing */}
//       </Box>

//       {/* Middle Section */}
      
//         {loading ? (
//           <CircularProgress color="inherit" />
//         ) : (
//           <Box
//         initial={{ boxShadow: "0 0 10px #fe98ec" }}
//         animate={{
//           boxShadow: ["0 0 30px #fff", "0 0 40px #fff", "0 0 30px #fff"],
//         }}
//         transition={{
//           duration: 2,
//           repeat: Infinity,
//           repeatType: "loop",
//         }}
//         sx={{
//           borderRadius: 2,
//           width: "70%",
//           maxWidth: "1200px",
//           minHeight: "150px",
//           margin: "auto",
//           padding: 2,
//           backgroundColor: "#FF6B6B",
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "center",
//           alignItems: "center",
//           textAlign: "left",
//         }}
//       >
//           {result.map((line, index) => (
//             <Typography
//               key={index}
//               variant={line.match(/^\d+\.\s/) ? "body1" : "h6"} // Different style for steps and sections
//               color="white"
//               sx={{ marginBottom: 1 ,textAlign: "center" }}
//             >
//               {line}
//             </Typography>
//           ))}
//           </Box>
//         )}
      

//       {/* Bottom Prompt Section */}
//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           width: "100%",
//         }}
//       >
//         <TextField
//           variant="outlined"
//           placeholder="Spicy Biriyani..."
//           value={prompt}
//           onChange={(e) => setPrompt(e.target.value)}
//           sx={{
//             width: "90%",
//             maxWidth: "500px",
//             mb: 2,
//             bgcolor: "#FF6B6B",
//             borderRadius: 2,
//             "& .MuiInputBase-input::placeholder": {
//               color: "rgba(255, 255, 255, 0.8)",
//             },
//             "& .MuiInputBase-input": {
//               color: "white",
//             },
//             "& .MuiOutlinedInput-root": {
//               "&:hover .MuiOutlinedInput-notchedOutline": {
//                 borderColor: "white",
//               },
//               "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//                 borderColor: "white",
//               },
//             },
//           }}
//         />
//         <Button
//           variant="contained"
//           onClick={handleGenerateRecipe}
//           sx={{
//             borderRadius: 8,
//             px: 4,
//             mb: 4,
//             color:"#FF6B6B",
//             backgroundColor: "#FFE5E5",
//             "&:hover": {
//               backgroundColor: "#FF6B6B",
//               color: "white",
//             },
//           }}
//         >
//           Generate Recipe
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// export default CookLikeAChef;
