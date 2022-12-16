import Screen from "../components/Screen";
import XText from "../components/basic/XText";
import XButton from "../components/basic/XButton";
import { useTranslation } from "../store/I18nContext";
import { APPOINTMENTS_SCREEN } from "../navigators/routes";
import { useEffect } from "react";
import { Http } from "../common/Http";

const CompanyScreen = ({ navigation, route }) => {
	const t = useTranslation();

	useEffect(() => {
		let finish = true;
		Http.get("/company/" + route.params.id)
			.then(res => console.log("RESPONSE", res));

		return () => finish = false;
	}, []);

	return (
		<Screen center>
			<XText>CompanyScreen id: {route.params.id}</XText>
			<XButton title={t('Appointments')} onPress={() => navigation.navigate(APPOINTMENTS_SCREEN, { id: route.params.id })} />
		</Screen>
	);
}

export default CompanyScreen;