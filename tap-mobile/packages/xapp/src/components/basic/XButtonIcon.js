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
	iconColor,
	size = 36,
	disabled = false,
	standard = false,
	outline = false,
	title,
	bgOpacity = 1,
	onPress = emptyFn,
	...rest
}) => {



	//const [iconColor, primaryColor, colorByName] = useColor([color || colorName || primary ? 'textLight' : 'textSecondary', 'primary', colorName]);
	//const bgColor = (primary && primaryColor) || color || colorByName;


	const [pColor, tLColor, cByName] = useColor(['primary', 'textLight', colorName || Theme.vars.secondary]);

	let bgColor;

	if (primary)
		bgColor = pColor;
	else if (backgroundColor)
		bgColor = backgroundColor;
	else
		bgColor = cByName;

	let icColor;
	if (outline)
		icColor = bgColor;
	else if (iconColor)
		icColor = iconColor;
	else
		icColor = tLColor;

	//const iconColor = cByName || color || ((primary || backgroundColor) && pLCorlor) || tPColor;
	const styles = useThemedStyle(styleCreator, title ? size + 5 : size, disabled, outline, bgColor, bgOpacity);
	const iconSize = Math.round(size * 0.6);


	return (
		<Pressable
			hitSlop={10}
			style={[styles.btn, style]}
			onPress={onPress}
			{...rest}
		>
			<View style={{ justifyContent: 'center', alignItems: 'center' }}>
				{!!icon && <XIcon icon={icon} color={icColor} size={iconSize} />}
				{!!title && <XText size={10} color={icColor}>{title}</XText>}
			</View>
		</Pressable>
	)
};

const styleCreator = (theme, size, disabled, outline, bgColor, bgOpacity) => {

	const color = Theme.opacity(bgColor || theme.colors.secondary, bgOpacity);

	return StyleSheet.create({
		btn: {
			borderRadius: Theme.values.borderRadius,
			backgroundColor: outline ? undefined : color,
			borderWidth: outline ? Theme.values.borderWidth : 0,
			borderColor: color,
			width: size,
			height: size,
			alignItems: 'center',
			justifyContent: 'center',
			opacity: disabled ? Theme.values.disabledOpacity : 1
		}
	});
}


export default ButtonIcon;