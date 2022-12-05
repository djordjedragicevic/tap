import { useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { Http } from "../common/Http";
import XButton from "../components/basic/XButton";
import XText from "../components/basic/XText";
import Card from "../components/card/Card";
import Screen from "../components/Screen";
import { APPOINTMENTS_SCREEN, COMPANY_SCREEN } from "../navigators/routes";
import { useTranslation } from "../store/I18nContext";

const CompaniesScreen = ({ navigation }) => {
	const [companies, setCompanies] = useState([]);
	const t = useTranslation();
	useEffect(() => {
		let process = true;
		Http.get('/company')
			.then(res => {
				if (process)
					setCompanies(res.data);
			});
		return () => process = false;
	}, []);

	const renderCompany = ({ item }) => {
		return (
			<Card onPress={() => navigation.navigate(COMPANY_SCREEN, { id: item.id })}>
				<XText>{item.typeName}</XText>
				<XText>{item.name}</XText>
				<XText>{item.addressStreet + ' ' + item.addressNumber}</XText>
				<XButton title={t('Appointments').toUpperCase()} onPress={() => navigation.navigate(APPOINTMENTS_SCREEN, { id: item.id })} />
			</Card>
		);
	};

	const keyExtractor = (item) => item.id;

	return (
		<Screen style={styles.container}>
			<FlatList
				data={companies}
				renderItem={renderCompany}
				keyExtractor={keyExtractor}
			/>
		</Screen>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingVertical: 4
	}
});

export default CompaniesScreen;