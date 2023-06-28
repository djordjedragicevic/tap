import { memo } from "react";
import { StyleSheet, View } from "react-native";
import { useThemedStyle } from "../../style/ThemeContext";

const XContainer = memo(({ children, style }) => {
	const styles = useThemedStyle(createStyle);
	return (
		<View style={[styles.container, style]}>
			{children}
		</View>
	)
});

const createStyle = (theme) => StyleSheet.create({
	container: {
		backgroundColor: theme.colors.backgroundElement,
		borderRadius: theme.values.borderRadius,
		overflow: 'hidden'
	}
});

export default XContainer;