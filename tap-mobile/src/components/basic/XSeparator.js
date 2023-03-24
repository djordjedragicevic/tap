import { StyleSheet, View } from "react-native";
import { useThemedStyle } from "../../store/ThemeContext";

const XSeparator = ({ vertical = false, margin = 5, color }) => {
	const styles = useThemedStyle(createStyle, vertical, margin, color);
	return (
		<View style={styles.separator} />
	);
};

const createStyle = (theme, vertical, margin, color) => StyleSheet.create({
	separator: {
		flex: 1,
		backgroundColor: color || theme.colors.textSecondary,
		...(vertical ? { maxWidth: 0.8, marginVertical: margin } : { maxHeight: 0.8, marginHorizontal: margin })
	}
})

export default XSeparator;