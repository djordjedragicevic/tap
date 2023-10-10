import { StyleSheet, View } from "react-native";
import { useThemedStyle } from "../../style/ThemeContext";
import XText from "./XText";
import XImage from "./XImage";
import { Theme } from "../../style/themes";

const XAvatar = ({ size = 30, color, style, imgPath, initials }) => {
	const styles = useThemedStyle(styleCreator, color, size);

	return (
		<View
			width={size}
			height={size}
			style={[styles.avatar, style]}
		>
			{imgPath ?
				<XImage imgPath={imgPath} style={styles.img} />
				:
				<View style={styles.text}>
					<XText light size={Math.floor(size * 0.47)}>{initials}</XText>
				</View>
			}
		</View >
	);
};

const styleCreator = (theme, color) => StyleSheet.create({
	text: {
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'lightcoral',
		flex: 1,
		borderRadius: Theme.values.borderRadius
	},
	avatar: {
		borderRadius: Theme.values.borderRadius,
		justifyContent: 'center',
		borderColor: color || theme.colors.primary,
		overflow: 'hidden'
	},
	img: {
		flex: 1
	}
})

export default XAvatar;