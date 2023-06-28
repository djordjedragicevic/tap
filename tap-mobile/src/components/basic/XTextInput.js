import React from "react";
import { Pressable, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { emptyFn } from "../../common/utils";
import { useThemedStyle } from "../../style/ThemeContext";
import XMask from "./XMask";

const XTextInput = React.forwardRef(({
	iconRight = false,
	iconLeft = false,
	style = {},
	disabled = false,
	pressable = false,
	onPress = emptyFn,
	...rest
}, ref) => {

	const styles = useThemedStyle(createStyle);
	const RootCmp = pressable ? TouchableOpacity : Pressable;

	return (
		<RootCmp style={[styles.container, style]} onPress={onPress}>
			{
				!!iconLeft &&
				<View style={styles.iconLeft}>
					{iconLeft({ size: 22, color: styles.iconColor })}
				</View>
			}
			<TextInput
				ref={ref}
				editable={rest.editable !== false || !disabled}
				{...rest}
				style={styles.field}
			/>
			{
				!!iconRight &&
				<View style={styles.iconRight}>
					{iconRight({ size: 22, color: styles.iconColor })}
				</View>
			}
			{disabled && <XMask />}
		</RootCmp>
	);
});

const createStyle = (theme) => StyleSheet.create({
	container: {
		borderRadius: theme.values.borderRadius,
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: 'white',
		paddingHorizontal: 5,
		height: 45
	},
	iconRight: {
		paddingEnd: 3,
		alignItems: 'center',
		justifyContent: 'center'
	},
	iconLeft: {
		paddingHorizontal: 7,
		alignItems: 'center',
		justifyContent: 'center'
	},
	field: {
		flex: 1
	},
	iconColor: theme.colors.primary
});

export default XTextInput;