import { Pressable, StyleSheet } from "react-native";
import { emptyFn } from "xapp/src/common/utils";
import { AntDesign } from '@expo/vector-icons';
import { Theme } from "xapp/src/style/themes";
import { usePrimaryColor, useThemedStyle } from "xapp/src/style/ThemeContext";


const FavoriteButton = ({ favorit = false, onPress = emptyFn, color, style, ...rest }) => {

	const pColor = usePrimaryColor();
	const styles = useThemedStyle(styleCreator);

	return (
		<Pressable
			hitSlop={10}
			style={[styles.btn, style]}
			onPress={onPress}
			{...rest}
		>
			{favorit ?
				<AntDesign name="heart" size={23} color={color || pColor} />
				:
				<AntDesign name="hearto" size={23} color={color || pColor} />
			}
		</Pressable>
	)
};

const styleCreator = (theme) => StyleSheet.create({
	btn: {
		borderRadius: Theme.values.borderRadius,
		padding: 7,
		backgroundColor: theme.colors.backgroundElement,
		alignItems: 'center',
		justifyContent: 'center'
	}
});


export default FavoriteButton;