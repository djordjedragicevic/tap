import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { DateUtils } from "xapp/src/common/utils";
import XText from "xapp/src/components/basic/XText";
import { useThemedStyle } from "xapp/src/style/ThemeContext";
import { Theme } from "xapp/src/style/themes";
import TimePeriod from "./TimePeriod";

const HOUR_HEIGHT = 60;
const CT_HEIGHT = 10;
const CT_DOT_SIZE = 8;


const getDateState = () => {
	//const d = new Date('2020-05-12T14:00:00.000Z');
	const d = new Date();
	return {
		h: d.getHours(),
		m: d.getMinutes()
		//timeString: DateUtils.dateToTimeString(d, false)
	}
};



const CurrentTime = memo(({ sizeCoef, hourHeight, topOffset }) => {

	const styles = useThemedStyle(createStyle);

	const [dateState, setDateState] = useState(getDateState());

	useEffect(() => {
		const intId = setInterval(() => setDateState(getDateState()), 60000);
		return () => clearInterval(intId);
	}, []);

	const top = useMemo(() => {
		return (((dateState.h * hourHeight) + dateState.m + (hourHeight / 2) - (CT_HEIGHT / 2)) * sizeCoef) + topOffset;
	}, [dateState, hourHeight, topOffset]);

	return (
		<View style={[styles.currentTimeContainer, { top }]}>
			<View style={styles.currentTimeLineDot} />
			<View style={[styles.currentTimeLine]} />
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
			<View style={styles.hourSeparator} />
		</View>
	)
});

const TimePeriodsPanel = ({
	sizeCoef = 1,
	showCurrentTime = true,
	startHour = 0,
	endHour = 23,
	hourHeight = HOUR_HEIGHT,
	items = []
}) => {

	const styles = useThemedStyle(createStyle);
	const height = useMemo(() => sizeCoef * hourHeight, [sizeCoef])
	const hours = useMemo(() => DateUtils.getDayHours(startHour, endHour), [startHour, endHour]);
	const topOffset = useMemo(() => (hourHeight * startHour * sizeCoef) * -1, [hourHeight, startHour, sizeCoef]);

	const onItemPress = useCallback((item) => {
		console.log(item);
	}, []);

	return (
		<View style={[styles.container]}>
			<View style={styles.rowLeftContainer}>
				{hours.map(h => <RowLeft key={h} height={height} hour={h} />)}
			</View>
			<View style={styles.rowRightContainer}>
				{hours.map(h => <RowRight key={h} height={height} />)}
				{items.map((i) =>
					<TimePeriod
						key={`${i.data.id}#${i.name}`}
						item={i}
						height={DateUtils.calculateHeightFromTime(i.start, i.end) * sizeCoef}
						top={((DateUtils.getMinutesOfDay(i.start) + (hourHeight / 2)) * sizeCoef) + topOffset}
						onPress={onItemPress}
					/>)}
				{showCurrentTime &&
					<CurrentTime
						hourHeight={hourHeight}
						sizeCoef={sizeCoef}
						topOffset={topOffset}
					/>
				}
			</View>
		</View>
	)
};

const createStyle = (theme) => StyleSheet.create({
	container: {
		flexDirection: 'row',
		flex: 1
	},
	rowLeftContainer: {
		marginEnd: Theme.values.mainPaddingHorizontal
	},
	rowRightContainer: {
		flex: 1,
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

	currentTimeContainer: {
		position: 'absolute',
		height: CT_HEIGHT,
		flexDirection: 'row',
		alignItems: 'center',
		left: - (CT_DOT_SIZE / 2),
		right: 0
	},

	currentTimeLine: {
		flex: 1,
		height: 1,
		backgroundColor: theme.colors.primary,
	},
	currentTimeLineDot: {
		height: CT_DOT_SIZE,
		width: CT_DOT_SIZE,
		borderRadius: 50,
		backgroundColor: theme.colors.primary
	},
	currentTimeLineTriangle: {
		height: 0,
		width: 0,
		borderTopWidth: CT_DOT_SIZE,
		borderTopColor: 'transparent',
		borderBottomWidth: CT_DOT_SIZE,
		borderBottomColor: 'transparent',
		borderLeftWidth: CT_DOT_SIZE,
		borderLeftColor: theme.colors.red
	},
	hourSeparator: {
		height: 1,
		backgroundColor: theme.colors.borderColor
	}
});

TimePeriodsPanel.defaultProps = {
	showCurrentTime: true,
	startHour: 0
};

export default TimePeriodsPanel;