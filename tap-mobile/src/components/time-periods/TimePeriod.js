import React, { useCallback, useMemo } from "react";
import { StyleSheet, TouchableOpacity, } from "react-native";
import { calculateHeightDate, emptyFn } from "../../common/utils";
import { useThemedStyle } from "../../store/ThemeContext";
import XText from "../basic/XText";

const TimePeriod = ({ item, sizeCoef, onPress, children }) => {
	const styles = useThemedStyle(createStyle, item.subType);

	const dynStyles = useMemo(() => {
		return {
			height: calculateHeightDate(item.start, item.end, sizeCoef)
		}
	}, [item.start, item.end, sizeCoef])

	const onPressHandler = useCallback(() => onPress(item), []);

	return (
		<TouchableOpacity style={[styles.item, dynStyles]} onPress={onPressHandler}>
			<XText light>{item.type + '   ' + item.subType} </XText>
			{children}
		</TouchableOpacity >
	);
};

const createStyle = (theme, periodSubType) => StyleSheet.create({
	item: {
		backgroundColor: theme.periodColors[periodSubType],
		borderWidth: 1,
		width: '100%',
		//position: 'absolute',
		borderRadius: 10,
		alignItems: 'center',
		justifyContent: 'center'
	}
});

TimePeriod.defaultProps = {
	onPress: emptyFn
};

export default React.memo(TimePeriod);