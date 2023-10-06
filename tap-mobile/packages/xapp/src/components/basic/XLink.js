import { Pressable, StyleSheet } from "react-native";
import XText from "./XText";
import { useThemedStyle } from "../../style/ThemeContext";

const XLink = ({ onPress, children, style, ...rest }) => {

	const styles = useThemedStyle(styleCreator);

	return (
		<Pressable onPress={onPress}>
			<XText style={[styles.text, style]} {...rest}>{children}</XText>
		</Pressable>
	);
}

const styleCreator = (theme) => StyleSheet.create({
	text: {
		color: theme.colors.primary,
		textDecorationLine: 'underline'
	}
})

export default XLink;