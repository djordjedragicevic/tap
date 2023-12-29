import { StyleSheet, View } from "react-native";
import { useThemedStyle } from "../../style/ThemeContext";
import XText from "./XText";
import { Theme } from "../../style/themes";
import XImage from "./XImage";

const XAvatar = ({
	size = 30,
	color,
	style,
	imgPath,
	initials,
	outline = false,
	round = false,
	local = false
}) => {

	const styles = useThemedStyle(styleCreator, color, round, outline);

	return (
		<View
			width={size}
			height={size}
			style={[styles.avatar, style]}
		>
			{imgPath ?
				<XImage
					imgPath={imgPath}
					local={local}
					style={styles.img}
				/>
				:
				<View style={styles.text}>
					<XText light size={Math.floor(size * 0.47)}>{initials}</XText>
				</View>
			}
		</View >
	);
};

const styleCreator = (theme, color, round, outline) => StyleSheet.create({
	text: {
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'lightcoral',
		flex: 1
	},
	avatar: {
		borderRadius: round === true ? 100 : Theme.values.borderRadius,
		justifyContent: 'center',
		borderColor: color || theme.colors.primary,
		overflow: 'hidden',
		borderWidth: outline ? Theme.values.borderWidth : 0
	},
	img: {
		flex: 1
	}
})

export default XAvatar;