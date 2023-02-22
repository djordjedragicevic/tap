import { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { Http } from "../common/Http";
import XText from "../components/basic/XText";
import Screen from "../components/Screen";
import { COMPANY_SCREEN } from "../navigators/routes";
import HeaderDrawerButton from "../components/HeaderDrawerButton";
import XCard from "../components/basic/XCard";
import { values } from "../style/themes";

const CompaniesScreen = ({ navigation }) => {
	const [companies, setCompanies] = useState([]);

	useEffect(() => {
		let process = true;
		Http.get('/company/list')
			.then(res => {
				if (process)
					setCompanies(res);
			});
		return () => process = false;
	}, []);


	useEffect(() => {
		navigation.setOptions({
			headerLeft: () => <HeaderDrawerButton navigation={navigation} />
		});
	}, []);

	const renderCompany = useCallback(({ item }) => {
		return (
			<XCard onPress={() => navigation.navigate(COMPANY_SCREEN, { id: item.id, companyName: item.name, companyTypeName: item.typeName })} style={styles.card}>
				<XText style={styles.titleType}>{item.typeName}</XText>
				<XText style={styles.title}>{item.name}</XText>
			</XCard>

		);
	}, []);

	return (
		<Screen flat>
			<FlatList
				data={companies}
				renderItem={renderCompany}
			/>
		</Screen>
	);
};

const styles = StyleSheet.create({
	card: {
		height: 160,
		marginHorizontal: values.mainPaddingHorizontal,
		marginTop: 6,
		alignItems: 'center',
		justifyContent: 'space-evenly',
		flex: 1
	},
	titleType: {
		fontSize: 22
	},
	title: {
		fontSize: 26,
		fontWeight: '500'
	}
});

export default CompaniesScreen;