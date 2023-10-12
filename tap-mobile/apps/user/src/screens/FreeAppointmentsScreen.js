import { ScrollView, StyleSheet, View, useWindowDimensions } from "react-native";
import { Http } from "xapp/src/common/Http";
import XScreen from "xapp/src/components/XScreen";
import XText from "xapp/src/components/basic/XText";
import XSection from "xapp/src/components/basic/XSection";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "xapp/src/i18n/I18nContext";
import XFieldDatePicker from "xapp/src/components/basic/XFieldDataPicker";
import { useThemedStyle } from "xapp/src/style/ThemeContext";
import { Theme } from "xapp/src/style/themes";
import XButton from "xapp/src/components/basic/XButton";
import XSelector from "xapp/src/components/basic/XSelector";
import Footer from "../components/Footer";
import { AntDesign } from '@expo/vector-icons';
import { BOOK_APPOINTMENT_SCREEN } from "../navigators/routes";


const FREE_APP_WIDTH = 66;
const FREE_APP_COL_GAP = 6;

const getEmptyApps = (appLength, width) => {
	const emptyApps = [];
	const numOfCols = Math.floor((width - (Theme.values.mainPaddingHorizontal * 2) - FREE_APP_COL_GAP) / (FREE_APP_WIDTH + (FREE_APP_COL_GAP / 2)));
	const numOfEmptyApps = numOfCols - (appLength - (Math.floor(appLength / numOfCols) * numOfCols));
	for (let i = 0; i < numOfEmptyApps; i++)
		emptyApps.push(<View key={'emptyApp_' + i} style={{ width: FREE_APP_WIDTH }} />);

	return emptyApps;
};

const FreeAppointmentsScreen = ({ navigation, route: { params: { services, providerId } } }) => {

	const [data, setData] = useState();
	const [loading, setLoading] = useState(true);
	const [selectedEmps, setSelectedEmps] = useState({});
	const [date, setDate] = useState(new Date());
	const [selectedApp, setSelectedApp] = useState(null);
	const t = useTranslation();
	const styles = useThemedStyle(styleCreator);
	const { width } = useWindowDimensions();

	useEffect(() => {

		setLoading(true);

		let finish = true;

		Http.get('/appointments/free', {
			s: services,
			emps: services.map(s => selectedEmps[s]?.id || -1),
			p: providerId,
			d: date
		}).then(resp => {
			if (finish)
				setData(resp);
		}).finally(() => setLoading(false));

		return () => finish = false;
	}, [selectedEmps, date]);

	useEffect(() => {
		return () => setLoading(false);
	}, []);
	useEffect(() => {
		setSelectedApp(null);
	}, [data]);

	const bookBtnRightIcon = useCallback((color, size) => <AntDesign color={color} size={size} name="arrowright" />, []);
	if (!data || !Object.keys(data).length)
		return null;


	return (
		<XScreen
			loading={loading}
			Footer={(
				<Footer>
					<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
						<XText light bold size={16}>{selectedApp?.services[0]?.time || '-'}</XText>
					</View>
					<XButton
						title={t('Book')}
						primary
						style={{ flex: 1 }}
						disabled={!selectedApp}
						iconRight={bookBtnRightIcon}
						onPress={() => navigation.navigate(BOOK_APPOINTMENT_SCREEN, { app: selectedApp, provider: data.provider })}
					/>
				</Footer>
			)}
		>

			<XFieldDatePicker
				fieldStyle={styles.datePicker}
				onConfirm={setDate}
				initDate={date}
				preventPast
			/>

			{
				data.apps.length === 0 ?
					<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
						<XText>{data.message || 'No appointments'}</XText>
					</View>
					:
					<ScrollView>
						<View style={{
							flexWrap: 'wrap',
							flexDirection: 'row',
							flex: 1,
							columnGap: FREE_APP_COL_GAP,
							rowGap: 10,
							justifyContent: 'space-around'

						}}>
							{data
								.apps
								.map(a =>
									<XButton
										key={a.id}
										title={a.services[0].time}
										textStyle={selectedApp?.id === a.id ? styles.appTextSelected : styles.appText}
										style={styles.freeAppointment}
										primary={selectedApp?.id === a.id}
										onPress={() => setSelectedApp((curr) => {
											if (curr?.id === a.id)
												return null;
											else
												return a;
										})}
									/>
								)
								.concat(getEmptyApps(data.apps.length, width))
							}

						</View>
					</ScrollView>
			}

			<XSection transparent
				title={t('Services')}
				style={{ marginTop: 10 }}
				styleContent={{ rowGap: 5 }}
			>
				{data.serEmps.map(({ ser, emps }) => (
					<XSelector
						title={ser.name}
						value={selectedEmps[ser.id]?.name || t('First free')}
						key={ser.id}
						selector={{
							title: t('Select employee')
						}}
						data={[{
							id: -1,
							title: t('First free'),
							serviceId: ser.id
						}].concat(
							emps.map(e => ({
								id: e.id,
								title: e.name,
								serviceId: ser.id
							})))
						}
						onItemSelect={({ id, serviceId, title }) => {
							setSelectedEmps(curr => ({
								...curr,
								[serviceId]: { id, name: title }
							}));
						}}
					/>
				))}
			</XSection>
		</XScreen >
	);
};

const styleCreator = (theme) => StyleSheet.create({
	datePicker: {
		marginBottom: 10
	},
	freeAppointment: {
		paddingHorizontal: 5,
		width: FREE_APP_WIDTH
	},
	appText: {
		color: theme.colors.textSecondary
	},
	appTextSelected: {
		color: theme.colors.textLight
	}
});

export default FreeAppointmentsScreen;