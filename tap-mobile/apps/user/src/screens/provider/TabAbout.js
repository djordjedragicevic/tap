import { useMemo } from "react";
import { ScrollView, View } from "react-native";
import { DateUtils } from "xapp/src/common/utils";
import XAvatar from "xapp/src/components/basic/XAvatar";
import XSection from "xapp/src/components/basic/XSection";
import XText from "xapp/src/components/basic/XText";
import { useTranslation } from "xapp/src/i18n/I18nContext";


const mapWorkPeriods = (workPeriods) => {
	const wPMap = {
		0: false,
		1: false,
		2: false,
		3: false,
		4: false,
		5: false,
		6: false
	};

	workPeriods.forEach(p => {
		if (!wPMap[p.day])
			wPMap[p.day] = [];

		wPMap[p.day].push(`${p.startTime}-${p.endTime}`);
	});

	return wPMap;
};


const TabAbout = ({ data = {} }) => {
	const t = useTranslation();

	const wPs = useMemo(() => mapWorkPeriods(data.workPeriods), [data?.workPeriods]);

	return (
		<ScrollView>

			<XSection title={"Address"}>
				<XText>{data.address}, {data.city}</XText>
				<XText>{data.phone}</XText>
			</XSection>

			<XSection title={"Our team"}>
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={{
						columnGap: 15,
						paddingHorizontal: 5
					}}
				>
					{data.employees?.map(e => {
						return (
							<View key={e.id} style={{ alignItems: 'center', justifyContent: 'center' }}>
								<XAvatar
									size={50}
									imgPath={e.imagePath}
									initials={e.name.substring(0, 1).toUpperCase()}
								/>
								<XText>{e.name}</XText>
							</View>
						)
					})}
				</ScrollView>
			</XSection>

			<XSection title={"Work time"}>
				{wPs &&
					<View style={{}}>
						{Object.keys(wPs).map(day => (
							<View key={day} style={{ flexDirection: 'row' }}>
								<View style={{ flex: 1 }}>
									<XText>{t(DateUtils.WEEK_DAY[day])}</XText>
								</View>
								<View style={{ flex: 1 }}>
									<XText>{wPs[day] ? wPs[day].join(', ') : t('Closed')}</XText>
								</View>
							</View>
						)
						)}
					</View>
				}
			</XSection>
		</ScrollView >
	);
};

export default TabAbout;