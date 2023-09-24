import { useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Theme } from "../../style/themes";
import XText from "./XText";
import { useColor, usePrimaryColor, useThemedStyle } from "../../style/ThemeContext";

const XButton = ({
	title,
	onPress,
	disabled,
	style,
	textStyle,
	children,
	color,
	flat = false,
	round = false,
	small = false,
	outline = false,
	primary = true,
	secondary = false,
	iconRight,
	iconLeft
}) => {

	const styles = useThemedStyle(createStyle, {
		flat,
		round,
		small,
		outline,
		color
	}, primary, secondary);

	const c = useColor(outline ? 'primary' : 'textLight');

	const iconColor = color || c;

	const dinStyle = useMemo(() => {
		if (disabled)
			return {
				opacity: Theme.values.disabledOpacity
			}
		else return {}
	}, [disabled]);

	return (
		<>
			<TouchableOpacity disabled={disabled} onPress={onPress} style={[styles.button, dinStyle, style]}>
				{!!title && <XText style={[styles.text, textStyle]} secondary>{title}</XText>}
				{!!iconRight &&
					<View style={styles.iconRight}>
						{iconRight(iconColor, 17)}
					</View>
				}
				{children}
			</TouchableOpacity>
		</>
	);
};

XButton.defaultProps = {
	disabled: false,
	style: {}
};

const createStyle = (theme, params, primary, secondary) => {

	const btnStyle = {

		height: 38,
		paddingHorizontal: 10,
		//padding: 12,
		borderRadius: Theme.values.borderRadius,
		flexDirection: 'row',
		backgroundColor: theme.colors.primary,
		justifyContent: 'center',
		alignItems: 'center'

	};

	const textStyle = {
		textTransform: 'uppercase',
		color: theme.colors.textLight,
		fontSize: undefined,
		fontWeight: 700,
		textAlign: 'center'
	};

	if (params.round) {
		btnStyle.borderRadius = 100;
	}

	if (params.small) {
		textStyle.fontSize = 12;
		btnStyle.height = 28;
	}

	if (params.color) {
		btnStyle.backgroundColor = params.color;
	}

	if (params.outline) {
		btnStyle.borderWidth = 1;
		btnStyle.borderColor = theme.colors.primary;
		btnStyle.backgroundColor = 'transparent';
		textStyle.color = theme.colors.primary;
		if (params.color) {
			btnStyle.borderColor = params.color;
			textStyle.color = params.color;
		}
	}



	return StyleSheet.create({
		button: btnStyle,
		text: textStyle,
		iconRight: {
			marginStart: 5
		}
	});
};

export default XButton;