import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text } from "react-native";
import { Http } from "../common/Http";
import XButton from "../components/basic/XButton";
import XText from "../components/basic/XText";
import Card from "../components/card/Card";
import Screen from "../components/Screen";
import { useTranslation } from "../store/I18nContext";

const CompanyListScreen = () => {
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

	const renderCompany = ({ item, idx }) => {
		console.log(item);
		return (
			<Card>
				<XText>{item.typeName}</XText>
				<XText>{item.name}</XText>
				<XText>{item.addressStreet + ' ' + item.addressNumber}</XText>
				<XButton title={t('Appointments').toUpperCase()} />
			</Card>
		);
	};

	return (
		<Screen style={styles.container}>
			<FlatList
				data={companies}
				renderItem={renderCompany}
			/>
		</Screen>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingVertical: 4
	}
});

export default CompanyListScreen;