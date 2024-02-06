import { useEffect, useMemo, useState } from "react";
import { Http } from "xapp/src/common/Http";
import { APP_STATUS } from "xapp/src/common/general";
import { DateUtils, emptyFn } from "xapp/src/common/utils";
import XScreen from "xapp/src/components/XScreen";
import XButton from "xapp/src/components/basic/XButton";
import { useDateCode, useTranslation } from "xapp/src/i18n/I18nContext";
import { Theme } from "xapp/src/style/themes";
import XSeparator from "xapp/src/components/basic/XSeparator";
import XTextInput from "xapp/src/components/basic/XTextInput";
import AppointmentInfo from "../components/AppointmentInfo";

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
				color: Theme.vars.red,
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


const AppointmentScreen = ({ navigation, route }) => {

	const id = route.params.id;

	const [data, setData] = useState({ services: [{ id: -1 }] });

	useEffect(() => {
		Http.get(`/appointment/${id}`)
			.then(setData)
			.catch(emptyFn);
	}, []);


	return (
		<XScreen scroll>
			<AppointmentInfo
				providerName={data.providerName}
				providerType={data.providerType}
				providerAddress={data.providerAddress}
				providerCity={data.providerCity}
				timeFrom={(DateUtils.getTimeFromDateTimeString(data.start))}
				timeTo={DateUtils.getTimeFromDateTimeString(data.end)}
				date={data.start}
				services={[{
					id: id,
					name: data.serviceName,
					price: data.servicePrice,
					start: DateUtils.getTimeFromDateTimeString(data.start),
					employeeName: data.employeeName
				}]}
			/>

			<ChangeStatusSection
				status={data.status}
				appointmentId={id}
				navigation={navigation}
			/>

		</XScreen>
	);
}

export default AppointmentScreen;