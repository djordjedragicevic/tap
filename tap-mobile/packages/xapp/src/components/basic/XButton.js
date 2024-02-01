import React, { useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Theme } from "../../style/themes";
import XText from "./XText";
import { useColor, useThemedStyle } from "../../style/ThemeContext";
import { AntDesign } from "@expo/vector-icons";

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
		if (primary || color)
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
					{typeof iconLeft === 'string' ? <AntDesign name={iconLeft} color={iconColor} size={17} /> : iconRight(iconColor, 17)}
				</View>
			}
			{React.isValidElement(title) ? title : (!!title && <XText style={[styles.text, textStyle]} secondary>{title}</XText>)}
			{!!iconRight &&
				<View style={styles.iconRight}>
					{typeof iconRight === 'string' ? <AntDesign name={iconRight} color={iconColor} size={17} /> : iconRight(iconColor, 17)}
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
		fontSize: undefined,
		textAlign: 'center',
		fontWeight: 600
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
		btnStyle.borderWidth = 1;
		btnStyle.borderColor = theme.colors.borderColor;
		textStyle.color = theme.colors.textSecondary;
		btnStyle.backgroundColor = 'transparent';
		if (params.color) {
			btnStyle.borderColor = params.color;
			textStyle.color = params.color;
		}
	}

	return StyleSheet.create({
		button: btnStyle,
		text: textStyle,
		iconRight: {
			alignContent: 'center',
			justifyContent: 'center',
			marginStart: 5,
			marginEnd: -10
		},
		iconLeft: {
			alignContent: 'center',
			justifyContent: 'center',
			marginEnd: 5,
			//marginStart: -10
		}
	});
};

export default XButton;