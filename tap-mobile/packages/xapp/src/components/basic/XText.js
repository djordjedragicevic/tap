import { useMemo } from "react";
import { StyleSheet, Text } from "react-native";
import { useThemedStyle } from "../../style/ThemeContext";
import { useStore } from "../../store/store";

const fontWeights = {
	100: 'Thin',
	300: 'Light',
	400: 'Regular',
	500: 'Medium',
	600: 'SemiBold',
	700: 'Bold',
	800: 'ExtraBold',
	900: 'Black'
}


const XText = ({
	primary,
	secondary,
	tertiary,
	light,
	style,
	children,
	weight,
	italic,
	size,
	color,
	bold,
	...rest
}) => {
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

	const appFont = useStore(state => state.app.font);
	const styles = useThemedStyle(createStyle, textColor, appFont, { weight: bold ? 700 : weight, italic, size });

	return (
		<Text style={[styles.text, style]} {...rest}>{children}</Text>
	);
};

XText.defaultProps = {
	primary: true,
	secondary: false,
	light: false,
	tertiary: false,
	weight: 0,
	italic: false,
	style: {}
};

const createStyle = (theme, textColor, appFont, { weight, italic, size }) => {
	const style = {
		color: theme.colors[textColor]
	};

	if (appFont) {
		const fSplit = appFont.split('_');
		const w = weight ? weight + fontWeights[weight] : fSplit[1];
		style.fontFamily = fSplit[0] + '_' + w;
		//style.fontFamily = fSplit[0] + '_' + w + (italic ? '_Italic' : '');
	}
	else if (weight) {
		style.fontWeight = weight;
	}

	if (size)
		style.fontSize = size;



	return StyleSheet.create({
		text: style
	})
};

export default XText;