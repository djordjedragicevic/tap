import { Pressable, StyleSheet } from "react-native";
import { useThemedStyle } from "../../style/ThemeContext";
import Icon from 'react-native-vector-icons/FontAwesome';
import React, { useCallback, useEffect, useState } from "react";


const XCheckBox = ({ isChecked, onChange, size = 10 }) => {

	const [checked, setChecked] = useState(isChecked);

	useEffect(() => {
		onChange(checked);
	}, [checked])

	useEffect(() => {
		setChecked(isChecked);
	}, [isChecked])

	const styles = useThemedStyle(createStyle, size);
	const onPress = useCallback(() => {
		setChecked(old => !old);
	}, []);


	return (
		<Pressable style={[styles.checkbox, checked ? styles.checked : styles.unchecked]} onPress={onPress}>
			{checked && <Icon name="check" size={size} color={styles.icon.color} />}
		</Pressable>
	)
};

XCheckBox.defaultProps = {
	isChecked: false,
	onChange: function () { }
};

const createStyle = (theme, size) => StyleSheet.create({
	checked: {
		backgroundColor: theme.colors.primary,
		borderColor: theme.colors.primary

	},
	unchecked: {
		borderColor: theme.colors.textSecondary
	},
	checkbox: {
		alignItems: 'center',
		justifyContent: 'center',
		width: size + 8,
		height: size + 8,
		marginHorizontal: 5,
		borderRadius: 5,
		borderWidth: theme.values.borderWidth,
	},
	icon: {
		color: theme.colors.textLight
	}

});

export default React.memo(XCheckBox);