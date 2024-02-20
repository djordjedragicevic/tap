import React, { useCallback } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useColor, useThemedStyle } from "../../style/ThemeContext";
import XMask from "./XMask";
import { Theme } from "../../style/themes";
import XIcon from "./XIcon";

const XFieldContainer = ({
	iconRight = false,
	iconLeft = false,
	iconRightDisabled = false,
	iconLeftDisabled = false,
	onIconRightPress,
	onIconLeftPress,
	iconRightColor,
	iconLeftColor,
	iconLeftColorName,
	iconLeftSize = 18,
	iconRightSize = 18,
	iconRightStyle = {},
	iconLeftStyle = {},
	blurIconColor,
	style = {},
	styleCenterContainer = {},
	disabled = false,
	onPress,
	children,
	onCenterPress,
	meta,
	outline,
	focused,
	flex = false,
	flexCenter = true
}) => {

	const styles = useThemedStyle(createStyle, outline, focused, flex, flexCenter, blurIconColor);
	const RootCmp = onPress && !disabled ? TouchableOpacity : View;
	const IconRightCmp = onIconRightPress ? TouchableOpacity : View;
	const IconLeftCmp = onIconLeftPress ? TouchableOpacity : View;
	const CenterCmp = onCenterPress ? TouchableOpacity : View;
	const iLColor = useColor(iconLeftColorName);

	const onPressInt = useCallback(() => {
		if (!disabled)
			onPress?.(meta);
	}, [onPress, disabled, meta])

	return (
		<RootCmp
			style={[styles.container, style]}
			onPress={onPressInt}
		>
			{
				!!iconLeft &&
				<IconLeftCmp disabled={iconLeftDisabled} style={[styles.iconLeft, { opacity: iconLeftDisabled ? Theme.values.disabledOpacity : 1 }, iconLeftStyle]} onPress={onIconLeftPress}>
					<XIcon icon={iconLeft} size={iconLeftSize} color={iconLeftColor || styles.iconColor || iLColor} />
				</IconLeftCmp>
			}
			<CenterCmp style={[styles.centerContainer, styleCenterContainer]} onPress={() => {
				if (!disabled)
					onCenterPress?.(meta)
			}}>
				{children}
			</CenterCmp>
			{
				!!iconRight &&
				<IconRightCmp disabled={iconRightDisabled} style={[styles.iconRight, { opacity: iconRightDisabled ? Theme.values.disabledOpacity : 1 }, iconRightStyle]} onPress={onIconRightPress}>
					<XIcon icon={iconRight} size={iconRightSize} color={iconRightColor || styles.iconColor} />
				</IconRightCmp>
			}
			{disabled && <XMask />}
		</RootCmp>
	);
};

const createStyle = (theme, outline, focused, flex, flexCenter, blurIconColor) => {
	return StyleSheet.create({
		container: {
			borderRadius: Theme.values.borderRadius,
			borderWidth: outline && Theme.values.borderWidth,
			borderColor: focused ? theme.colors.primary : theme.colors.borderColor,
			flexDirection: 'row',
			backgroundColor: theme.colors.backgroundElement,
			minHeight: 44,
			paddingVertical: 5,
			flex: flex ? 1 : undefined
		},
		iconLeft: {
			paddingStart: 8,
			alignItems: 'center',
			justifyContent: 'center'
		},
		iconRight: {
			paddingEnd: 8,
			alignItems: 'center',
			justifyContent: 'center'
		},
		centerContainer: {
			flex: flexCenter ? 1 : undefined,
			paddingHorizontal: 8,
			justifyContent: 'center'
		},
		iconColor: focused || !blurIconColor ? theme.colors.primary : theme.colors.textTertiary,
		iconRightColor: theme.colors.textTertiary
	})
};

export default XFieldContainer;