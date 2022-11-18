import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useThemedStyle } from "../../store/ThemeContext";
import XText from "./XText";

const XButton = ({ title, onPress }) => {
	const styles = useThemedStyle(createStyle);

	return (
		<TouchableOpacity onPress={onPress} style={styles.button}>
			{!!title && <XText style={styles.text} secondary>{title}</XText>}
		</TouchableOpacity>
	);
};

const createStyle = (theme) => StyleSheet.create({
	button: {
		height: 30,
		backgroundColor: theme.colors.primary,
		borderRadius: theme.values.borderRadius,
		alignItems: 'center',
		justifyContent: 'center'
	},
	text: {
	}
});

export default XButton;