import { StyleSheet, View } from "react-native";
import { useThemedStyle } from "../../style/ThemeContext";
import XText from "./XText";
import { useStore } from "../../store/store";
import { useIsUserLogged } from "../../store/concreteStores";

const XAvatar = ({ size = 30, focused = false, color, style = {} }) => {
	const styles = useThemedStyle(styleCreator, focused, color, size);
	const initials = useStore(gS => gS.user.initials);
	const isLogged = useIsUserLogged();

	if (!isLogged)
		return null

	return (
		<View width={size} height={size} style={styles.avatar}>
			{!!initials && <XText light size={Math.floor(size * 0.47)} style={style.initials}>{initials}</XText>}
		</View >
	);
};

const styleCreator = (theme, focused, color, size) => StyleSheet.create({
	avatar: {
		borderRadius: 7,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'lightcoral',
		borderWidth: focused ? 1 : 0,
		borderColor: color || theme.colors.primary
	},
	initials: {
		color: theme.colors.primaryText
	}
})

export default XAvatar;