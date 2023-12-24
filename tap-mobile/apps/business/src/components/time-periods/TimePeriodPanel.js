import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { DateUtils, emptyFn } from "xapp/src/common/utils";
import XText from "xapp/src/components/basic/XText";
import { useThemedStyle } from "xapp/src/style/ThemeContext";
import { Theme } from "xapp/src/style/themes";
import TimePeriod from "./TimePeriod";

const HOUR_HEIGHT = 60;
const CT_HEIGHT = 10;
const CT_DOT_SIZE = 8;

const findOverlapIndex = (tps, idx) => {
	const tP = tps[idx];
	for (let i = idx - 1; i >= 0; i--) {
		if (DateUtils.isTimeBefore(tP.start, tps[i].end))
			return i;
	}
	return -1;
};


const arrangeTimeline = (tl, zoomCoef, rowHCoef, topOffset) => {
	const resp = [];
	const groups = {};
	let g = {
		id: '',
		start: '',
		end: '',
		columns: []
	};

	let gIdx = 0;

	let tmpC;
	let tmpOver;
	let tmpOverIdx;

	for (let i = 0, s = tl.length; i < s; i++) {
		tmpC = tl[i];
		tmpOverIdx = findOverlapIndex(tl, i);

		if (tmpOverIdx === -1) {
			g = {
				id: 'g' + (++gIdx),
				start: tmpC.start,
				end: tmpC.end,
				columns: [[tmpC]]
			};
			groups[g.id] = g;
			resp.push(g);
			tmpC._gId = g.id;
		}
		else {
			tmpOver = tl[tmpOverIdx];
			groups[tmpOver._gId].end = tmpC.end;
			tmpC._gId = tmpOver._gId;
			let addedInC = false;
			for (let c of groups[tmpOver._gId].columns) {
				if (!DateUtils.isTimeBefore(tmpC.start, c[c.length - 1].end)) {
					c.push(tmpC);
					addedInC = true;
					break;
				}
			}
			if (!addedInC)
				groups[tmpOver._gId].columns.push([tmpC]);
		}
	}

	Object.values(groups).forEach(g => {
		g.top = ((DateUtils.getMinutesOfDay(g.start) * rowHCoef) * zoomCoef) + topOffset;
		g.height = DateUtils.timeDuration(g.start, g.end) * rowHCoef * zoomCoef;
	});

	return resp;
};


const CurrentTime = memo(({ zoomCoef, topOffset, rowHCoef }) => {

	const styles = useThemedStyle(createStyle);

	const [date, setDate] = useState(new Date());

	useEffect(() => {
		const intId = setInterval(() => setDate(new Date()), 60000);
		return () => clearInterval(intId);
	}, []);

	const top = useMemo(() => {
		return (((date.getHours() * 60) + date.getMinutes()) * zoomCoef * rowHCoef) + topOffset - (CT_HEIGHT / 2);
	}, [date, rowHCoef, zoomCoef, topOffset]);

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

const Gropu = ({ children, top, height }) => {
	return (
		<View
			style={{
				position: 'absolute',
				flexDirection: 'row',
				height,
				top,
				end: 5,
				start: 5
			}}>
			{children}
		</View>
	);
};

const Column = ({ children }) => {
	return (
		<View style={{ flex: 1 }}>
			{children}
		</View>
	);
};

const TimePeriodsPanel = ({
	zoomCoef = 1,
	showCurrentTime = true,
	startHour = 0,
	endHour = 23,
	hourHeight = HOUR_HEIGHT,
	timeline = [],
	style,
	refreshing = false,
	showFreeTime = false,
	onRefresh = emptyFn,
	onItemPress = emptyFn
}) => {
	const styles = useThemedStyle(createStyle);

	const rowHeight = useMemo(() => zoomCoef * hourHeight, [zoomCoef])
	const rowHCoef = useMemo(() => (hourHeight / 60), [hourHeight]);
	const hours = useMemo(() => DateUtils.getDayHours(startHour, endHour), [startHour, endHour]);
	const topOffset = useMemo(() => ((hourHeight * startHour * zoomCoef) * -1) + ((hourHeight / 2) * zoomCoef), [hourHeight, startHour, zoomCoef]);
	const arrangedItems = useMemo(() => arrangeTimeline(timeline, zoomCoef, rowHCoef, topOffset), [timeline, zoomCoef, rowHCoef, topOffset]);

	return (
		<ScrollView
			refreshControl={
				<RefreshControl
					refreshing={refreshing}
					onRefresh={onRefresh}
				/>
			}
		>
			<View style={[styles.container, style]}>
				<View style={styles.rowLeftContainer}>
					{hours.map(h => <RowLeft key={h} height={rowHeight} hour={h} />)}
				</View>
				<View style={styles.rowRightContainer}>
					{hours.map(h => <RowRight key={h} height={rowHeight} />)}

					{arrangedItems?.map((group) => {
						return (
							<Gropu
								key={group.id}
								height={group.height}
								top={group.top}
							>
								{group.columns.map((c, cIdx) => (
									<Column key={`${group.id}_${cIdx.toString()}`}>
										{c.map(cI => {
											return (
												<TimePeriod
													key={cI.id}
													item={cI}
													height={DateUtils.timeDuration(cI.start, cI.end) * rowHCoef * zoomCoef}
													top={DateUtils.timeDuration(group.start, cI.start) * rowHCoef * zoomCoef}
													onPress={onItemPress}
													showFreeTime={showFreeTime}
												/>
											)
										})}
									</Column>
								))}
							</Gropu>
						)
					})}

					{showCurrentTime &&
						<CurrentTime
							zoomCoef={zoomCoef}
							topOffset={topOffset}
							rowHCoef={rowHCoef}
						/>
					}
				</View>
			</View>
		</ScrollView>
	)
};

const createStyle = (theme) => StyleSheet.create({
	container: {
		flexDirection: 'row',
		flex: 1
	},
	rowLeftContainer: {
		marginHorizontal: Theme.values.mainPaddingHorizontal
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