import { StyleSheet, TouchableOpacity, View } from "react-native";
import XText from "./XText";
import { usePrimaryColor, useThemedStyle } from "../../style/ThemeContext";
import XIcon from "./XIcon";

const XLink = ({ onPress, disabled, rightArrow, children, style, ...rest }) => {

	const styles = useThemedStyle(styleCreator);
	const pColor = usePrimaryColor();

	return (
		<TouchableOpacity onPress={onPress} disabled={disabled} style={styles.container}>
			<XText style={[styles.text, style]} {...rest}>
				{children}
			</XText>
			{
				!!rightArrow &&
				<View style={styles.arrow}>
					<XIcon icon={'arrowright'} color={pColor} size={12} />
				</View>
			}
		</TouchableOpacity>
	);
}

const styleCreator = (theme) => StyleSheet.create({
	arrow: {
		marginTop: 3,
		marginStart: 3,
		alignItems: 'center',
		justifyContent: 'center'
	},
	container: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	text: {
		color: theme.colors.primary,
		textDecorationLine: 'underline',
	}
})

export default XLink;