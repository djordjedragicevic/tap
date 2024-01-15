import { StyleSheet, View } from "react-native";
import { useThemedStyle } from "../../style/ThemeContext";

const XSeparator = ({ vertical = false, margin = 0, color, style }) => {
	const styles = useThemedStyle(createStyle, vertical, margin, color);
	return (
		<View style={[styles.separator, style]} />
	);
};

const createStyle = (theme, vertical, margin, color) => StyleSheet.create({
	separator: {
		backgroundColor: color || theme.colors.borderColor,
		...(vertical ? { width: 0.7, marginVertical: margin } : { height: 0.7, marginHorizontal: margin })
	}
})

export default XSeparator;