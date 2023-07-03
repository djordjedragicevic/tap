import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { emptyFn } from "../../common/utils";
import { useThemedStyle } from "../../style/ThemeContext";
import XCheckBox from "../basic/XCheckBox";

const ListItemBasic = ({ children, id, onPress = emptyFn, selected = false }) => {
	const styles = useThemedStyle(createStyle);
	return (
		<TouchableOpacity key={id} style={styles.item} onPress={onPress}>
			<>
				<XCheckBox isChecked={selected} size={14} />
				{children}
			</>
		</TouchableOpacity>
	);
};

const createStyle = (theme) => StyleSheet.create({
	item: {
		height: 45,
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: theme.colors.backgroundElement
	}
});

export default React.memo(ListItemBasic);