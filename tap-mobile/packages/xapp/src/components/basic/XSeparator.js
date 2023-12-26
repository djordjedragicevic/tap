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
		flex: 1,
		backgroundColor: color || theme.colors.textTertiary,
		...(vertical ? { width: 0.7, flex: 1, marginVertical: margin } : { height: 0.7, flex: 1, marginHorizontal: margin })
	}
})

export default XSeparator;