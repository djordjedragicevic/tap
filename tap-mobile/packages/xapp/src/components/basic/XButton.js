import { useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Theme } from "../../style/themes";
import XText from "./XText";
import { useThemedStyle } from "../../style/ThemeContext";

const XButton = ({
	title,
	onPress,
	disabled,
	style,
	children,
	flat = false,
	round = false,
	small = false,
	outline = false,
	primary = true,
	secondary = false
}) => {

	const styles = useThemedStyle(createStyle, {
		flat,
		round,
		small,
		outline
	}, primary, secondary);

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
				{!!title && <XText style={styles.text} secondary>{title}</XText>}
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
	let rad = Theme.values.borderRadius;
	let padding = 12;
	let textColor = theme.colors.textLight;
	let fontSize;

	if (params.flat)
		rad = 0;
	if (params.round)
		rad = 100;

	if (params.small) {
		padding = 6;
		fontSize = 12;
	}

	let outline = {};

	if (params.outline || secondary) {
		outline.borderWidth = 1;
		outline.borderColor = theme.colors.primary;
		//outline.backgroundColor = theme.colors.primaryLight;
		outline.backgroundColor = 'transparent';
		textColor = theme.colors.primary;

	};


	return StyleSheet.create({
		button: {
			borderRadius: rad,
			backgroundColor: theme.colors.primary,
			padding: padding,
			alignItems: 'center',
			justifyContent: 'center',
			...outline
		},
		text: {
			textTransform: 'uppercase',
			color: textColor,
			fontSize: fontSize,
			fontWeight: 700
		},
		flexView: {
			flex: 1
		}
	})
};

export default XButton;