import { useMemo } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useThemedStyle } from "../../store/ThemeContext";
import { values } from "../../style/themes";
import XText from "./XText";

const XButton = ({ title, onPress, disabled, style }) => {
	const styles = useThemedStyle(createStyle);

	const dinStyle = useMemo(() => {
		if (disabled)
			return {
				opacity: values.disabledOpacity
			}
		else return {}
	}, [disabled]);

	return (
		<TouchableOpacity disabled={disabled} onPress={onPress} style={[styles.button, dinStyle, style]}>
			{!!title && <XText style={styles.text} secondary>{title}</XText>}
		</TouchableOpacity>
	);
};

XButton.defaultProps = {
	disabled: false,
	style: {}
};

const createStyle = (theme) => StyleSheet.create({
	button: {
		height: 42,
		paddingHorizontal: 10,
		backgroundColor: theme.colors.primary,
		borderRadius: theme.values.borderRadius,
		alignItems: 'center',
		justifyContent: 'center'
	},
	text: {
		textTransform: 'uppercase',
		color: theme.colors.textLight
	}
});

export default XButton;