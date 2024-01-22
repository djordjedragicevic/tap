import { StyleSheet, View } from "react-native";
import { useColor, useThemedStyle } from "../../style/ThemeContext";
import XText from "./XText";
import { Theme } from "../../style/themes";
import XIcon from "./XIcon";

const XChip = ({ text, style, textStyle, textProps = {}, children, color, icon, primary, ...rest }) => {
	const styles = useThemedStyle(createStyle, color, primary);
	const themedColor = useColor(color || (primary ? 'textLight' : 'textSecondary'));
	return (
		<View style={[styles.container, style]} {...rest}>
			{icon != null ? <XIcon icon={icon} color={themedColor} size={16} /> : null}
			{text != null ? <XText color={themedColor} style={[textStyle]} {...textProps}>{text}</XText> : children}
		</View>
	)
};

const createStyle = (theme, color, primary) => {

	let bColor = theme.colors.backgroundElement;

	if (primary) {
		bColor = theme.colors.primary;
	}
	if (color) {
		bColor = theme.colors[`${color}Light`];
	}

	return StyleSheet.create({
		container: {
			height: 24,
			paddingHorizontal: 8,
			columnGap: 5,
			justifyContent: 'center',
			alignItems: 'center',
			backgroundColor: bColor,
			borderRadius: Theme.values.borderRadius,
			offset: 'hidden',
			flexDirection: 'row'
		}
	})
}

export default XChip;