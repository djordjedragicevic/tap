import { CurrencyUtils, DateUtils } from "xapp/src/common/utils";
import XSection from "xapp/src/components/basic/XSection"
import XSelectField from "xapp/src/components/basic/XSelectField";
import { useDateCode, useTranslation } from "xapp/src/i18n/I18nContext";
import { FontAwesome } from '@expo/vector-icons';
import XFieldContainer from "xapp/src/components/basic/XFieldContainer";
import XChip from "xapp/src/components/basic/XChip";
import XText from "xapp/src/components/basic/XText";
import { View, StyleSheet } from "react-native";

const AppointmentInfo = ({
	providerName,
	providerType,
	providerAddress,
	providerCity,
	date,
	timeFrom,
	timeTo,
	services,
	extraFields
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
				title={t('Appointment time')}
				titleParams={{ secondary: true }}
				value={dateF + ' ' + timeFrom + '-' + timeTo}
				valueParams={{ bold: true }}
			/>
			{services.map((s) => (
				<XFieldContainer
					key={s.id}
					iconLeft='tago'
					iconLeftSize={24}
				>
					<View>
						<XText secondary>{t('Service')}</XText>
						<XText bold>{s.name}</XText>
						{s.note && <XText secondary>{s.note}</XText>}
					</View>
					<View style={styles.serviceContainer}>
						<XChip
							textProps={{ bold: true, oneLine: true }}
							primary
							text={s.start}
						/>
						{s.duration && <XChip
							textProps={{ bold: true, oneLine: true }}
							primary
							text={DateUtils.formatDuration(s.duration)}
						/>}
						<XChip
							textProps={{ bold: true, oneLine: true }}
							primary
							text={CurrencyUtils.convert(s.price)}
						/>
						<XChip
							textProps={{ bold: true, oneLine: true }}
							primary
							text={s.employeeName}
						/>
					</View>
				</XFieldContainer>

			))}
			<XSelectField
				pressable={false}
				vertical
				iconLeftSize={24}
				iconRight={null}
				iconLeft={(params) => (<FontAwesome name="money" {...params} />)}
				title={t(services?.length > 1 ? 'Price Sum' : 'Price')}
				titleParams={{ secondary: true }}
				value={CurrencyUtils.convert(priceSum)}
				valueParams={{ bold: true }}
			/>

			{extraFields}
		</XSection>
	)
};

const styles = StyleSheet.create({
	serviceContainer: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		flex: 1,
		flexWrap: 'wrap',
		marginTop: 5,
		gap: 5
	}
});

export default AppointmentInfo;