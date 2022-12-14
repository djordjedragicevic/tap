import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useThemedStyle } from "../../store/ThemeContext";
import XMask from "../basic/XMask";
import HairDryer from "../images/HairDryer";

const Card = ({ children, disabled, onPress, image, style, contentStyle }) => {
	const styles = useThemedStyle(createStyle);
	return (
		<TouchableOpacity style={[styles.card, style]} onPress={onPress} disabled={disabled}>
			<XMask enabled={disabled} />
			<View style={[styles.container]}>
				{
					!!image &&
					<View>
						<View>
							{image}
						</View>
					</View>
				}
				<View style={[contentStyle]}>
					{children}
				</View>
			</View>
			<View>
			</View>
		</TouchableOpacity >
	);
};

Card.defaultProps = {
	disabled: false,
	onPress: function () { },
	image: null
};

const createStyle = (theme) => StyleSheet.create({
	card: {
		//height: 160,
		padding: 8,
		elevation: 1,
		marginHorizontal: theme.values.mainPaddingHorizontal,
		marginVertical: 4,
		borderRadius: theme.values.borderRadius,
		backgroundColor: theme.colors.backgroundElement
	},
	container: {
		flexDirection: 'row',
		flex: 1,
		//justifyContent: 'space-evenly', 
		//marginLeft: 8
	},
	image: {
		color: theme.colors.primary
	}
});

export default Card;