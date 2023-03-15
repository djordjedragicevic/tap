import { Pressable, StyleSheet } from "react-native";
import { useThemedStyle } from "../../store/ThemeContext";
import Icon from 'react-native-vector-icons/FontAwesome';
import React, { useCallback, useEffect, useState } from "react";


const XCheckBox = ({ isChecked, onChange }) => {

	const [checked, setChecked] = useState(isChecked);

	useEffect(() => {
		onChange(checked);
	}, [checked])

	useEffect(() => {
		setChecked(isChecked);
	}, [isChecked])

	const styles = useThemedStyle(createStyle);
	const onPress = useCallback(() => {
		setChecked(old => !old);
	}, []);


	return (
		<Pressable style={[styles.checkbox, checked ? styles.checked : styles.unchecked]} onPress={onPress}>
			{checked && <Icon name="check" size={10} color={styles.icon.color} />}
		</Pressable>
	)
};

XCheckBox.defaultProps = {
	isChecked: false,
	onChange: function () { }
};

const createStyle = (theme) => StyleSheet.create({
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
		width: 18,
		height: 18,
		marginHorizontal: 5,
		borderRadius: 5,
		borderWidth: theme.values.borderWidth,
	},
	icon: {
		color: theme.colors.textLight
	}

});

export default React.memo(XCheckBox);