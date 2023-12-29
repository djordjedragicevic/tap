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
	primary,
	backgroundColor,
	size = 36,
	disabled = false,
	standard = false,
	title,
	bgOpacity = 1,
	onPress = emptyFn,
	...rest
}) => {

	const [tPColor, pLCorlor] = useColor(['textPrimary', 'primaryLight']);

	const iconColor = color || ((primary || backgroundColor) && pLCorlor) || tPColor;
	const styles = useThemedStyle(styleCreator, title ? size + 5 : size, backgroundColor, primary, disabled, bgOpacity);
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

const styleCreator = (theme, size, backgroundColor, primary, disabled, bgOpacity) => {
	let bgColor = theme.colors.backgroundElement;
	if (backgroundColor)
		bgColor = backgroundColor;
	if (primary)
		bgColor = theme.colors.primary;


	return StyleSheet.create({
		btn: {
			borderRadius: Theme.values.borderRadius,
			backgroundColor: Theme.opacity(bgColor, bgOpacity),
			width: size,
			height: size,
			alignItems: 'center',
			justifyContent: 'center',
			opacity: disabled ? Theme.values.disabledOpacity : 1
		}
	});
}


export default ButtonIcon;