import { StyleSheet, View } from "react-native";
import { useThemedStyle } from "../../style/ThemeContext";
import XText from "./XText";
import { Theme } from "../../style/themes";

const XChip = ({ text, style, textStyle, children, primary = true, ...rest }) => {
	const styles = useThemedStyle(createStyle);

	return (
		<View style={[primary && styles.primary, styles.container, style]} {...rest}>
			{text != null ? <XText light style={textStyle}>{text}</XText> : children}
		</View>
	)
};

const createStyle = (theme) => StyleSheet.create({
	container: {
		height: 24,
		paddingHorizontal: 8,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: Theme.values.borderRadius,
		offset: 'hidden'
	},
	primary: {
		backgroundColor: theme.colors.primary,
	}
})

export default XChip;