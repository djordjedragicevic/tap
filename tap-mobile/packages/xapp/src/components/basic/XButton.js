import React, { useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Theme } from "../../style/themes";
import XText from "./XText";
import { useColor, useThemedStyle } from "../../style/ThemeContext";
import { AntDesign } from "@expo/vector-icons";
import XIcon from "./XIcon";

const XButton = ({
	title,
	onPress,
	disabled,
	style,
	textStyle,
	children,
	color,
	colorName,
	textColor,
	iconRight,
	iconLeft,
	flat = false,
	round = false,
	small = false,
	large = false,
	outline = false,
	primary = false,
	secondary = false,
	uppercase = true,
	flex = false
}) => {

	const styles = useThemedStyle(createStyle, {
		flat,
		round,
		small,
		large,
		outline,
		color,
		textColor,
		uppercase,
		flex,
		colorName
	}, primary, secondary);

	const getTextColor = () => {
		if (outline && primary)
			return 'primary'
		if (outline && secondary)
			return 'secondary'
		else if (colorName)
			return colorName
		else if (primary || secondary || color)
			return 'textLight';
		else
			return 'textPrimary';
	}

	const c = useColor(getTextColor());

	const iconColor = textColor || color || c;

	const dinStyle = useMemo(() => {
		if (disabled)
			return {
				opacity: Theme.values.disabledOpacity
			}
		else return {}
	}, [disabled]);

	return (
		<TouchableOpacity disabled={disabled} onPress={onPress} style={[styles.button, dinStyle, style]}>
			{!!iconLeft &&
				<View style={styles.iconLeft}>
					<XIcon icon={iconLeft} size={small ? 15 : 17} color={iconColor} />
				</View>
			}
			{React.isValidElement(title) ? title : (!!title && <XText style={[styles.text, textStyle]} secondary>{title}</XText>)}
			{!!iconRight &&
				<View style={styles.iconRight}>
					<XIcon icon={iconLeft} size={small ? 15 : 17} color={iconColor} />
				</View>
			}
			{children}
		</TouchableOpacity>
	);
};

XButton.defaultProps = {
	disabled: false,
	style: {}
};

const createStyle = (theme, params, primary, secondary) => {

	const btnStyle = {
		backgroundColor: theme.colors.backgroundElement,
		height: Theme.values.buttonHeight,
		paddingHorizontal: 10,
		borderRadius: Theme.values.borderRadius,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	};

	const textStyle = {
		color: theme.colors.textPrimary,
		textAlign: 'center'
	};

	if (params.flex)
		btnStyle.flex = 1;

	if (params.uppercase) {
		textStyle.textTransform = 'uppercase';
		textStyle.fontWeight = 700;
	}

	if (params.round) {
		btnStyle.borderRadius = 100;
	}

	if (secondary) {
		textStyle.color = theme.colors.textLight;
		btnStyle.backgroundColor = theme.colors.secondary;
	}

	if (primary) {
		textStyle.color = theme.colors.textLight;
		btnStyle.backgroundColor = theme.colors.primary;
	}


	if (params.small) {
		textStyle.fontSize = 13;
		btnStyle.height = 28;
	}

	if (params.large) {
		btnStyle.height = 45;
	}

	if (params.color) {
		btnStyle.backgroundColor = params.color;
		textStyle.color = theme.colors.textLight;
	}
	else if (params.colorName) {
		btnStyle.backgroundColor = theme.colors[params.colorName];
		textStyle.color = theme.colors.textLight;
	}

	if (params.textColor)
		textStyle.color = params.textColor;

	if (params.outline) {
		btnStyle.borderWidth = Theme.values.borderWidth;
		btnStyle.borderColor = theme.colors.borderColor;
		textStyle.color = theme.colors.textSecondary;
		btnStyle.backgroundColor = 'transparent';
		if (primary) {
			textStyle.color = theme.colors.primary;
			btnStyle.borderColor = theme.colors.primary;
		}
		else if (secondary) {
			textStyle.color = theme.colors.secondary;
			btnStyle.borderColor = theme.colors.secondary;
		}
		else if (params.color) {
			btnStyle.borderColor = params.color;
			textStyle.color = params.color;
		}
		else if (params.colorName) {
			btnStyle.borderColor = theme.colors[params.colorName];
			textStyle.color = theme.colors[params.colorName];
		}
	}

	return StyleSheet.create({
		button: btnStyle,
		text: textStyle,
		iconRight: {
			alignContent: 'center',
			marginStart: 5,
			justifyContent: 'center'
		},
		iconLeft: {
			alignContent: 'center',
			justifyContent: 'center',
			marginEnd: 5
		}
	});
};

export default XButton;