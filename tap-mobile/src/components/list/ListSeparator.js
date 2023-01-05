import { StyleSheet, View } from "react-native";
import { useThemedStyle } from "../../store/ThemeContext";

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