import { useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useThemedStyle } from "../../store/ThemeContext";

const XCard = (props) => {

	const styles = useThemedStyle(createStyle);

	return (
		props.onPress instanceof Function ?
			<TouchableOpacity style={[styles.card, props.style]} onPress={props.onPress}>
				{props.children}
			</TouchableOpacity>
			:
			<View style={[styles.card, props.style]}>
				{props.children}
			</View>
	);
}

export default XCard;

const createStyle = (theme) => StyleSheet.create({
	card: {
		padding: 8,
		elevation: 1,
		borderRadius: theme.values.borderRadius,
		backgroundColor: theme.colors.backgroundElement
	}
});
