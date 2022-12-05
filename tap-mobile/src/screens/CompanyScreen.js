import Screen from "../components/Screen";
import XText from "../components/basic/XText";
import XButton from "../components/basic/XButton";
import { useTranslation } from "../store/I18nContext";
import { APPOINTMENTS_SCREEN } from "../navigators/routes";

const CompanyScreen = ({ navigation, route }) => {
	const t = useTranslation();

	return (
		<Screen center>
			<XText>CompanyScreen id: {route.params.id}</XText>
			<XButton title={t('Appointments')} onPress={() => navigation.navigate(APPOINTMENTS_SCREEN, { id: route.params.id })} />
		</Screen>
	);
}

export default CompanyScreen;