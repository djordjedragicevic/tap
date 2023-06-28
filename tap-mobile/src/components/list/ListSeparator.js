import { StyleSheet, View } from "react-native";
import { useThemedStyle } from "../../style/ThemeContext";

const ListSeparator = () => {
	const styles = useThemedStyle(createStyle);

	return (
		<View style={styles.separator} />
	);
};

const createStyle = (theme) => StyleSheet.create({
	separator: {
		backgroundColor: theme.colors.textTertiary,
		height: StyleSheet.hairlineWidth
	}
});

export default ListSeparator;