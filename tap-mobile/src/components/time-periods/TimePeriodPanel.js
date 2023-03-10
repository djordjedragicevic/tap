import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { HOUR_HEIGHT } from "../../common/general";
import { DateUtils } from "../../common/utils";
import { useThemedStyle } from "../../store/ThemeContext";

import XText from '../basic/XText';

const getDateState = () => {
	const d = new Date();
	return {
		h: d.getHours(),
		m: d.getMinutes(),
		timeString: DateUtils.dateToTimeString(d)
	}
};

const CurrentTime = memo(({ sizeCoef, startHour, timeLineStyle, timeTextStyle }) => {

	const styles = useThemedStyle(createStyle);

	const [dateState, setDateState] = useState(getDateState());

	useEffect(() => {
		const intId = setInterval(() => setDateState(getDateState()), 1000);
		return () => clearInterval(intId);
	}, []);

	const top = useMemo(() => {
		return (dateState.h * HOUR_HEIGHT * sizeCoef) + (dateState.m * sizeCoef) + ((HOUR_HEIGHT / 2) * sizeCoef) + (startHour > 0 ? ((24 - startHour) * HOUR_HEIGHT * sizeCoef) : 0);
	}, [dateState, startHour, sizeCoef]);

	return (
		<View style={[styles.hourLineContainer, { position: 'absolute', top }]}>
			<XText style={[styles.currentTimeText, timeTextStyle]}>{dateState.timeString}</XText>
			<View style={styles.currentTimeLineDot} />
			<View style={[styles.currentTimeLine, timeLineStyle]} />
		</View>
	)
});

const RowLeft = memo(({ height, hour }) => {
	const styles = useThemedStyle(createStyle);
	return (
		<View height={height} style={styles.rowLeft}>
			<XText secondary>{hour}</XText>
		</View>
	)
});

const RowRight = memo(({ height }) => {
	const styles = useThemedStyle(createStyle);
	return (
		<View height={height} style={styles.rowRight}>
			<View style={styles.hourLine} />
		</View>
	)
});

const TimePeriodsPanel = ({ sizeCoef, showCurrentTime, startHour, children }) => {

	const styles = useThemedStyle(createStyle);
	const height = useMemo(() => sizeCoef * HOUR_HEIGHT, [sizeCoef])
	return (
		<ScrollView>
			<View style={[styles.container]}>
				<View>
					{DateUtils.getDayHours(startHour).map(h => <RowLeft key={h} height={height} hour={h} />)}
				</View>
				<View style={styles.rowRightContainer}>
					{DateUtils.getDayHours(startHour).map(h => <RowRight key={h} height={height} />)}
					{children}
				</View>
			</View>
			{showCurrentTime && <CurrentTime key={'currentTime'} sizeCoef={sizeCoef} startHour={startHour} />}
		</ScrollView >
	)
};

const createStyle = (theme) => StyleSheet.create({
	container: {
		//backgroundColor: theme.colors.backgroundElement,
		flexDirection: 'row',
		padding: 10,
	},
	rowRightContainer: {
		flex: 1,
		marginStart: 10,
		borderStartWidth: 1,
		borderColor: theme.colors.borderColor
	},
	rowLeft: {
		alignItems: 'center',
		justifyContent: 'center'
	},
	rowRight: {
		justifyContent: 'center'
	},

	currentTimeLine: {
		marginEnd: 10,
		flex: 1,
		height: 1,
		backgroundColor: theme.colors.red,
	},
	currentTimeText: {
		paddingHorizontal: 10,
		color: theme.colors.red,
		//backgroundColor: theme.colors.backgroundElement
	},
	currentTimeLineDot: {
		height: 5,
		width: 5,
		borderRadius: 50,
		backgroundColor: theme.colors.red
	},

	hourLine: {
		height: 1,
		backgroundColor: theme.colors.borderColor
	},
	hourLineContainer: {
		flexDirection: 'row',
		alignItems: 'center'
	}
});

TimePeriodsPanel.defaultProps = {
	showCurrentTime: true,
	startHour: 0
};

export default TimePeriodsPanel;