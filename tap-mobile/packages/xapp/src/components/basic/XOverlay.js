import { StyleSheet, View } from "react-native";
import { useStore } from "../../store/store";
import { useThemedStyle } from "../../style/ThemeContext";
import XText from "../basic/XText";
import { Theme } from "../../style/themes";

const XOverlay = () => {
	const [isMaksed, maskText, style, transparent] = useStore(gS => [gS.app.maskShown, gS.app.maskText, gS.app.maskStyle, gS.app.maskTransparent]);
	const styles = useThemedStyle(styleCreator, transparent);

	if (!isMaksed)
		return null

	return (
		<>
			<View style={[styles.mask, style]} />
			<View style={styles.overContainer}>
				{
					!!maskText &&
					<View style={styles.textContainer}>
						<XText secondary>{maskText}</XText>
					</View>
				}
			</View>
		</>
	)
};

const styleCreator = (theme, transparent) => StyleSheet.create({
	mask: {
		...StyleSheet.absoluteFill,
		zIndex: 1,
		backgroundColor: theme.colors.background,
		opacity: transparent ? 0.0 : 0.8,
		alignItems: 'center',
		justifyContent: 'center'
	},
	overContainer: {
		...StyleSheet.absoluteFill,
		zIndex: 2,
		alignItems: 'center',
		justifyContent: 'center'
	},
	textContainer: {
		borderRadius: Theme.values.borderRadius,
		position: 'absolute',
		padding: 10,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: theme.colors.backgroundElement
	}
})

export default XOverlay;