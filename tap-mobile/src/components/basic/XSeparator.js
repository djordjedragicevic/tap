import { StyleSheet, View } from "react-native";
import { useThemedStyle } from "../../store/ThemeContext";

const XSeparator = () => {
	const styles = useThemedStyle(createStyle);
	return (
		<View style={styles.separator} />
	);
};

const createStyle = (theme) => StyleSheet.create({
	separator: {
		flex: 1,
		backgroundColor: theme.colors.textTertiary,
		width: 1
	}
})

export default XSeparator;