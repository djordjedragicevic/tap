import { useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { Http } from "../common/Http";
import XButton from "../components/basic/XButton";
import XText from "../components/basic/XText";
import Card from "../components/card/Card";
import Screen from "../components/Screen";
import { APPOINTMENTS_SCREEN, COMPANY_SCREEN } from "../navigators/routes";
import { useTranslation } from "../store/I18nContext";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { HeaderBackButton } from '@react-navigation/elements';
import HeaderDrawerButton from "../components/HeaderDrawerButton";

const CompaniesScreen = ({ navigation }) => {
	const [companies, setCompanies] = useState([]);
	const t = useTranslation();
	useEffect(() => {
		let process = true;
		Http.get('/company/list')
			.then(res => {
				if (process)
					setCompanies(res.data);
			});
		return () => process = false;
	}, []);


	useEffect(() => {
		navigation.setOptions({
			headerLeft: () => <HeaderDrawerButton navigation={navigation}/>
		});
	}, []);

	const renderCompany = ({ item }) => {
		return (
			<Card onPress={() => navigation.navigate(COMPANY_SCREEN, { id: item.id })} style={styles.card} contentStyle={styles.cardContent}>
				<XText style={styles.titleType}>{item.typeName}</XText>
				<XText style={styles.title}>{item.name}</XText>
				{/* <XText>{item.addressStreet + ' ' + item.addressNumber}</XText> */}
				{/* <XButton title={t('Appointments').toUpperCase()} onPress={() => navigation.navigate(APPOINTMENTS_SCREEN, { id: item.id })} /> */}
			</Card >
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
	},
	card: {
		height: 160
	},
	cardContent: {
		alignItems: 'center',
		justifyContent: 'space-evenly',
		flex: 1
	},
	titleType: {
		fontSize: 22
	},
	title: {
		fontSize: 26
	}
});

export default CompaniesScreen;