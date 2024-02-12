import { useState } from "react";
import XScreen from "xapp/src/components/XScreen";
import XButton from "xapp/src/components/basic/XButton";
import XTextInput from "xapp/src/components/basic/XTextInput";
import { useTranslation } from "xapp/src/i18n/I18nContext";
import { Http } from 'xapp/src/common/Http';
import { emptyFn } from "xapp/src/common/utils";
import XSection from "xapp/src/components/basic/XSection";
import { APP_STATUS } from "xapp/src/common/general";
import XAlert from "xapp/src/components/basic/XAlert";
import { Theme } from "xapp/src/style/themes";

const CancelAppointmentScreen = ({ navigation, route }) => {

	const t = useTranslation();
	const [statusComment, setStatusComment] = useState('');
	const appId = route.params.appId;
	const status = route.params.status

	const changeStatus = () => {
		XAlert.askEdit(() => {
			const newStatus = status === APP_STATUS.ACCEPTED ? APP_STATUS.CANCELED : APP_STATUS.DROPPED;
			Http.post(`/appointment/${appId}/edit-status`, {
				appointmentstatus: { name: newStatus },
				statusComment: statusComment
			})
				.then(() => navigation.goBack())
				.catch(emptyFn);
		})
	};

	return (
		<XScreen rowGap={20}>
			<XSection
				title={t(status === APP_STATUS.WAITING ? 'Withdrawing reason' : 'Cancelation reason')}
				transparent
			>
				<XTextInput
					textarea
					outline
					value={statusComment}
					clearable
					onClear={() => setStatusComment('')}
					onChangeText={setStatusComment}
				/>
			</XSection>

			<XButton
				colorName={Theme.vars.red}
				secondary
				title={t(status === APP_STATUS.WAITING ? 'Withdraw' : 'Cancel')}
				onPress={changeStatus}
			/>
		</XScreen>
	);
};

export default CancelAppointmentScreen;