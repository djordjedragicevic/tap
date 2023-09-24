import { useCallback } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { useHTTPGet } from "xapp/src/common/Http";
import XText from "xapp/src/components/basic/XText";
import XScreen from "xapp/src/components/XScreen";
import { PROVIDER_SCREEN } from "../navigators/routes";
import XSection from "xapp/src/components/basic/XSection";
import { Theme } from "xapp/src/style/themes";
import { Image } from 'expo-image';
import { HOST } from "../common/config";
import HairSalon from "../components/svg/HairSalon";

const ProvidersScreen = ({ navigation }) => {

	const [providers, refresh, refreshing] = useHTTPGet('/provider/list', { cId: 1 }, []);

	const renderCompany = useCallback(({ item, index }) => {

		return (
			<XSection
				onPress={() => navigation.navigate(PROVIDER_SCREEN, { id: item.id })}
				style={{
					padding: 0,
					marginTop: 10,
					elevation: 2
				}}
			>
				<View style={{ overflow: 'hidden', height: 200 }}>
					{
						item.mainImg ?

							<Image
								source={`${HOST}${item.mainImg?.split(',')[0]}`}
								contentFit='cover'
								cachePolicy={'none'}
								style={{ flex: 1 }}
							/>
							:
							<View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
								<HairSalon height={100} width={150} />
							</View>
					}

				</View>

				<View style={{ flex: 1 }}>

					<View style={{ padding: 10 }}>
						<XText numberOfLines={1} adjustsFontSizeToFit style={styles.title}>{item.name}</XText>
						<View style={{ alignItems: 'center', flexDirection: 'row' }}>
							<XText secondary numberOfLines={1} adjustsFontSizeToFit style={{}}>{item.address1 + ', ' + item.city}</XText>
						</View>
					</View>

					<View style={{ padding: 10, alignItems: 'flex-end', justifyContent: 'center' }}>
						{
							index % 2 > 0 ?
								<>
									<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
										<View style={{ width: 10, height: 10, borderRadius: 50, backgroundColor: 'hsl(120, 100%, 80%)', marginEnd: 5 }} />
										<XText style={{ alignSelf: 'flex-end', fontWeight: '500' }}>{'Otvoreno'}<XText secondary style={{ fontStyle: 'italic', fontSize: 13 }}>{' - danas do 16:00h'}</XText></XText>
									</View>

								</>
								:
								<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
									<View style={{ width: 10, height: 10, borderRadius: 50, backgroundColor: 'red', marginEnd: 5 }} />
									<XText style={{ alignSelf: 'flex-end', fontWeight: '500' }}>{'Zatvoreno'}<XText secondary style={{ fontStyle: 'italic', fontSize: 13 }}>{' - otvara sutra u 8:00h'}</XText></XText>
								</View>

						}
					</View>
				</View>
			</XSection>

		);
	}, []);

	return (
		<XScreen flat>
			<FlatList
				style={{ paddingHorizontal: Theme.values.mainPaddingHorizontal }}
				data={providers}
				renderItem={renderCompany}
				refreshing={refreshing}
				onRefresh={refresh}
			/>
		</XScreen>
	);
};

const styles = StyleSheet.create({
	card: {
		height: 160,
		marginHorizontal: Theme.values.mainPaddingHorizontal,
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