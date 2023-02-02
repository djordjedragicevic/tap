import React, { useCallback, useContext, useMemo } from "react";
import { StyleSheet, TouchableOpacity, } from "react-native";
import { calculateHeightDate, calculateTopDate, emptyFn, getUserDisplayName } from "../../common/utils";
import I18nContext from "../../store/I18nContext";
import { useThemedStyle } from "../../store/ThemeContext";
import XText from "../basic/XText";

const formatTime = (dtString, loc) => {
	return new Date(dtString).toLocaleTimeString(loc, { hour: '2-digit', minute: '2-digit' });
};

const TimePeriod = ({ item, sizeCoef, offset, onPress, children }) => {
	console.log(offset);
	const styles = useThemedStyle(createStyle, item.subType);
	const { lng } = useContext(I18nContext);

	const dynStyles = useMemo(() => {
		return {
			height: calculateHeightDate(item.start, item.end, sizeCoef),
			top: calculateTopDate(item.start, offset, sizeCoef)
		}
	}, [item.start, item.end, sizeCoef])

	const onPressHandler = useCallback(() => onPress(item), []);

	return (
		<TouchableOpacity style={[styles.item, dynStyles]} onPress={onPressHandler}>
			<XText light>{getUserDisplayName(item)} </XText>
			<XText light>{formatTime(item.start, lng.code) + ' - ' + formatTime(item.end, lng.code)} </XText>
			{children}
		</TouchableOpacity>
	);
};

const createStyle = (theme, periodSubType) => StyleSheet.create({
	item: {
		backgroundColor: theme.periodColors[periodSubType],
		borderWidth: 1,
		width: '100%',
		opacity: 0.5,
		position: 'absolute',
		borderRadius: 10,
		alignItems: 'center',
		justifyContent: 'center'
	}
});

TimePeriod.defaultProps = {
	onPress: emptyFn
};

export default React.memo(TimePeriod);