import { Pressable } from "react-native";
import { emptyFn } from "xapp/src/common/utils";
import { Ionicons } from '@expo/vector-icons';
import { Theme } from "xapp/src/style/themes";


const FavoriteButton = ({ favorit = false, onPress = emptyFn, color }) => {
	return (
		<Pressable
			style={{ borderRadius: Theme.values.borderRadius, padding: 5, backgroundColor: 'white' }}
			onPress={onPress}
		>
			{favorit ?
				<Ionicons name="heart" size={23} color="red" style={{ flex: 1 }} />
				:
				<Ionicons name="heart-outline" size={23} color={color} style={{ flex: 1 }} />
			}
		</Pressable>
	)
};

export default FavoriteButton;