
import React from "react";
import { View } from "react-native";

const Separator = ({ height = 0, width = 0, ...extraProps }) => (
    <View style={{ height, width, ...extraProps }} />
);

export default Separator;