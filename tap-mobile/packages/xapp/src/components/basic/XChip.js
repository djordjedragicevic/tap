import { StyleSheet, View } from "react-native";
import { useThemedStyle } from "../../style/ThemeContext";
import XText from "./XText";
import { Theme } from "../../style/themes";

const XChip = ({ text, style, textStyle, children, color, primary = true, ...rest }) => {
	const styles = useThemedStyle(createStyle, color, primary);

	return (
		<View style={[styles.container, style]} {...rest}>
			{text != null ? <XText style={[styles.text, textStyle]}>{text}</XText> : children}
		</View>
	)
};

const createStyle = (theme, color, primary) => {

	let tColor = theme.colors.textSecondary,
		bColor = theme.colors.backgroundElement;

	if (primary) {
		tColor = theme.colors.textLight;
		bColor = theme.colors.primary;
	}
	if (color) {
		tColor = theme.colors[color];
		bColor = theme.colors[`${color}Light`];
	}

	return StyleSheet.create({
		container: {
			height: 24,
			paddingHorizontal: 8,
			justifyContent: 'center',
			alignItems: 'center',
			backgroundColor: bColor,
			borderRadius: Theme.values.borderRadius,
			offset: 'hidden'
		},
		text: {
			color: tColor
		}
	})
}

export default XChip;