import { CurrencyUtils } from "xapp/src/common/utils";
import XSection from "xapp/src/components/basic/XSection"
import XSelectField from "xapp/src/components/basic/XSelectField";
import { useDateCode, useTranslation } from "xapp/src/i18n/I18nContext";
import { FontAwesome } from '@expo/vector-icons';

const AppointmentInfo = ({
	providerName,
	providerType,
	providerAddress,
	providerCity,
	date,
	timeFrom,
	timeTo,
	services
}) => {

	const dCode = useDateCode();
	const t = useTranslation();
	const priceSum = services.map(s => s.price).reduce((acc, v) => acc + v, 0);

	const dateF = new Date(date).toLocaleDateString(dCode, {
		month: 'short',
		day: '2-digit',
		year: 'numeric'
	});

	return (
		<XSection
			title={t('Appointment review')}
			styleContent={{ rowGap: 5 }}
			style={{ padding: 0 }}
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
				value={providerName + ' - ' + providerType}
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
				title={t('Address')}
				value={providerAddress + ', ' + providerCity}
				valueParams={{ bold: true }}
			/>
			<XSelectField
				pressable={false}
				iconRight={null}
				vertical
				iconLeft='clockcircleo'
				iconLeftSize={24}
				style={{ height: 55 }}
				title={t('Appointment time')}
				titleParams={{ secondary: true }}
				value={dateF + ' ' + timeFrom + '-' + timeTo}
				valueParams={{ bold: true }}
			/>
			{services.map((s) => (
				<XSelectField
					key={s.id}
					iconLeft='tago'
					pressable={false}
					vertical
					style={{ height: 55 }}
					iconLeftSize={24}
					styleCenterContainer={{}}
					iconRight={null}
					title={t('Service')}
					titleParams={{ secondary: true }}
					value={s.start + ' ' + s.name + ' - ' + s.employeeName}
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
				title={t('Price')}
				titleParams={{ secondary: true }}
				value={CurrencyUtils.convert(priceSum)}
				valueParams={{ bold: true }}
			/>
		</XSection>
	)
};

export default AppointmentInfo;