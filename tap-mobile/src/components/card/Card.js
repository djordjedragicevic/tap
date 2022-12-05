import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useThemedStyle } from "../../store/ThemeContext";
import XMask from "../basic/XMask";
import HairDryer from "../images/HairDryer";

const Card = ({ children, disabled, onPress }) => {
	const styles = useThemedStyle(createStyle);
	return (
		<TouchableOpacity style={styles.container} onPress={onPress}>
			<XMask enabled={disabled} />
			<View style={{ flexDirection: 'row' }}>
				<View>
					<View style={{ backgroundColor: '#4d4d4d', padding: 15, borderRadius: 10 }}>
						<HairDryer color={styles.image.color} width={80} height={80} />
					</View>
				</View>
				<View style={{ flex: 1, justifyContent: 'space-evenly', marginLeft: 8 }}>
					{children}
				</View>
			</View>
			<View>
			</View>
		</TouchableOpacity>
	);
};

Card.defaultProps = {
	disabled: false,
	onPress: () => { }
};

const createStyle = (theme) => StyleSheet.create({
	container: {
		height: 160,
		padding: 8,
		elevation: 1,
		marginHorizontal: theme.values.mainPaddingHorizontal,
		marginVertical: 4,
		borderRadius: theme.values.borderRadius,
		backgroundColor: theme.colors.backgroundElement
	},
	image: {
		color: theme.colors.primary
	}
});

export default Card;