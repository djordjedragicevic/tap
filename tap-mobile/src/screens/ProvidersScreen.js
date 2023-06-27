import { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Http, useInitializer } from "../common/Http";
import XText from "../components/basic/XText";
import XChip from "../components/basic/XChip";
import Screen from "../components/Screen";
import { PROVIDER_SCREEN } from "../navigators/routes";
import HeaderDrawerButton from "../components/HeaderDrawerButton";
import XSection from "../components/basic/XSection";
import { values } from "../style/themes";
import { Image } from 'expo-image';
import { API_URL, HOST } from "../common/config";
import Icon from 'react-native-vector-icons/Ionicons';
import XSeparator from "../components/basic/XSeparator";
import { useAsyncData, useAsyncGetData } from "../common/hook";

const ProvidersScreen = ({ navigation }) => {


	const [providers] = useAsyncGetData(['/provider/list', { cId: 1 }], []);


	useEffect(() => {
		navigation.setOptions({
			headerLeft: () => <HeaderDrawerButton navigation={navigation} />
		});
	}, []);

	const renderCompany = useCallback(({ item, index }) => {

		return (
			<XSection
				onPress={() => navigation.navigate(PROVIDER_SCREEN, { id: item.id, companyName: item.name, companyTypeName: item.typeName })}
				style={{
					padding: 0,
					marginBottom: 15,
					elevation: 2
				}}
			>
				<View style={{
					overflow: 'hidden'
				}}>
					<Image
						source={`${HOST}/images/${index % 2 > 0 ? 'kallos.jpg' : 'djole.jpg'}`}
						contentFit='fill'
						height={150}
					/>
				</View>

				<View style={{ flex: 1 }}>

					<View style={{ padding: 10 }}>
						<XText numberOfLines={1} adjustsFontSizeToFit style={styles.title}>{item.name}</XText>


						<View style={{ alignItems: 'center', flexDirection: 'row' }}>
							{/* <View style={{ alignContent: 'center', justifyContent: 'center', padding: 10 }}>
								<Icon name="location" size={20} color='steelblue' />
							</View> */}
							<XText secondary numberOfLines={1} adjustsFontSizeToFit style={{}}>{item.address1 + ', ' + item.city}</XText>
						</View>
					</View>

					{/* <XSeparator margin={0} /> */}

					<View style={{ padding: 10, alignItems: 'flex-end', justifyContent: 'center' }}>
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
				data={providers}
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
		fontSize: 22,
		fontStyle: 'italic'
	},
	title: {
		fontSize: 25,
		fontWeight: 'normal'
	}
});

export default ProvidersScreen;