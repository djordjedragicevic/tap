import { useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Theme } from "../../style/themes";
import XText from "./XText";
import { useThemedStyle } from "../../style/ThemeContext";

const XButton = ({ title, onPress, disabled, style, children, bottom = false, flat = false, round = false }) => {
	const styles = useThemedStyle(createStyle, flat);

	const dinStyle = useMemo(() => {
		if (disabled)
			return {
				opacity: Theme.values.disabledOpacity
			}
		else return {}
	}, [disabled]);

	return (
		<>
			{bottom && <View style={styles.flexView} />}
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

const createStyle = (theme, flat, round) => {
	let rad = Theme.values.borderRadius;
	if (flat)
		rad = 0;
	if (round)
		rad = 50;

	return StyleSheet.create({
		button: {
			height: 42,
			paddingHorizontal: 10,
			backgroundColor: theme.colors.primary,
			borderRadius: rad,
			alignItems: 'center',
			justifyContent: 'center'
		},
		text: {
			textTransform: 'uppercase',
			color: theme.colors.textLight
		},
		flexView: {
			flex: 1
		}
	})
};

export default XButton;