import { StyleSheet, View } from "react-native";
import { useThemedStyle } from "../../style/ThemeContext";
import XText from "./XText";

const XTag = ({ bgColor, text }) => {
	const styles = useThemedStyle(styleCreator, bgColor);
	return (
		<View style={[styles.tag]}>
			<View style={styles.triangle} />
			<XText light size={13}>{text}</XText>
		</View>
	);
};

const styleCreator = (theme, bgColor) => StyleSheet.create({
	triangle: {
		width: 0,
		height: 0,
		marginEnd: 18,
		borderTopWidth: 13,
		borderTopColor: 'transparent',
		borderBottomWidth: 13,
		borderBottomColor: 'transparent',
		borderLeftWidth: 13,
		borderLeftColor: theme.colors.backgroundElement
	},
	tag: {
		flexDirection: 'row',
		alignItems: 'center',
		height: 26,
		paddingEnd: 18,
		marginEnd: -4,
		borderTopEndRadius: 3,
		borderBottomEndRadius: 3,
		backgroundColor: bgColor || theme.colors.primary
	}
})

export default XTag;