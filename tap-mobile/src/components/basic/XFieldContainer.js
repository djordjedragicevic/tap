import React from "react";
import { Pressable, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { emptyFn } from "../../common/utils";
import { useThemedStyle } from "../../store/ThemeContext";
import XMask from "./XMask";

const XFieldContainer = ({
	iconRight = false,
	iconLeft = false,
	style = {},
	disabled = false,
	pressable = false,
	onPress = emptyFn,
	children,
}) => {

	const styles = useThemedStyle(createStyle);
	const RootCmp = pressable ? TouchableOpacity : Pressable;

	return (
		<RootCmp style={[styles.container, style]} onPress={onPress}>
			{
				!!iconLeft &&
				<View style={styles.icon}>
					{iconLeft({ size: 22, color: styles.iconColor })}
				</View>
			}
			<View style={styles.centerContainer}>
				{children}
			</View>
			{
				!!iconRight &&
				<View style={styles.icon}>
					{iconRight({ size: 22, color: styles.iconRightColor })}
				</View>
			}
			{disabled && <XMask />}
		</RootCmp>
	);
};

const createStyle = (theme) => StyleSheet.create({
	container: {
		borderRadius: theme.values.borderRadius,
		flexDirection: 'row',
		backgroundColor: theme.colors.backgroundElement,
		height: 48
	},
	icon: {
		paddingHorizontal: 8,
		alignItems: 'center',
		justifyContent: 'center'
	},
	centerContainer: {
		flex: 1,
		paddingHorizontal: 5,
		justifyContent: 'center'
	},
	iconColor: theme.colors.primary,
	iconRightColor: theme.colors.textSecondary
});

export default XFieldContainer;