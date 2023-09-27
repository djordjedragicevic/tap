import { Pressable } from "react-native";
import { emptyFn } from "xapp/src/common/utils";
import { AntDesign } from '@expo/vector-icons';
import { Theme } from "xapp/src/style/themes";
import { usePrimaryColor } from "xapp/src/style/ThemeContext";


const FavoriteButton = ({ favorit = false, onPress = emptyFn, color, style }) => {

	const pColor = usePrimaryColor();
	return (
		<Pressable
			style={[{ borderRadius: Theme.values.borderRadius, padding: 7, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }, style]}
			onPress={onPress}
		>
			{favorit ?
				<AntDesign name="heart" size={23} color={color || pColor} style={{ flex: 1 }} />
				:
				<AntDesign name="hearto" size={23} color={color || pColor} style={{ flex: 1 }} />
			}
		</Pressable>
	)
};

export default FavoriteButton;