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
	onPress = emptyFn,
	...rest
}) => {

	const tPColor = useColor('textPrimary');
	const pLCorlor = useColor('primaryLight');
	const iconColor = ((primary || backgroundColor) && pLCorlor) || color || tPColor;
	const styles = useThemedStyle(styleCreator, title ? size + 5 : size, backgroundColor, primary, disabled);
	const iconSize = Math.round(size * 0.6);

	return (
		<Pressable
			hitSlop={10}
			style={[styles.btn, style]}
			onPress={onPress}
			{...rest}
			onBlur={() => console.log("BLURRRR")}
		>
			<View style={{ justifyContent: 'center', alignItems: 'center' }}>
				{!!icon && <XIcon icon={icon} color={iconColor} size={iconSize} />}
				{!!title && <XText size={10} color={iconColor}>{title}</XText>}
			</View>
		</Pressable>
	)
};

const styleCreator = (theme, size, backgroundColor, primary, disabled, iconColor) => {
	let bgColor = theme.colors.backgroundElement;
	if (backgroundColor)
		bgColor = backgroundColor;
	if (primary)
		bgColor = theme.colors.primary;


	return StyleSheet.create({
		btn: {
			borderRadius: Theme.values.borderRadius,
			//padding: 7,
			backgroundColor: bgColor,
			width: size,
			height: size,
			alignItems: 'center',
			justifyContent: 'center',
			opacity: disabled ? Theme.values.disabledOpacity : 1
		}
	});
}


export default ButtonIcon;