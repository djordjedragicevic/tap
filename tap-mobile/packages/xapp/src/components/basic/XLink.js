import { StyleSheet, TouchableOpacity } from "react-native";
import XText from "./XText";
import { useThemedStyle } from "../../style/ThemeContext";

const XLink = ({ onPress, disabled, children, style, ...rest }) => {

	const styles = useThemedStyle(styleCreator);

	return (
		<TouchableOpacity onPress={onPress} disabled={disabled}>
			<XText style={[styles.text, style]} {...rest}>{children}</XText>
		</TouchableOpacity>
	);
}

const styleCreator = (theme) => StyleSheet.create({
	text: {
		color: theme.colors.primary,
		textDecorationLine: 'underline'
	}
})

export default XLink;