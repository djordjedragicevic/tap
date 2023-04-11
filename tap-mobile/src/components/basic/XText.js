import { useMemo } from "react";
import { StyleSheet, Text } from "react-native";
import { useThemedStyle } from "../../store/ThemeContext";



const XText = ({ primary, secondary, tertiary, light, style, children, ...rest }) => {
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
		<Text style={[styles.text, style]} {...rest}>{children}</Text>
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
			fontFamily: 'Roboto_400Regular'
		}
	})
};

export default XText;