import { Pressable, StyleSheet } from "react-native";
import { emptyFn } from "xapp/src/common/utils";
import { Theme } from "xapp/src/style/themes";
import { useColor, useThemedStyle } from "xapp/src/style/ThemeContext";
import { AntDesign } from '@expo/vector-icons';

const ButtonIcon = ({
	icon,
	style,
	color,
	primary,
	size = 36,
	onPress = emptyFn,
	...rest
}) => {

	const iconColor = color || useColor(primary ? 'primary' : 'textPrimary');
	const styles = useThemedStyle(styleCreator);
	const iconSize = Math.round(size * 0.6);

	return (
		<Pressable
			hitSlop={10}
			style={[styles.btn, style]}
			onPress={onPress}
			{...rest}
		>
			{
				typeof icon === 'string' ? <AntDesign name={icon} color={iconColor} size={iconSize} /> : icon({ color: iconColor, size: iconSize })
			}
		</Pressable>
	)
};

const styleCreator = (theme, size) => StyleSheet.create({
	btn: {
		borderRadius: Theme.values.borderRadius,
		padding: 7,
		backgroundColor: theme.colors.backgroundElement,
		width: size,
		height: size,
		alignItems: 'center',
		justifyContent: 'center'
	}
});


export default ButtonIcon;