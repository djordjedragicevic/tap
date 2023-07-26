import { StyleSheet, View } from "react-native";
import { useThemedStyle } from "../../style/ThemeContext";
import { memo } from "react";

const XMask = ({ enabled, opacity }) => {
	const styles = useThemedStyle(createStyle, opacity);
	return (
		<>
			{!!enabled && <View style={styles.mask} />}
		</>
	);
};

XMask.defaultProps = {
	enabled: true,
	opacity: 0.5
};

const createStyle = (theme, opacity) => StyleSheet.create({
	mask: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: theme.colors.backgroundElement,
		opacity: opacity,
		zIndex: 999
	}
});

export default memo(XMask);