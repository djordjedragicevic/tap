import { useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { DateUtils } from "xapp/src/common/utils";
import XAvatar from "xapp/src/components/basic/XAvatar";
import XSection from "xapp/src/components/basic/XSection";
import XText from "xapp/src/components/basic/XText";
import XLink from "xapp/src/components/basic/XLink";
import { useTranslation } from "xapp/src/i18n/I18nContext";
import { MAP_SCREEN } from "../../navigators/routes";
import { Foundation } from '@expo/vector-icons';
import XSeparator from "xapp/src/components/basic/XSeparator";
import { useColor, useThemedStyle } from "xapp/src/style/ThemeContext";
import { Theme } from "xapp/src/style/themes";


const mapWorkPeriods = (workPeriods) => {
	const wPMap = {
		1: false,
		2: false,
		3: false,
		4: false,
		5: false,
		6: false,
		7: false
	};

	workPeriods.forEach(p => {
		if (!wPMap[p.day])
			wPMap[p.day] = [];

		wPMap[p.day].push(p);
	});

	return wPMap;
};

const isOpened = (day, values) => {
	const d = new Date();
	const isDay = d.getDay() === parseInt(day);
	let isWorking = false;
	const current = d.getHours() + ':' + d.getMinutes();

	if (isDay && values) {
		for (let t of values) {
			if (DateUtils.isTimeBefore(current, t.endTime) && DateUtils.isTimeBefore(t.startTime, current)) {
				isWorking = true;
				break;
			}
		}
	}

	return [isDay, isWorking];

};


const TabAbout = ({ data = {}, navigation }) => {
	const t = useTranslation();
	const styles = useThemedStyle(styleCreator);

	const wPs = useMemo(() => mapWorkPeriods(data.workPeriods), [data?.workPeriods]);
	const [cGreen, cRed] = useColor(['green', 'red']);

	return (
		<ScrollView contentContainerStyle={styles.container}>

			{
				data.description &&
				<XSection>
					<XText style={styles.description}>{data.description}</XText>
				</XSection>
			}

			<XSection title={t('Address')}>
				<View style={styles.infoCont}>
					<XText icon={'enviroment'}>{data.address}, {data.city}</XText>

					{!!data?.phone && <XText icon={'phone'}>{data.phone}</XText>}
					{
						!!(data.lat && data.lon) &&
						<XLink
							icon={({ size, color }) => <Foundation name="map" size={size} color={color} />}
							onPress={() => navigation.navigate(MAP_SCREEN, {
								lat: data.lat,
								lon: data.lon,
								title: data.name,
								description: data.type
							})}
						>
							{t('Map')}
						</XLink>
					}
				</View>
			</XSection>

			<XSection
				title={t('Our team')}
				titleIcon='user'>
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={styles.teamCont}
				>
					{data.employees?.map(e => {
						return (
							<View key={e.id} style={styles.avatarCont}>
								<XAvatar
									size={50}
									outline
									round
									imgPath={e.imagePath}
									initials={e.name.substring(0, 1).toUpperCase()}
								/>
								<XText colorPrimary>{e.name}</XText>
							</View>
						)
					})}
				</ScrollView>
			</XSection>

			<XSection
				title={t('Working hours')}
				titleIcon='clockcircleo'
			>
				<View>
					{Object.keys(wPs).map((day, idx) => {
						const [isDay, isWork] = isOpened(day, wPs[day]);
						return (
							<View key={day}>
								<View style={[styles.dayRow, isDay && styles.dayRowCurrent, isDay && (isWork ? styles.currentDayOpened : styles.currentDayClosed)]}>
									<View style={styles.dayRowDay}>
										<View style={styles.dayDotCnt}>
											{isDay && <View style={[styles.dayDot, { backgroundColor: isWork ? cGreen : cRed }]} />}
										</View>

										<XText>{t(DateUtils.WEEK_DAY[day - 1])}</XText>
									</View>

									<View>
										{
											wPs[day] ?
												<View>
													{wPs[day].map((d) => {
														return <XText key={d.id}>{d.startTime} - {d.endTime}</XText>
													})}
												</View>
												:
												<XText>{t('Closed')}</XText>
										}
									</View>

								</View>
							</View>
						)
					})}
				</View>
			</XSection>
		</ScrollView >
	);
};

const styleCreator = (theme) => StyleSheet.create({
	container: {
		rowGap: 20,
		padding: 10
	},
	infoCont: {
		flex: 1,
		rowGap: 5
	},
	teamCont: {
		columnGap: 12,
		paddingHorizontal: 5
	},
	avatarCont: {
		alignItems: 'center',
		justifyContent: 'center'
	},
	dayRow: {
		flexDirection: 'row',
		padding: 6,
		marginBottom: 4,
		justifyContent: 'space-between',
		borderRadius: Theme.values.borderRadius,
		borderWidth: Theme.values.borderWidth,
		borderColor: theme.colors.borderColor
	},
	dayRowCurrent: {
		//borderColor: theme.colors.primary,
		//backgroundColor: theme.colors.primaryLight

	},
	currentDayClosed: {
		borderColor: theme.colors.red,
		backgroundColor: Theme.opacity(theme.colors.redLight, 0.7)

	},
	currentDayOpened: {
		borderColor: theme.colors.green,
		backgroundColor: Theme.opacity(theme.colors.greenLight, 0.7)
	},
	dayRowDay: {
		flexDirection: 'row',
		alignSelf: 'flex-start',
		alignItems: 'center',
		justifyContent: 'center'
	},
	dayDotCnt: {
		width: 15
	},
	dayDot: {
		width: 10,
		height: 10,
		borderRadius: 50
	},
	description: {
		textAlign: 'center',
		fontStyle: 'italic'
	}
});

export default TabAbout;