import XScreen from "xapp/src/components/XScreen";
import XButton from "xapp/src/components/basic/XButton";
import XSection from "xapp/src/components/basic/XSection";
import { useDateCode, useTranslation } from "xapp/src/i18n/I18nContext";
import { CurrencyUtils } from "xapp/src/common/utils";
import XSelectField from "xapp/src/components/basic/XSelectField";
import { FontAwesome } from '@expo/vector-icons';
import { useCallback } from "react";
import { Http } from "xapp/src/common/Http";
import { storeDispatch, useStore } from "xapp/src/store/store";
import { MAIN_TAB_MY_APPOINTMENTS } from "../navigators/routes";
import Footer from "../components/Footer";

const BookAppointmentScreen = ({ navigation, route }) => {
	const t = useTranslation();
	const dCode = useDateCode();
	const mask = useStore(gS => gS.app.maskShown);

	const app = route.params.app;
	const provider = route.params.provider;
	const priceSum = app.services.map(s => s.service.price).reduce((acc, v) => acc + v, 0);
	const date = new Date(app.date);
	const time = app.services[0].time.split(':');

	date.setHours(time[0]);
	date.setMinutes(time[1]);

	const dTFormated = date.toLocaleDateString(dCode, {
		weekday: 'short',
		month: 'short',
		day: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false
	});

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
			<XSection
				title={t('Appointment review')}
				styleContent={{ rowGap: 5 }}
				style={{ padding: 5 }}
				styleTitle={{ alignItems: 'center' }}
				transparent
			>
				<XSelectField
					iconLeft='isv'
					pressable={false}
					iconRight={null}
					vertical
					iconLeftSize={24}
					style={{ height: 55 }}
					titleParams={{ secondary: true }}
					title={'Davalac usluga'}
					value={provider.name + ' ' + provider.type}
					valueParams={{ bold: true }}
				/>
				<XSelectField
					iconLeft='enviromento'
					pressable={false}
					iconRight={null}
					vertical
					style={{ height: 55 }}
					iconLeftSize={24}
					titleParams={{ secondary: true }}
					title={'Adresa'}
					value={provider.address + ', ' + provider.city}
					valueParams={{ bold: true }}
				/>
				<XSelectField
					pressable={false}
					iconRight={null}
					vertical
					iconLeft='clockcircleo'
					iconLeftSize={24}
					style={{ height: 55 }}
					title='Vrijeme termina'
					titleParams={{ secondary: true }}
					value={dTFormated}
					valueParams={{ bold: true }}
				/>
				{app.services.map(({ time, service, employee }) => (
					<XSelectField
						key={service.id}
						iconLeft='info'
						pressable={false}
						vertical
						style={{ height: 55 }}
						iconLeftSize={24}
						styleCenterContainer={{}}
						iconRight={null}
						title={'Servis'}
						titleParams={{ secondary: true }}
						value={time + ' ' + service.name + ' - ' + employee.name}
						valueParams={{ bold: true }}
					/>
				))}
				<XSelectField
					pressable={false}
					vertical
					style={{ height: 55 }}
					iconLeftSize={24}
					iconRight={null}
					iconLeft={(params) => (<FontAwesome name="money" {...params} />)}
					title={'Cijena'}
					titleParams={{ secondary: true }}
					value={CurrencyUtils.convert(priceSum)}
					valueParams={{ bold: true }}
				/>
			</XSection>
		</XScreen>
	);
}

export default BookAppointmentScreen;