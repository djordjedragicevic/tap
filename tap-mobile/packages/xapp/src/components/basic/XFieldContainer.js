import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useThemedStyle } from "../../style/ThemeContext";
import XMask from "./XMask";
import { Theme } from "../../style/themes";
import { AntDesign } from "@expo/vector-icons";

const XFieldContainer = ({
	iconRight = false,
	iconLeft = false,
	iconRightDisabled = false,
	iconLeftDisabled = false,
	onIconRightPress,
	onIconLeftPress,
	iconRightColor,
	iconLeftColor,
	iconLeftSize = 18,
	iconRightSize = 18,
	style = {},
	styleCenterContainer = {},
	disabled = false,
	onPress,
	children,
	onCenterPress,
	meta,
	outline,
	focused
}) => {

	const styles = useThemedStyle(createStyle, outline, focused);
	const RootCmp = onPress ? TouchableOpacity : View;
	const IconRightCmp = onIconRightPress ? TouchableOpacity : View;
	const IconLeftCmp = onIconLeftPress ? TouchableOpacity : View;
	const CenterCmp = onCenterPress ? TouchableOpacity : View;

	return (
		<RootCmp style={[styles.container, style]} onPress={() => onPress?.(meta)}>
			{
				!!iconLeft &&
				<IconLeftCmp disabled={iconLeftDisabled} style={[styles.icon, { opacity: iconLeftDisabled ? Theme.values.disabledOpacity : 1 }]} onPress={onIconLeftPress}>
					{typeof iconLeft === 'string' ?
						<AntDesign name={iconLeft} size={iconLeftSize} color={iconLeftColor || styles.iconColor} />
						:
						iconLeft({ size: iconLeftSize, color: iconLeftColor || styles.iconColor })
					}
				</IconLeftCmp>
			}
			<CenterCmp style={[styles.centerContainer, styleCenterContainer]} onPress={() => onCenterPress?.(meta)}>
				{children}
			</CenterCmp>
			{
				!!iconRight &&
				<IconRightCmp disabled={iconRightDisabled} style={[styles.icon, { opacity: iconRightDisabled ? Theme.values.disabledOpacity : 1 }]} onPress={onIconRightPress}>
					{typeof iconRight === 'string' ?
						<AntDesign name={iconRight} size={iconRightSize} color={iconRightColor || styles.iconColor} />
						:
						iconRight({ size: iconRightSize, color: iconRightColor || styles.iconColor })
					}
				</IconRightCmp>
			}
			{disabled && <XMask />}
		</RootCmp>
	);
};

const createStyle = (theme, outline, focused) => StyleSheet.create({
	container: {
		borderRadius: Theme.values.borderRadius,
		borderWidth: outline && Theme.values.borderWidth,
		borderColor: focused ? theme.colors.primary : theme.colors.borderColor,
		flexDirection: 'row',
		backgroundColor: theme.colors.backgroundElement,
		height: 45
	},
	icon: {
		paddingHorizontal: 8,
		alignItems: 'center',
		justifyContent: 'center'
	},
	centerContainer: {
		flex: 1,
		paddingHorizontal: 8,
		justifyContent: 'center'
	},
	iconColor: theme.colors.primary,
	iconRightColor: theme.colors.textSecondary
});

export default XFieldContainer;