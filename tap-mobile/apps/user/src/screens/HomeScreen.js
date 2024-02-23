import XScreen from "xapp/src/components/XScreen";
import XText from "xapp/src/components/basic/XText";
import { FlatList, Image, Pressable, StyleSheet, View, useWindowDimensions } from "react-native";
import XImage from "xapp/src/components/basic/XImage";
import { Theme } from "xapp/src/style/themes";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { useTranslation } from "xapp/src/i18n/I18nContext";
import { useThemedStyle } from "xapp/src/style/ThemeContext";
import { Http } from "xapp/src/common/Http";
import { emptyFn } from "xapp/src/common/utils";
import { PROVIDER_ICON } from "../common/general";
import XFieldContainer from "xapp/src/components/basic/XFieldContainer";
import XButtonIcon from "xapp/src/components/basic/XButtonIcon";
import XAvatar from "xapp/src/components/basic/XAvatar";
import XSection from "xapp/src/components/basic/XSection";
import ProviderCard from "../components/ProviderCard";
import { LOGIN_SCREEN, MAIN_TAB_FIND, MANAGE_ACCOUNT_SCREEN, PROVIDER_SCREEN } from "../navigators/routes";
import { useIsUserLogged } from '../store/concreteStores';
import XIcon from "xapp/src/components/basic/XIcon";
import { useStore } from "xapp/src/store/store";


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

	const imgPath = useStore(gS => gS.user.imgPath);
	const initials = useStore(gS => gS.user.initials);
	const displayName = useStore(gS => gS.user.displayName);
	const userLogged = useIsUserLogged();

	const styles = useThemedStyle(styleCreator);
	const t = useTranslation();

	const { width } = useWindowDimensions();

	const onUserPress = useCallback(() => {
		navigation.navigate(userLogged ? MANAGE_ACCOUNT_SCREEN : LOGIN_SCREEN);
	}, [navigation, userLogged])

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
				<Pressable
					onPress={onUserPress}
					style={{
						flexDirection: 'row',
						columnGap: 10,
						margin: 5,
						alignItems: 'center',
						justifyContent: 'center'
					}}
				>
					{
						userLogged ?
							<>
								<XAvatar size={50} initials={initials} imgPath={imgPath} outline round />
								<XText size={20} style={{ flex: 1 }} light oneLine>{t('Hello {:user}', { user: displayName })}</XText>
							</>
							:
							<>
								<XButtonIcon onPress={onUserPress} icon='user' size={50} primary style={{ borderRadius: 100 }} />
								<XText flex={false} icon rightIcon={'arrowright'} size={20} light>{t('Sign in')}</XText>
							</>
					}
				</Pressable>

				<XFieldContainer
					onPress={() => navigation.navigate(MAIN_TAB_FIND, { focusSearch: true })}
					outline
					iconLeft='search1'
					iconLeftColor={Theme.Light.colors.textTertiary}
					iconRightColor={Theme.Light.colors.textTertiary}
					style={{ borderRadius: 15, maxWidth: 270, marginTop: 16 }}
				>
					<XText style={{ textAlign: 'center' }}>{t('Find service or provider')}</XText>
				</XFieldContainer>
			</View>


			<View
				style={{ marginTop: -75, minHeight: 190 }}
			>
				<View style={{ paddingTop: 5, paddingBottom: 15, paddingStart: 15 }}>
					<XText size={16} light>{t('Categories')}</XText>
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
										style={{
											flex: 1,
											opacity: item.providerCount ? 1 : 0.3
										}}
									/>
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
				<XText size={16}>{t('Prominent')}</XText>
			</View>
			<FlatList
				horizontal
				data={prominentProviders}
				contentContainerStyle={{ gap: 10, paddingHorizontal: 10 }}
				showsHorizontalScrollIndicator={false}
				renderItem={({ item }) => {
					return (
						<ProviderCard
							item={item}
							style={{ flex: 1, minWidth: width - (width / 3) }}
							onPress={(itemData) => navigation.navigate(PROVIDER_SCREEN, { item: itemData })}
						/>
					)
				}}
			/>

			{/* <View style={{ padding: 10, paddingStart: 15 }}>
				<XText size={16}>{t('Prominent')}</XText>
			</View>


			<View
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