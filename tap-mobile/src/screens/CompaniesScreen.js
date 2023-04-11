import { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { Http } from "../common/Http";
import XText from "../components/basic/XText";
import XChip from "../components/basic/XChip";
import Screen from "../components/Screen";
import { COMPANY_SCREEN } from "../navigators/routes";
import HeaderDrawerButton from "../components/HeaderDrawerButton";
import XSection from "../components/basic/XSection";
import { values } from "../style/themes";
import { Image } from 'expo-image';
import { API_URL, HOST } from "../common/config";
import Icon from 'react-native-vector-icons/Ionicons';
import XSeparator from "../components/basic/XSeparator";

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

	const renderCompany = useCallback(({ item, index }) => {

		return (
			<XSection
				onPress={() => navigation.navigate(COMPANY_SCREEN, { id: item.id, companyName: item.name, companyTypeName: item.typeName })}
				style={{
					//height: 250,
					padding: 0,
					marginBottom: 15,
					elevation: 2
				}}
			>
				<View style={{
					height: 150,
					//width: '100%'
					//width: 200,
					//borderRadius: 5,
					overflow: 'hidden'
				}}>
					<Image
						source={`${HOST}/images/${index % 2 > 0 ? 'capelli.jpg' : 'djole.jpg'}`}
						contentFit='fill'
						style={{
							flex: 1,
							opacity: 0.8
						}}
					/>
					{/* <View style={{ flex: 1, width: '100%', height: 150, backgroundColor: 'black', position: 'absolute', opacity: 0.2 }} />
					<View style={{ flex: 1, width: '100%', height: 150, backgroundColor: 'white', position: 'absolute', opacity: 0.2 }} /> */}
				</View>
				<View style={{ flex: 1 }}>
					<View style={{ padding: 10 }}>
						<View style={{ height: 40, justifyContent: 'center' }}>
							<XText numberOfLines={1} adjustsFontSizeToFit style={styles.title}>{'Muški i ženski frizerski Djole'}</XText>
						</View>
						<View style={{ alignItems: 'center', flexDirection: 'row', height: 20 }}>
							{/* <View style={{ alignContent: 'center', justifyContent: 'center', padding: 10 }}>
								<Icon name="location" size={20} color='steelblue' />
							</View> */}
							<XText secondary numberOfLines={1} adjustsFontSizeToFit style={{}}>{item.addressStreet + ' ' + item.addressNumber + ', Banja Luka'}</XText>
						</View>
					</View>
					<XSeparator margin={0} />
					<View style={{ padding: 10, alignItems: 'flex-end', height: 50, justifyContent: 'center' }}>
						{
							index % 2 > 0 ?
								<>
									<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
										<View style={{ width: 10, height: 10, borderRadius: 50, backgroundColor: 'hsl(120, 100%, 80%)', marginEnd: 5 }} />
										<XText style={{ alignSelf: 'flex-end', fontWeight: '500' }}>{'Otvoreno'}<XText secondary style={{ fontStyle: 'italic', fontSize: 13 }}>{' - danas do 16:00h'}</XText></XText>
									</View>
									{/* <XChip
										elevation={1}
										style={{
											backgroundColor: 'hsl(120, 100%, 90%)',
											shadowColor: 'hsl(120, 80%, 40%)',
											//borderWidth: 1
										}}>
										<XText style={{ alignSelf: 'flex-end', color: 'hsl(120, 100%, 35%)' }}>{'Otvoreno'}<XText secondary style={{ fontStyle: 'italic', fontSize: 13 }}>{' - danas do 16:00h'}</XText></XText>
									</XChip> */}
								</>
								:
								// <XChip style={{ backgroundColor: 'salmon', elevation: 1 }}>
								// 	<XText style={{ alignSelf: 'flex-end', color: 'darkred' }}>{'Zatvoreno - otvara sutra u 8:00h'}</XText>
								// </XChip>
								<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
									<View style={{ width: 10, height: 10, borderRadius: 50, backgroundColor: 'red', marginEnd: 5 }} />
									<XText style={{ alignSelf: 'flex-end', fontWeight: '500' }}>{'Zatvoreno'}<XText secondary style={{ fontStyle: 'italic', fontSize: 13 }}>{' - otvara sutra u 8:00h'}</XText></XText>
								</View>

						}
					</View>
					{/* <XText style={{ alignSelf: 'flex-end' }}>{4.8}</XText> */}
				</View>
			</XSection>

		);
	}, []);

	return (
		<Screen>
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
		fontSize: 22,
		fontWeight: '500'
	}
});

export default CompaniesScreen;