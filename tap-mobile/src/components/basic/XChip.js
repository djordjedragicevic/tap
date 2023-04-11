import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { useThemedStyle } from "../../store/ThemeContext";
import XText from "./XText";

const XChip = ({ text, style, textStyle, children, primary = true, ...rest }) => {
	const styles = useThemedStyle(createStyle);

	return (
		<View style={[primary && styles.primary, styles.container, style]} {...rest}>
			{text ? <XText light={primary} style={textStyle}>{text}</XText> : children}
		</View>
	)
};

const createStyle = (theme) => StyleSheet.create({
	container: {
		paddingHorizontal: 6,
		height: 23,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: theme.values.borderRadius,
		offset: 'hidden'
	},
	primary: {
		backgroundColor: theme.colors.primary,
	}
})

export default XChip;