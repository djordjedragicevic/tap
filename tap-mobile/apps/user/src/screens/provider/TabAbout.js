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
import { useThemedStyle } from "xapp/src/style/ThemeContext";


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

	return (
		<ScrollView contentContainerStyle={styles.container}>

			<XSection>
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
								<View style={styles.dayRow}>
									<View style={styles.dayRowDay}>
										<View style={{ width: 20 }}>
											{isDay && <View style={[styles.dayDot, { backgroundColor: isWork ? 'hsl(120, 100%, 80%)' : 'red' }]} />}
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
								{idx < 6 && <XSeparator margin={5} />}
							</View>
						)
					})}
				</View>
			</XSection>
		</ScrollView >
	);
};

const styleCreator = () => StyleSheet.create({
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
		padding: 8,
		justifyContent: 'space-between'
	},
	dayRowDay: {
		flexDirection: 'row',
		alignSelf: 'flex-start',
		alignItems: 'center',
		justifyContent: 'center'
	},
	dayDot: {
		width: 10,
		height: 10,
		borderRadius: 50
	}
});

export default TabAbout;