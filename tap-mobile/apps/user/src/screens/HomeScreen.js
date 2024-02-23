import XScreen from "xapp/src/components/XScreen";
import XText from "xapp/src/components/basic/XText";
import { FlatList, Image, Pressable, StyleSheet, View, useWindowDimensions } from "react-native";
import XImage from "xapp/src/components/basic/XImage";
import { Theme } from "xapp/src/style/themes";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "xapp/src/i18n/I18nContext";
import { useThemedStyle } from "xapp/src/style/ThemeContext";
import { Http } from "xapp/src/common/Http";
import { emptyFn } from "xapp/src/common/utils";
import { PROVIDER_ICON } from "../common/general";
import XFieldContainer from "xapp/src/components/basic/XFieldContainer";
import XAvatar from "xapp/src/components/basic/XAvatar";
import XSection from "xapp/src/components/basic/XSection";
import ProviderCard from "../components/ProviderCard";
import { MAIN_TAB_FIND, PROVIDER_SCREEN } from "../navigators/routes";


const categoryPlaceholders = [
	{ id: 'ph1', imagePath: '' },
	{ id: 'ph2', imagePath: '' },
	{ id: 'ph3', imagePath: '' },
	{ id: 'ph4', imagePath: '' },
	{ id: 'ph5', imagePath: '' },
	{ id: 'ph6', imagePath: '' },
];


const HomeScreen = ({ navigation }) => {

	const [providerTypes, setProviderTypes] = useState(categoryPlaceholders);
	const [prominentProviders, setProminentProviders] = useState([]);


	const styles = useThemedStyle(styleCreator);
	const t = useTranslation();
	const { width } = useWindowDimensions();


	useEffect(() => {
		Http.get('/provider/type-list')
			.then(setProviderTypes)
			.catch(emptyFn);

		Http.get('/provider/prominent-list')
			.then(setProminentProviders)
			.catch(emptyFn);
	}, []);


	return (
		<XScreen flat scroll>
			<View style={{
				backgroundColor: Theme.Light.colors.secondary,
				padding: 10,
				paddingHorizontal: 60,
				alignItems: 'center',
				height: 220,
				marginHorizontal: -50,
				borderBottomEndRadius: 150,
				borderBottomStartRadius: 150
			}}>
				<View style={{ flexDirection: 'row', columnGap: 10, alignItems: 'center' }}>
					<XAvatar size={50} initials={"AA"} outline round />
					<XText size={20} style={{ flex: 1 }} light oneLine>Dobar dan Djordje</XText>
				</View>
				<XFieldContainer
					onPress={() => navigation.navigate(MAIN_TAB_FIND)}
					outline
					iconLeft='search1'
					iconLeftColor={Theme.Light.colors.textTertiary}
					iconRightColor={Theme.Light.colors.textTertiary}
					style={{ borderRadius: 15, margin: 25 }}
				>
					<XText style={{ textAlign: 'center' }} >Pronađite uslugu ili ponudjaca</XText>
				</XFieldContainer>
			</View>



			<View
				style={{ marginTop: -75, height: 210 }}
			>
				<View style={{ paddingTop: 5, paddingBottom: 15, paddingStart: 15 }}>
					<XText size={16} light>Kategorije</XText>
				</View>

				<FlatList
					data={providerTypes}
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={{ gap: 15, paddingHorizontal: 10 }}
					renderItem={({ item }) => {
						return (
							<Pressable
								style={{
									alignItems: 'center',
									width: 100,
									rowGap: 5,
								}}
								onPress={() => navigation.navigate(MAIN_TAB_FIND)}
							>
								<View
									style={styles.categoryCnt}>
									<XImage
										source={PROVIDER_ICON[item.imagePath.split('/').pop().split('.')[0]]}
										//contentFit='scale-down'
										style={{
											// height: 40,
											// width: 40,
											flex: 1,
											opacity: item.providerCount ? 1 : 0.3
											//borderWidth: 1
										}} />
								</View>
								<XText
									size={13}
									adjustsFontSizeToFit
									style={{ textAlign: 'center', flex: 1 }}
								>
									{item.name} ({item.providerCount})
								</XText>
							</Pressable>
						)
					}}
				/>
			</View>

			<View style={{ padding: 10, paddingStart: 15 }}>
				<XText size={16}>Istaknuto</XText>
			</View>

			{/* <View
				style={{ paddingHorizontal: 5, flexDirection: 'row', flexWrap: 'wrap', flex: 1 }}>
				{
					prominentProviders?.map(item => {
						return (
							<View
								key={item.id}
								style={{ width: '50%', padding: 5 }}
							>
								<ProviderCard
									item={item}
									style={{
										flex: 1
									}}
									onPress={(itemData) => navigation.navigate(PROVIDER_SCREEN, { item: itemData })}
								/>
							</View>
						)
					})
				}
			</View> */}

			<FlatList
				horizontal
				data={prominentProviders}
				contentContainerStyle={{ gap: 5, paddingHorizontal: 10 }}
				showsHorizontalScrollIndicator={false}
				renderItem={({ item }) => {
					return (
						<ProviderCard
							item={item}
							style={{ flex: 1 }}
							onPress={(itemData) => navigation.navigate(PROVIDER_SCREEN, { item: itemData })}
						/>
					)
				}}
			/>

		</XScreen >
	);
};

const styleCreator = (theme) => {
	return StyleSheet.create({
		categoryCnt: {
			width: 100,
			height: 100,
			padding: 15,
			backgroundColor: theme.colors.backgroundElement,
			borderWidth: Theme.values.borderWidth,
			borderRadius: Theme.values.borderRadius,
			borderColor: theme.colors.borderColor,
			overflow: 'hidden'
		}
	});
}

export default HomeScreen;