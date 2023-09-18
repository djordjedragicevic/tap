import React, { useCallback, useContext, useMemo } from "react";
import { StyleSheet, TouchableOpacity, } from "react-native";
import { HOUR_HEIGHT } from "../../common/general";
import { calculateHeightFromDate, calculateTopFromDate, emptyFn, getUserDisplayName } from "../../common/utils";
import { useThemedStyle } from "../../style/ThemeContext";
import XText from "../basic/XText";
import I18nContext from "../../i18n/I18nContext";


const formatTime = (dtString, loc) => {
	return new Date(dtString).toLocaleTimeString(loc, { hour: '2-digit', minute: '2-digit' });
};

const TimePeriod = ({ item, sizeCoef, offset, from, onPress, children, style }) => {
	const styles = useThemedStyle(createStyle, item.subType);
	const { lng } = useContext(I18nContext);

	const dynStyles = useMemo(() => {
		return {
			height: calculateHeightFromDate(item.start, item.end, sizeCoef),
			top: calculateTopFromDate(item.start, sizeCoef * (HOUR_HEIGHT / 2), sizeCoef, from)
		}
	}, [item.start, item.end, sizeCoef])

	const onPressHandler = useCallback(() => onPress(item), []);

	return (
		<TouchableOpacity style={[styles.item, dynStyles, style]} onPress={onPressHandler}>
			<XText light>{getUserDisplayName(item)} </XText>
			<XText light>{formatTime(item.start, lng.code) + ' - ' + formatTime(item.end, lng.code)} </XText>
			{children}
		</TouchableOpacity>
	);
};

const createStyle = (theme, periodSubType) => StyleSheet.create({
	item: {
		backgroundColor: theme.periodColors[periodSubType],
		width: '100%',
		opacity: 0.75,
		position: 'absolute',
		borderRadius: 8,
		alignItems: 'center',
		justifyContent: 'center'
	}
});

TimePeriod.defaultProps = {
	onPress: emptyFn
};

export default React.memo(TimePeriod);