import { StyleSheet, View } from "react-native";
import { useThemedStyle } from "xapp/src/style/ThemeContext";
import { Theme } from "xapp/src/style/themes";

const Footer = ({ style, children }) => {

	const styles = useThemedStyle(styleCreator);

	return (
		<View style={[styles.footer, style]}>
			{children}
		</View>
	);
};

const styleCreator = (theme) => StyleSheet.create({
	footer: {
		backgroundColor: theme.colors.secondary,
		paddingHorizontal: Theme.values.mainPaddingHorizontal,
		borderTopStartRadius: Theme.values.borderRadius,
		borderTopEndRadius: Theme.values.borderRadius,
		height: Theme.values.footerHeight,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row'
	}
})

export default Footer;