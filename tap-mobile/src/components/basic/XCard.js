import { useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useThemedStyle } from "../../store/ThemeContext";
import XMask from "./XMask";

const XCard = ({ children, style, disabled, onPress, disabledOpacity }) => {

	const styles = useThemedStyle(createStyle);

	return (

		onPress instanceof Function ?
			<>
				<TouchableOpacity style={[styles.card, style]} onPress={onPress}>
					{children}
					{disabled && <XMask opacity={disabledOpacity} />}
				</TouchableOpacity>
			</>
			:
			<View style={[styles.card, style]}>
				{children}
				{disabled && <XMask enabled />}
			</View>
	);
}

export default XCard;

XCard.defaultProps = {
	disabledOpacity: 0.5
};

const createStyle = (theme) => StyleSheet.create({
	card: {
		padding: 8,
		//elevation: 1,
		overflow: 'hidden',
		borderRadius: theme.values.borderRadius,
		backgroundColor: theme.colors.backgroundElement
	}
});
