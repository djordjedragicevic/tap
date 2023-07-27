import { StyleSheet, View } from "react-native";
import { useThemedStyle } from "../../style/ThemeContext";
import XText from "./XText";
import { useStore } from "../../store/store";
import { useIsUserLogged } from "../../store/concreteStores";

const XAvatar = ({ size = 30, focused = false, color, style = {} }) => {
	const styles = useThemedStyle(styleCreator, focused, color);
	const initials = useStore(gS => gS.user.initials);
	const isLogged = useIsUserLogged();

	if (!isLogged)
		return null

	return (
		<View width={size} height={size} style={styles.avatar}>
			{!!initials && <XText style={{ fontSize: Math.floor(size * 0.47) }}>{initials}</XText>}
		</View >
	);
};

const styleCreator = (theme, focused, color) => StyleSheet.create({
	avatar: {
		borderRadius: 7,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'lightsteelblue',
		borderWidth: focused ? 1 : 0,
		borderColor: color || theme.colors.primary
	}
})

export default XAvatar;