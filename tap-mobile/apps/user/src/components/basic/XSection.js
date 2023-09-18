import { useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useThemedStyle } from "../../style/ThemeContext";
import XMask from "./XMask";
import { Theme } from "../../style/themes";
import XText from "./XText";

const XSection = ({
	title,
	children,
	style,
	disabled,
	onPress,
	disabledOpacity,
	contentStyle,
	transparent = false
}) => {

	const styles = useThemedStyle(createStyle, transparent);

	const RootCmp = onPress instanceof Function ? TouchableOpacity : View;

	return (
		<View style={style}>
			{!!title && <View style={styles.title}>
				<XText size={18} weight={500}>{title}</XText>
			</View>}
			<RootCmp style={[styles.card, contentStyle]} onPress={onPress}>
				{children}
				{disabled && <XMask opacity={disabledOpacity} />}
			</RootCmp>
		</View>
	);
}

export default XSection;

XSection.defaultProps = {
	disabledOpacity: 0.5
};

const createStyle = (theme, transparent) => StyleSheet.create({
	title: {
		paddingHorizontal: 8,
		justifyContent: 'flex-end'
	},
	card: {
		padding: 8,
		overflow: 'hidden',
		borderRadius: Theme.values.borderRadius,
		backgroundColor: transparent ? 'transparent' : theme.colors.backgroundElement
	}
});
