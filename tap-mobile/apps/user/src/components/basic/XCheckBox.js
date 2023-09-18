import { Pressable, StyleSheet } from "react-native";
import { useThemedStyle } from "../../style/ThemeContext";
import Icon from 'react-native-vector-icons/AntDesign';
import React from "react";
import { emptyFn } from "../../common/utils";
import { Theme } from "../../style/themes";


const XCheckBox = ({ checked = false, setChecked = emptyFn, size = 12, round = false }) => {

	const styles = useThemedStyle(createStyle, size, round);

	return (
		<Pressable style={[styles.checkbox, checked ? styles.checked : styles.unchecked]} onPress={setChecked}>
			{checked && <Icon name="check" size={size} color={styles.icon.color} />}
		</Pressable>
	)
};

const createStyle = (theme, size, round) => StyleSheet.create({
	checked: {
		backgroundColor: theme.colors.primary,
		borderColor: theme.colors.primary

	},
	unchecked: {
		borderColor: theme.colors.textTertiary
	},
	checkbox: {
		alignItems: 'center',
		justifyContent: 'center',
		width: size + 8,
		height: size + 8,
		borderRadius: round ? 100 : Theme.values.borderRadius,
		borderWidth: Theme.values.borderWidth,
	},
	icon: {
		color: theme.colors.textLight
	}

});

export default React.memo(XCheckBox);