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
	transparent = false,
	titleRight = null
}) => {

	const styles = useThemedStyle(createStyle, transparent, !!title);

	const RootCmp = onPress instanceof Function ? TouchableOpacity : View;

	return (
		<View style={[styles.container, style]}>
			{!!(title || titleRight) &&
				<View style={[styles.title, styleTitle]}>
					{!!title && <XText bold>{title}</XText>}
					{!!titleRight && titleRight}
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

const createStyle = (theme, transparent, hasTitle) => StyleSheet.create({
	title: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 10,
		paddingVertical: 3
	},
	content: {
		padding: 6,
		backgroundColor: transparent ? 'transparent' : theme.colors.backgroundElement,
		borderRadius: Theme.values.borderRadius,
		borderTopEndRadius: hasTitle ? 0 : Theme.values.borderRadius,
		borderTopStartRadius: hasTitle ? 0 : Theme.values.borderRadius
	},
	container: {
		backgroundColor: transparent ? 'transparent' : theme.colors.background,
		overflow: 'hidden',
		borderRadius: Theme.values.borderRadius,

	}
});
