import { CurrencyUtils, DateUtils } from "xapp/src/common/utils";
import XSection from "xapp/src/components/basic/XSection"
import XSelectField from "xapp/src/components/basic/XSelectField";
import { useDateCode, useTranslation } from "xapp/src/i18n/I18nContext";
import { FontAwesome } from '@expo/vector-icons';
import XFieldContainer from "xapp/src/components/basic/XFieldContainer";
import XChip from "xapp/src/components/basic/XChip";
import XText from "xapp/src/components/basic/XText";
import { View, StyleSheet } from "react-native";
import { APP_STATUS_COLOR, APP_STATUS_ICON } from "xapp/src/common/general";
import XMarkStars from "xapp/src/components/XMarkStars";
import { Theme } from "xapp/src/style/themes";

const generateAppTime = (data, dCode) => {
	if (!data.start)
		return '';

	return new Date(data.start).toLocaleDateString(dCode, { month: 'short', day: '2-digit', year: 'numeric' })
		+ ' '
		+ DateUtils.getTimeFromDateTimeString(data.start)
		+ '-'
		+ DateUtils.getTimeFromDateTimeString(data.end);
};

const AppointmentInfoSection = ({ data = {
	providerName: '',
	providerType: '',
	providerAddress: '',
	providerCity: '',
	services: [],
	_isHistory: false
} }) => {

	const dCode = useDateCode();
	const t = useTranslation();

	return (
		<XSection
			title={t('Appointment review')}
			titleRight={data._isHistory ? <XChip text={t('From history')} textProps={{ tertiary: true }} /> : null}
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
				value={data.providerName + ' - ' + data.providerType}
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
				value={data.providerAddress + ', ' + data.providerCity}
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
				value={generateAppTime(data, dCode)}
				valueParams={{ bold: true }}
			/>
			{data.services?.map((s) => (
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
				title={t(data.services?.length > 1 ? 'Price Sum' : 'Price')}
				titleParams={{ secondary: true }}
				value={CurrencyUtils.convert(data.services?.map(s => s.price).reduce((acc, v) => acc + v, 0))}
				valueParams={{ bold: true }}
			/>
			{
				data.status != null &&
				<XFieldContainer
					iconLeftSize={24}
					iconLeft={APP_STATUS_ICON[data.status]}
					iconLeftColorName={APP_STATUS_COLOR[data.status]}
				>
					<View>
						<XText secondary>{t('Status')}</XText>
						<XText bold colorName={APP_STATUS_COLOR[data.status]}>{t(data.status)}</XText>
					</View>
					{
						data.statusComment &&
						<View style={{ marginTop: 8 }}>
							<XText secondary>{data.statusComment}</XText>
						</View>
					}

				</XFieldContainer>
			}

			{
				!!data.mark &&
				<XFieldContainer
					iconLeftSize={26}
					iconLeft='staro'
				>
					<View style={{ flexDirection: 'row' }}>
						<View style={{ rowGap: 5 }}>
							<XText secondary>{t('Review')}</XText>
							<XMarkStars mark={data.mark} />
						</View>
						<View style={{ flexDirection: 'row', justifyContent: 'flex-end', flex: 1, alignItems: 'flex-end' }}>
							<XChip
								color={data.reviewApprovedAt ? Theme.vars.green : Theme.vars.orange}
								icon={data.reviewApprovedAt ? 'check' : 'hourglass'}
								text={t(data.reviewApprovedAt ? 'Approved' : 'Pending approval')}
							/>
						</View>
					</View>
					{
						data.reviewComment &&
						<View style={{ marginTop: 8 }}>
							<XText secondary>{data.reviewComment}</XText>
						</View>
					}
				</XFieldContainer>
			}

		</XSection>
	);
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

export default AppointmentInfoSection;