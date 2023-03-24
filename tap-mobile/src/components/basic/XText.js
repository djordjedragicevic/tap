import { useMemo } from "react";
import { StyleSheet, Text } from "react-native";
import { useThemedStyle } from "../../store/ThemeContext";



const XText = ({ primary, secondary, tertiary, light, style, children }) => {
	const textColor = useMemo(() => {
		if (light)
			return 'textLight'
		else if (secondary)
			return 'textSecondary';
		else if (tertiary)
			return 'textTertiary';
		else
			return 'textPrimary';

	}, [primary, secondary, light]);

	const styles = useThemedStyle(createStyle, textColor);

	return (
		<Text style={[styles.text, style]}>{children}</Text>
	);
};

XText.defaultProps = {
	primary: true,
	secondary: false,
	light: false,
	tertiary: false,
	style: {}
};

const createStyle = (theme, textColor) => {
	return StyleSheet.create({
		text: {
			color: theme.colors[textColor],
			fontWeight: '500'
		}
	})
};

export default XText;