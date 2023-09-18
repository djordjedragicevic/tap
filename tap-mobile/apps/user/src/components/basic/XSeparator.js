import { StyleSheet, View } from "react-native";
import { useThemedStyle } from "../../style/ThemeContext";

const XSeparator = ({ vertical = false, margin = 5, color }) => {
	const styles = useThemedStyle(createStyle, vertical, margin, color);
	return (
		<View style={styles.separator} />
	);
};

const createStyle = (theme, vertical, margin, color) => StyleSheet.create({
	separator: {
		flex: 1,
		backgroundColor: color || theme.colors.textTertiary,
		...(vertical ? { width: 0.7, height: '100%', marginVertical: margin } : { height: 0.7, width: '100%', marginHorizontal: margin })
	}
})

export default XSeparator;