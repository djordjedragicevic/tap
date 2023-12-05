import XScreen from "xapp/src/components/XScreen";
import XText from "xapp/src/components/basic/XText";
import { useIsUserLogged } from "../store/concreteStores";
import XButton from "xapp/src/components/basic/XButton";
import I18n from "xapp/src/i18n/I18n";
import { useTranslation } from "xapp/src/i18n/I18nContext";
import { storeDispatch } from "xapp/src/store/store";
import { Http } from "xapp/src/common/Http";

const SettingsScreen = () => {
	const isLogged = useIsUserLogged();
	const t = useTranslation();

	const doLogout = () => {
		Http.post('/app/logout')
			.finally(() => {
				Http.removeToken();
				storeDispatch('user.logout');
			});
	};

	return (
		<XScreen>
			{isLogged &&
				<XButton
					bottom
					iconLeft='logout'
					textColor='red'
					title={t("Log out")}
					uppercase={false}
					style={{ marginTop: 15 }}
					onPress={doLogout}
				/>
			}
		</XScreen>
	);
}

export default SettingsScreen;