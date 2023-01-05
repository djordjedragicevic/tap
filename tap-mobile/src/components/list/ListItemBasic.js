import React, { useCallback } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { emptyFn } from "../../common/utils";
import { useThemedStyle } from "../../store/ThemeContext";
import XCheckBox from "../basic/XCheckBox";

const ListItemBasic = ({ selected, children, idx, onPress }) => {
	const styles = useThemedStyle(createStyle);
	const onPressHandler = useCallback(() => onPress(idx), []);
	return (
		<TouchableOpacity style={styles.item} onPress={onPressHandler}>
			<>
				<XCheckBox isChecked={selected} />
				{children}
			</>
		</TouchableOpacity>
	);
};

ListItemBasic.defaultProps = {
	selected: false,
	onPress: emptyFn
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