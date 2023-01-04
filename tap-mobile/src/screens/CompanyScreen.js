import Screen from "../components/Screen";
import XText from "../components/basic/XText";
import XButton from "../components/basic/XButton";
import { useTranslation } from "../store/I18nContext";
import { APPOINTMENTS_SCREEN } from "../navigators/routes";
import { useCallback, useEffect, useState } from "react";
import { Http } from "../common/Http";
import XCard from "../components/basic/XCard";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { values } from "../style/themes";
import { useThemedStyle } from "../store/ThemeContext";

const Services = ({ services }) => {

	const styles = useThemedStyle(createServicesStyle);

	const renderItem = useCallback(({ item }) => {
		return (
			<TouchableOpacity style={{ height: 50, flexDirection: 'row', alignItems: 'center' }}>
				<>
					<View style={styles.checkbox} />
					<XText>{item.name}</XText>
					<XText> {item.duration.split(':')[1] + '(min)'}</XText>
					<View style={{ flex: 1 }} />
					<XText> {item.price} KM</XText>
				</>
			</TouchableOpacity>
		)
	}, []);

	return <FlatList
		data={services || []}
		renderItem={renderItem}
	/>

};

const createServicesStyle = (theme) => StyleSheet.create({
	checkbox: {
		width: 20,
		height: 20,
		marginHorizontal: 5,
		borderRadius: 50,
		borderWidth: theme.values.borderWidth,
		borderColor: theme.colors.borderColor
	}
})

const CompanyScreen = ({ navigation, route }) => {
	const [company, setCompany] = useState({
		name: ''
	});

	const t = useTranslation();

	useEffect(() => {
		let finish = true;
		Http.get("/company/" + route.params.id)
			.then(res => {
				if (finish)
					setCompany(res.data);
			});

		return () => finish = false;
	}, []);

	return (
		<Screen>
			<XCard>
				<XText style={{ fontWeight: '600' }}>{company.name}</XText>
				<XText>{company.typeName}</XText>
			</XCard>
			<Services services={company.services} />
			<XText>CompanyScreen id: {route.params.id}</XText>
			<XButton title={t('Appointments')} onPress={() => navigation.navigate(APPOINTMENTS_SCREEN, { id: route.params.id })} />
		</Screen>
	);
};

export default CompanyScreen;