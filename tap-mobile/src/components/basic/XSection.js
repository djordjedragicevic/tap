import { useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useThemedStyle } from "../../style/ThemeContext";
import XMask from "./XMask";

const XSection = ({ children, style, disabled, onPress, disabledOpacity }) => {

	const styles = useThemedStyle(createStyle);

	const RootCmp = onPress instanceof Function ? TouchableOpacity : View;

	return (
		<RootCmp style={[styles.card, style]} onPress={onPress}>
			{children}
			{disabled && <XMask opacity={disabledOpacity} />}
		</RootCmp>
	);
}

export default XSection;

XSection.defaultProps = {
	disabledOpacity: 0.5
};

const createStyle = (theme) => StyleSheet.create({
	card: {
		paddingHorizontal: 8,
		paddingVertical: 8,
		overflow: 'hidden',
		borderRadius: theme.values.borderRadius,
		backgroundColor: theme.colors.backgroundElement
	}
});
