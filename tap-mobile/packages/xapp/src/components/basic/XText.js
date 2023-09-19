import { useMemo } from "react";
import { StyleSheet, Text } from "react-native";
import { useThemedStyle } from "../../style/ThemeContext";
import { useStore } from "../../store/store";

const fontWeights = {
	100: 'Thin',
	300: 'Light',
	400: 'Regular',
	500: 'Medium',
	700: 'Bold',
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

	const fontFamily = useMemo(() => {
		if (!appFont)
			return undefined;

		if (!weight && !italic)
			return appFont;

		const fSplit = appFont.split('_');
		const w = weight ? weight + fontWeights[weight] : fSplit[1];

		return fSplit[0] + '_' + w + (italic ? '_Italic' : '');
	}, [weight, italic, appFont]);

	const styles = useThemedStyle(createStyle, textColor, fontFamily, size, weight);
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

const createStyle = (theme, textColor, font, size, weight) => {
	return StyleSheet.create({
		text: {
			fontFamily: font,
			fontSize: size,
			fontWeight: weight || undefined,
			color: theme.colors[textColor]
		}
	})
};

export default XText;