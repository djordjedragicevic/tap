import XScreen from "xapp/src/components/XScreen";
import XButton from "xapp/src/components/basic/XButton";
import { useTranslation } from "xapp/src/i18n/I18nContext";
import { useCallback } from "react";
import { Http } from "xapp/src/common/Http";
import { storeDispatch, useStore } from "xapp/src/store/store";
import { MAIN_TAB_MY_APPOINTMENTS } from "../navigators/routes";
import Footer from "../components/Footer";
import AppointmentInfo from "../components/AppointmentInfo";
import { DateUtils } from "xapp/src/common/utils";

const BookAppointmentScreen = ({ navigation, route }) => {
	const t = useTranslation();
	const mask = useStore(gS => gS.app.maskShown);
	const app = route.params.app;
	const provider = route.params.provider;

	const onBookPress = useCallback(() => {
		storeDispatch('app.mask', { maskText: t('Booking') + '...' });
		Http.post('/appointment/book', app)
			.then(() => {
				storeDispatch('app.mask', false);
				navigation.navigate(MAIN_TAB_MY_APPOINTMENTS);
			})
			.catch(() => storeDispatch('app.mask', false));

		return () => storeDispatch('app.mask', true);

	}, [app]);

	return (
		<XScreen
			scroll
			loading={mask}
			Footer={(
				<Footer>
					<XButton
						primary
						title={t('Confirm')}
						style={{ flex: 1 }}
						onPress={onBookPress}
					/>
				</Footer>
			)}>
			<AppointmentInfo
				providerName={provider.name}
				providerType={provider.type}
				providerAddress={provider.address}
				providerCity={provider.city}
				timeFrom={app.services[0].time}
				timeTo={DateUtils.getTimeFromDateTime(new Date(
					new Date(app.date + 'T' + app.services[app.services.length - 1].time).getTime()
					+
					(app.services[app.services.length - 1].service.duration * 60 * 1000)
				))}
				date={app.date}
				services={app.services.map(s => ({
					id: s.service.id,
					name: s.service.name,
					price: s.service.price,
					employeeName: s.employee.name,
					start: s.time
				}))}
			/>
		</XScreen>
	);
}

export default BookAppointmentScreen;