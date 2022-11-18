import { useMemo } from "react";
import { StyleSheet, Text } from "react-native";
import { useThemedStyle } from "../../store/ThemeContext";

const XText = ({ primary, secondary, style, children }) => {
	const styles = useThemedStyle(createStyle);
	const composedStyle = useMemo(() => {
		const st = {
			...styles.text,
			...(secondary ? styles.secondary : {}),
			...style
		};

		return st;
	}, [styles, primary, secondary, style]);

	return (
		<Text style={composedStyle}> {children}</Text>
	);
};

XText.defaultProps = {
	primary: true,
	secondary: false,
	style: {}
};

const createStyle = (theme) => StyleSheet.create({
	text: {
		color: theme.colors.textPrimary
	},
	secondary: {
		color: theme.colors.textSecondary
	}
});

export default XText;