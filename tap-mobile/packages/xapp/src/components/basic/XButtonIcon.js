import { Pressable, StyleSheet, View } from "react-native";
import { emptyFn } from "xapp/src/common/utils";
import { Theme } from "xapp/src/style/themes";
import { useColor, useThemedStyle } from "xapp/src/style/ThemeContext";
import XText from "./XText";
import XIcon from "./XIcon";

const ButtonIcon = ({
	icon,
	style,
	color,
	colorName,
	primary,
	backgroundColor,
	size = 36,
	disabled = false,
	standard = false,
	outline = false,
	title,
	bgOpacity = 1,
	onPress = emptyFn,
	...rest
}) => {

	const [tPColor, pLCorlor, cByName] = useColor(['textPrimary', 'primaryLight', colorName]);

	const iconColor = cByName || color || ((primary || backgroundColor) && pLCorlor) || tPColor;
	const styles = useThemedStyle(styleCreator, title ? size + 5 : size, backgroundColor, primary, disabled, bgOpacity, outline, iconColor);
	const iconSize = Math.round(size * 0.6);

	return (
		<Pressable
			hitSlop={10}
			style={[styles.btn, style]}
			onPress={onPress}
			{...rest}
		>
			<View style={{ justifyContent: 'center', alignItems: 'center' }}>
				{!!icon && <XIcon icon={icon} color={iconColor} size={iconSize} />}
				{!!title && <XText size={10} color={iconColor}>{title}</XText>}
			</View>
		</Pressable>
	)
};

const styleCreator = (theme, size, backgroundColor, primary, disabled, bgOpacity, outline, iconColor) => {
	let bgColor = theme.colors.backgroundElement;
	if (backgroundColor)
		bgColor = backgroundColor;
	if (primary)
		bgColor = theme.colors.primary;


	return StyleSheet.create({
		btn: {
			borderRadius: Theme.values.borderRadius,
			backgroundColor: outline ? undefined : Theme.opacity(bgColor, bgOpacity),
			borderWidth: outline ? Theme.values.borderWidth : 0,
			borderColor: iconColor,
			width: size,
			height: size,
			alignItems: 'center',
			justifyContent: 'center',
			opacity: disabled ? Theme.values.disabledOpacity : 1
		}
	});
}


export default ButtonIcon;