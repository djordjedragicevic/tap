import { useEffect, useMemo, useState } from "react";
import { Http } from "xapp/src/common/Http";
import { APP_STATUS, APP_STATUS_ICON } from "xapp/src/common/general";
import { DateUtils, emptyFn } from "xapp/src/common/utils";
import XScreen from "xapp/src/components/XScreen";
import XButton from "xapp/src/components/basic/XButton";
import { useTranslation } from "xapp/src/i18n/I18nContext";
import { Theme } from "xapp/src/style/themes";
import XSeparator from "xapp/src/components/basic/XSeparator";
import XTextInput from "xapp/src/components/basic/XTextInput";
import AppointmentInfo from "../components/AppointmentInfo";
import XAlert from "xapp/src/components/basic/XAlert";
import { useColor } from "xapp/src/style/ThemeContext";
import { STATUS_COLOR } from "../common/general";
import { View } from "react-native";
import XFieldContainer from "xapp/src/components/basic/XFieldContainer";
import XText from "xapp/src/components/basic/XText";
import XSection from "xapp/src/components/basic/XSection";
import utils from "../common/utils";

const ChangeStatusSection = ({ status, appointmentId, navigation }) => {
	const t = useTranslation();
	const [comment, setComment] = useState('');

	const changeStatus = (newStatus) => {

		XAlert.askEdit(() => {
			Http.post(`/appointment/${appointmentId}/edit-status`, { appointmentstatus: { name: newStatus }, statusComment: comment })
				.then(() => navigation.goBack())
				.catch(emptyFn);
		})
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

			<XSection
				title={t('Comment')}
				transparent
			>
				<XTextInput
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
					title={t(btnData.title)}
					onPress={btnData.onPress}
				/>
			</XSection>
		</>
	)
};


const AppointmentScreen = ({ navigation, route }) => {

	const id = route.params.id;
	const t = useTranslation();

	const [data, setData] = useState({ services: [{ id: -1 }] });
	const statusColor = useColor(STATUS_COLOR[data.status]);

	useEffect(() => {
		Http.get(`/appointment/${id}`)
			.then(setData)
			.catch(emptyFn);
	}, []);

	console.log(utils.isHistoryServices(data?.start));

	if (!data)
		return null;

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
					duration: data.serviceDuration,
					employeeName: data.employeeName,
					note: data.serviceNote
				}]}
				extraFields={
					<XFieldContainer
						iconLeftSize={24}
						iconLeft={APP_STATUS_ICON[data.status]}
						iconLeftColor={statusColor}
					>
						<View>
							<XText secondary>{t('Status')}</XText>
							<XText bold color={statusColor}>{t(data.status)}</XText>
						</View>
						{
							data.statusComment &&
							<View style={{ marginTop: 8 }}>
								<XText secondary>{data.statusComment}</XText>
							</View>
						}

					</XFieldContainer>

				}
			/>



			{
				utils.isHistoryServices(data?.start) ?
					null
					:
					<ChangeStatusSection
						status={data.status}
						appointmentId={id}
						navigation={navigation}
					/>
			}

		</XScreen>
	);
}

export default AppointmentScreen;