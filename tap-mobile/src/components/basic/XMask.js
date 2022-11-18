import { StyleSheet, View } from "react-native";
import { useThemedStyle } from "../../store/ThemeContext";

const XMask = ({ enabled }) => {
	const styles = useThemedStyle(createStyle);
	return (
		<>
			{!!enabled && <View style={styles.mask} />}
		</>
	);
};

XMask.defaultProps = {
	enabled: false
};

const createStyle = (theme) => StyleSheet.create({
	mask: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: theme.colors.backgroundElement,
		opacity: 0.8,
		zIndex: 999
	}
});

export default XMask;