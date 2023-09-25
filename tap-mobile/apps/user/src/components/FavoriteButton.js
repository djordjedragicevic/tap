import { Pressable } from "react-native";
import { emptyFn } from "xapp/src/common/utils";
import { AntDesign } from '@expo/vector-icons';
import { Theme } from "xapp/src/style/themes";


const FavoriteButton = ({ favorit = false, onPress = emptyFn, color = 'red', style }) => {
	return (
		<Pressable
			style={[{ borderRadius: Theme.values.borderRadius, padding: 5, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }, style]}
			onPress={onPress}
		>
			{favorit ?
				<AntDesign name="heart" size={23} color={color} style={{ flex: 1 }} />
				:
				<AntDesign name="hearto" size={23} color={color} style={{ flex: 1 }} />
			}
		</Pressable>
	)
};

export default FavoriteButton;