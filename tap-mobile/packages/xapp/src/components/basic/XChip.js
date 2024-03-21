import { Pressable, StyleSheet, View } from "react-native";
import { useColor, useThemedStyle } from "../../style/ThemeContext";
import XText from "./XText";
import { Theme } from "../../style/themes";
import XIcon from "./XIcon";

const XChip = ({
	text,
	style,
	textStyle,
	textProps = {},
	children,
	color,
	icon,
	iconRight,
	onIconRightPress,
	primary,
	bgOpacity = 1,
	round,
	outline,
	chipHeight = 24,
	disabled,
	...rest
}) => {
	const styles = useThemedStyle(createStyle, color, primary, bgOpacity, round, outline, chipHeight, disabled);
	const themedColor = useColor(color || (primary ? 'textLight' : 'textSecondary'));
	return (
		<View style={[styles.container, style]} {...rest}>
			{icon != null ? <XIcon icon={icon} color={themedColor} size={16} /> : null}
			{text != null ? <XText color={themedColor} style={[textStyle]} {...textProps}>{text}</XText> : children}
			{iconRight != null ?
				<Pressable onPress={onIconRightPress} disabled={disabled}>
					<XIcon icon={iconRight} color={themedColor} size={16} />
				</Pressable> :
				null
			}

		</View>
	)
};

const createStyle = (theme, color, primary, bgOpacity, round, outline, chipHeight, disabled) => {

	let bColor = theme.colors.backgroundElement;

	if (primary) {
		bColor = theme.colors.primary;
	}
	if (color) {
		bColor = theme.colors[`${color}Light`];
	}

	return StyleSheet.create({
		container: {
			height: chipHeight,
			paddingHorizontal: 8,
			columnGap: 5,
			justifyContent: 'center',
			alignItems: 'center',
			backgroundColor: Theme.opacity(bColor, bgOpacity),
			borderRadius: round ? 50 : Theme.values.borderRadius,
			borderWidth: outline ? Theme.values.borderWidth : undefined,
			borderColor: color ? theme.colors[color] : theme.colors.borderColor,
			offset: 'hidden',
			flexDirection: 'row',
			opacity: disabled ? 0.5 : 1
		}
	})
}

export default XChip;