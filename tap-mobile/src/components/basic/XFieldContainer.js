import React from "react";
import { Pressable, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { emptyFn } from "../../common/utils";
import { useThemedStyle } from "../../style/ThemeContext";
import XMask from "./XMask";
import { Theme } from "../../style/themes";

const XFieldContainer = ({
	iconRight = false,
	iconLeft = false,
	style = {},
	styleCenterContainer = {},
	disabled = false,
	onPress = emptyFn,
	children,
	meta
}) => {

	const styles = useThemedStyle(createStyle);
	const RootCmp = onPress ? TouchableOpacity : View;

	return (
		<RootCmp style={[styles.container, style]} onPress={() => onPress(meta)}>
			{
				!!iconLeft &&
				<View style={styles.icon}>
					{iconLeft({ size: 18, color: styles.iconColor })}
				</View>
			}
			<View style={[styles.centerContainer, styleCenterContainer]}>
				{children}
			</View>
			{
				!!iconRight &&
				<View style={styles.icon}>
					{iconRight({ size: 18, color: styles.iconRightColor })}
				</View>
			}
			{disabled && <XMask />}
		</RootCmp>
	);
};

const createStyle = (theme) => StyleSheet.create({
	container: {
		borderRadius: Theme.values.borderRadius,
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