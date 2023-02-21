import { useMemo } from "react";
import { StyleSheet, Text } from "react-native";
import { useThemedStyle } from "../../store/ThemeContext";

const XText = ({ primary, secondary, light, style, children }) => {
	const styles = useThemedStyle(createStyle);
	const composedStyle = useMemo(() => {
		const st = {
			...styles.text,
			...(light ? styles.light : {}),
			...(secondary ? styles.secondary : {})
		};
		return st;
	}, [styles, primary, secondary, light, style]);

	return (
		<Text style={[composedStyle, style]}>{children}</Text>
	);
};

XText.defaultProps = {
	primary: true,
	secondary: false,
	light: false,
	style: {}
};

const createStyle = (theme) => StyleSheet.create({
	text: {
		color: theme.colors.textPrimary
	},
	light: {
		color: theme.colors.textLight
	},
	secondary: {
		color: theme.colors.textSecondary
	}
});

export default XText;