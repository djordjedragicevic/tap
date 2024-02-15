import { useCallback } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { useHTTPGet } from "xapp/src/common/Http";
import XText from "xapp/src/components/basic/XText";
import XImage from "xapp/src/components/basic/XImage";
import XScreen from "xapp/src/components/XScreen";
import { PROVIDER_SCREEN } from "../navigators/routes";
import XSection from "xapp/src/components/basic/XSection";
import { Theme } from "xapp/src/style/themes";
import HairSalon from "../components/svg/HairSalon";
import XSeparator from "xapp/src/components/basic/XSeparator";
import XMarkStars from "xapp/src/components/XMarkStars";
import { useThemedStyle } from "xapp/src/style/ThemeContext";

const ProvidersScreen = ({ navigation }) => {

	const [providers, refresh, refreshing] = useHTTPGet('/provider/list', { cId: 1 }, []);
	const styles = useThemedStyle(styleCreator);

	const renderCompany = useCallback(({ item, index }) => {
		return (
			<XSection
				onPress={() => navigation.navigate(PROVIDER_SCREEN, {
					item: {
						id: item.id,
						name: item.name,
						providerType: item.providerType,
						mark: item.mark,
						reviewCount: item.reviewCount,
						mainImg: item.mainImg
					}
				})}
				styleContent={styles.sectionContainer}
			>
				<View style={{ height: 150 }}>
					<View style={{ flex: 1 }}>
						{
							item.mainImg ?
								<XImage
									imgPath={item.mainImg?.split(',')[0]}
									contentFit='cover'
									style={{ flex: 1 }}
								/>
								:
								<View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
									<HairSalon height={100} width={150} />
								</View>
						}
					</View>
				</View>

				<View style={{ flex: 1, padding: 10 }}>

					<View style={{ marginBottom: 5, flexDirection: 'row' }}>
						<View style={{ flex: 1 }}>
							<XText style={styles.title} bold>
								{item.name}
							</XText>
							<XText secondary style={styles.titleType}>
								{item.providerType}
							</XText>
						</View>
					</View>

					<XMarkStars mark={item.mark} reviewCount={item.reviewCount} />

					<XSeparator style={{ marginVertical: 10 }} />

					<XText icon='enviroment' secondary style={{ marginStart: 6 }}>
						{item.address1}
					</XText>


					{/* <View style={{ padding: 10, alignItems: 'flex-end', justifyContent: 'center' }}>
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
					</View> */}
				</View>
			</XSection>

		);
	}, []);

	return (
		<XScreen loading={refreshing} flat>
			<FlatList
				contentContainerStyle={{
					paddingHorizontal: Theme.values.mainPaddingHorizontal,
					paddingTop: Theme.values.mainPaddingHorizontal,
					rowGap: Theme.values.mainPaddingHorizontal
				}}
				data={providers}
				renderItem={renderCompany}
				refreshing={refreshing}
				onRefresh={refresh}
			/>
		</XScreen>
	);
};

const styleCreator = (theme) => StyleSheet.create({
	titleType: {
		//fontSize: 18
	},
	title: {
		fontSize: 20
	},
	sectionContainer: {
		padding: 0
	}
});

export default ProvidersScreen;