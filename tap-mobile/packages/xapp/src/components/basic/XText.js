import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { usePrimaryColor, useThemedStyle } from "../../style/ThemeContext";
import { useStore } from "../../store/store";
import { AntDesign } from '@expo/vector-icons';


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
	bold,
	icon,
	ellipsizeMode = 'tail',
	numberOfLines = 0,
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
	const styles = useThemedStyle(createStyle, textColor, appFont, { weight: bold ? 600 : weight, italic, size });
	const pColor = usePrimaryColor();

	if (!icon)
		return (
			<Text style={[styles.text, style]} ellipsizeMode={oneLine ? 'tail' : ellipsizeMode} numberOfLines={oneLine ? 1 : numberOfLines} {...rest}>{children}</Text>
		);
	else if (typeof icon === 'string')
		return (
			<View style={styles.container}>
				<AntDesign name={icon} size={18} color={pColor} />
				<Text style={[styles.text, style]} ellipsizeMode={oneLine ? 'tail' : ellipsizeMode} numberOfLines={oneLine ? 1 : numberOfLines} {...rest}>{children}</Text>
			</View>
		);
	else if (typeof icon === 'function')
		return (
			<View style={styles.container}>
				{icon({ size: 18, color: pColor })}
				<Text style={[styles.text, style]} ellipsizeMode={oneLine ? 'tail' : ellipsizeMode} numberOfLines={oneLine ? 1 : numberOfLines} {...rest}>{children}</Text>
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
		text: style,
		container: {
			flexDirection: 'row',
			alignItems: 'center'
		}
	})
};

export default XText;