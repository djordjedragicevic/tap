import { StyleSheet, View } from "react-native";
import { useStore } from "../../store/store";
import { useThemedStyle } from "../../style/ThemeContext";

const XOverlay = () => {
	const isMaksed = useStore(gS => gS.app.isMasked);
	const styles = useThemedStyle(styleCreator);

	if (!isMaksed)
		return null

	return (
		<View style={styles.mask} />
	)
};

const styleCreator = (theme) => StyleSheet.create({
	mask: {
		...StyleSheet.absoluteFill,
		backgroundColor: theme.colors.primaryColor,
		opacity: 0.3
	}
})

export default XOverlay;