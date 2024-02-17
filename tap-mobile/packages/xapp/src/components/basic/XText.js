import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { usePrimaryColor, useThemedStyle } from "../../style/ThemeContext";
import { useStore } from "../../store/store";
import XIcon from "./XIcon";


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
	colorPrimary,
	light,
	style,
	children,
	weight,
	italic,
	size,
	color,
	colorName,
	bold,
	icon,
	rightIcon,
	center,
	ellipsizeMode = 'tail',
	numberOfLines = 0,
	adjustsFontSizeToFit = false,
	oneLine = false,
	...rest
}) => {
	const textColor = useMemo(() => {
		if (light)
			return 'textLight'
		else if (secondary)
			return 'textSecondary';
		else if (tertiary)
			return 'textTertiary';
		else if (colorPrimary)
			return 'primary'
		else
			return 'textPrimary';

	}, [primary, secondary, light, colorPrimary]);

	const appFont = useStore(state => state.app.font);
	const styles = useThemedStyle(createStyle, appFont, {
		weight: bold ? 600 : weight,
		italic,
		size,
		color,
		colorName: colorName || textColor,
		center
	});
	const pColor = usePrimaryColor();

	if (!icon && !rightIcon)
		return (
			<Text style={[styles.text, style]} adjustsFontSizeToFit={adjustsFontSizeToFit} ellipsizeMode={oneLine ? 'tail' : ellipsizeMode} numberOfLines={oneLine ? 1 : numberOfLines} {...rest}>{children}</Text>
		);
	else
		return (
			<View style={styles.container}>
				{!!icon && <XIcon icon={icon} size={18} color={pColor} />}
				<Text style={[styles.text, styles.textInCnt, style]} adjustsFontSizeToFit={adjustsFontSizeToFit} ellipsizeMode={oneLine ? 'tail' : ellipsizeMode} numberOfLines={oneLine ? 1 : numberOfLines} {...rest}>{children}</Text>
				{!!rightIcon && <XIcon icon={rightIcon} size={18} color={pColor} />}
			</View>
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

const createStyle = (theme, appFont, { weight, italic, size, color, colorName, center }) => {
	const style = {
		color: color || theme.colors[colorName]
	};

	if (appFont) {
		const fSplit = appFont.split('_');
		const w = weight ? weight + fontWeights[weight] : fSplit[1];
		style.fontFamily = fSplit[0] + '_' + w;
	}
	else if (weight) {
		style.fontWeight = weight;
	}

	if (size)
		style.fontSize = size;

	if (center)
		style.textAlign = 'center';

	return StyleSheet.create({
		text: style,
		textInCnt: {
			flex: 1
		},
		container: {
			flexDirection: 'row',
			alignItems: 'center',
			columnGap: 5
		}
	})
};

export default XText;