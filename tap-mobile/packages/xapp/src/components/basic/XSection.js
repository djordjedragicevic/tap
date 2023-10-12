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
	styleContent,
	styleTitle,
	transparent = false
}) => {

	const styles = useThemedStyle(createStyle, transparent);

	const RootCmp = onPress instanceof Function ? TouchableOpacity : View;

	return (
		<View style={[styles.container, style]}>
			{!!title && <View style={[styles.title, styleTitle]}>
				<XText size={18} weight={500}>{title}</XText>
			</View>
			}
			<RootCmp style={[styles.content, styleContent]} onPress={onPress}>
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
		paddingHorizontal: 10,
		justifyContent: 'center',
		paddingVertical: 3
	},
	content: {
	},
	container: {
		backgroundColor: transparent ? 'transparent' : theme.colors.backgroundElement,
		padding: 8,
		overflow: 'hidden',
		borderRadius: Theme.values.borderRadius,

	}
});
