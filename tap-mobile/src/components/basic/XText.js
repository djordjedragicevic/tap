import { useMemo } from "react";
import { StyleSheet, Text } from "react-native";
import { useThemedStyle } from "../../style/ThemeContext";
import { useStore } from "../../store/store";



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

	const font = useStore(state => state.app.font);
	const styles = useThemedStyle(createStyle, textColor, font);

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

const createStyle = (theme, textColor, font) => {
	return StyleSheet.create({
		text: {
			color: theme.colors[textColor],
			//fontFamily: 'Montserrat_500Medium'
			fontFamily: font
		}
	})
};

export default XText;