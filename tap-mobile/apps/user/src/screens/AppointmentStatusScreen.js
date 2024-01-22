import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { Http } from "xapp/src/common/Http";
import { APP_STATUS, APP_STATUS_ICON } from "xapp/src/common/general";
import { CurrencyUtils, DateUtils, emptyFn } from "xapp/src/common/utils";
import XScreen from "xapp/src/components/XScreen";
import XButton from "xapp/src/components/basic/XButton";
import XText from "xapp/src/components/basic/XText";
import { useDateCode, useTranslation } from "xapp/src/i18n/I18nContext";
import { Theme } from "xapp/src/style/themes";
import XSection from "xapp/src/components/basic/XSection";
import XSeparator from "xapp/src/components/basic/XSeparator";
import XTextInput from "xapp/src/components/basic/XTextInput";
import { STATUS_COLOR } from "../common/general";
import XChip from "xapp/src/components/basic/XChip";

const ChangeStatusSection = ({ status, appointmentId, navigation }) => {
	const t = useTranslation();
	const [comment, setComment] = useState('');

	const changeStatus = (newStatus) => {

		Http.post(`/appointment/${appointmentId}/edit-status`,
			{
				appointmentstatus: { name: newStatus },
				statusComment: comment
			})
			.then(() => navigation.goBack())
			.catch(emptyFn);
	};

	const btnData = useMemo(() => {
		if (status === APP_STATUS.ACCEPTED) {
			return {
				title: 'Cancel',
				color: Theme.vars.red,
				onPress: () => changeStatus(APP_STATUS.CANCELED)
			}
		}
		else if (status === APP_STATUS.WAITING) {
			return {
				title: 'Withdraw',
				color: Theme.vars.secondary,
				onPress: () => changeStatus(APP_STATUS.DROPPED)
			}
		}

	}, [status, comment]);


	if (!btnData)
		return null;

	return (
		<>
			<XSeparator margin={10} style={{ marginBottom: 10, marginTop: 20 }} />

			<XTextInput
				title={t('Comment')}
				outline
				fieldStyle={{ flex: 1, textAlignVertical: 'top', paddingVertical: 10 }}
				fieldContainerStyle={{ height: 80 }}
				value={comment}
				multiline
				clearable
				onClear={() => setComment('')}
				onChangeText={setComment}
			/>

			<XButton
				style={{ marginTop: 10 }}
				colorName={btnData.color}
				secondary
				uppercase={false}
				title={t(btnData.title)}
				onPress={btnData.onPress}
			/>
		</>
	)
};


const AppointmentStatusScreen = ({ navigation, route }) => {

	const id = route.params.id;

	const [data, setData] = useState({
		service: {},
		employee: {}
	});
	const t = useTranslation();
	const dateCode = useDateCode();

	useEffect(() => {
		Http.get(`/appointment/${id}`)
			.then(setData)
			.catch(emptyFn);
	}, []);


	return (
		<XScreen style={{ borderWidth: 0 }}>
			<XSection styleContent={{ padding: 10 }}>

				<View style={{ flexDirection: 'row', justifyContent: 'space-between', columnGap: 5, borderWidth: 0 }}>
					<View style={{ flex: 1 }}>
						<XText bold size={20}>{data.service.name}</XText>
					</View>
					<View style={{ paddingStart: 5, paddingTop: 3 }}>
						<XText size={16} secondary>{data.employee.name}</XText>
					</View>
				</View>

				<View style={{ flexDirection: 'row', marginTop: 3 }}>
					<XText>{new Date(data.start).toLocaleDateString(dateCode, { day: 'numeric', month: 'short', year: 'numeric' })}  {DateUtils.getTimeFromDateTimeString(data.start)} - {DateUtils.getTimeFromDateTimeString(data.end)} {'(' + data.service.duration + ' ' + t('min') + ')'}</XText>
				</View>

				<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 30 }}>

					<View style={{ flex: 1, alignItems: 'flex-start', rowGap: 3 }}>
						<XChip
							color={STATUS_COLOR[data.status]}
							text={t(data.status)}
							textProps={{ bold: true }}
							icon={APP_STATUS_ICON[data.status]}
							style={{ height: 30, paddingStart: 10, paddingEnd: 12 }}
						/>
						{
							data.statusComment && <XText style={{ marginStart: 5 }} secondary italic>- {data.statusComment}</XText>
						}
					</View>

					<View style={{ paddingStart: 5 }}>
						<XText bold size={16} colorPrimary>{CurrencyUtils.convert(data.service.price)}</XText>
					</View>
				</View>

			</XSection>



			<ChangeStatusSection status={data.status} appointmentId={id} navigation={navigation} />

		</XScreen>
	);
}

export default AppointmentStatusScreen;