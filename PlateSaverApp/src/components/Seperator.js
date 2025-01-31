// import React from "react";

// import { View } from "react-native";

// const Seperator = ({height,width, ...extraProps}) => (
//     <View style={{height,width, ...extraProps}}/>
// );

// Seperator.defaultProps = {
//     height: 0,
//     width: 0,
// };


// export default Seperator;
import React from "react";
import { View } from "react-native";

const Separator = ({ height = 0, width = 0, ...extraProps }) => (
    <View style={{ height, width, ...extraProps }} />
);

export default Separator;