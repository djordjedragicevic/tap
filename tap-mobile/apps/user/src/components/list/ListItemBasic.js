import React from "react";
import { Pressable, StyleSheet, TouchableOpacity } from "react-native";
import { emptyFn } from "../../common/utils";
import { useThemedStyle } from "../../style/ThemeContext";
import XCheckBox from "../basic/XCheckBox";

const ListItemBasic = ({ children, id, onPress = emptyFn, selected = false }) => {
	const styles = useThemedStyle(createStyle);
	return (
		<Pressable key={id} style={styles.item} onPress={onPress}>
			<>
				<XCheckBox isChecked={selected} size={16} />
				{children}
			</>
		</Pressable>
	);
};

const createStyle = (theme) => StyleSheet.create({
	item: {
		height: 60,
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: theme.colors.backgroundElement
	}
});

export default ListItemBasic;