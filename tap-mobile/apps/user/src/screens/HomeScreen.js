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
import XButtonIcon from "xapp/src/components/basic/XButtonIcon";
import XAvatar from "xapp/src/components/basic/XAvatar";
import ProviderCard from "../components/ProviderCard";
import { LOGIN_SCREEN, MAIN_TAB_FIND, MANAGE_ACCOUNT_SCREEN, PROVIDER_SCREEN } from "../navigators/routes";
import { useIsUserLogged } from '../store/concreteStores';
import { storeDispatch, useStore } from "xapp/src/store/store";

const categoryPlaceholders = [
	{ id: 'ph1', imagePath: '' },
	{ id: 'ph2', imagePath: '' },
	{ id: 'ph3', imagePath: '' },
	{ id: 'ph4', imagePath: '' },
	{ id: 'ph5', imagePath: '' },
	{ id: 'ph6', imagePath: '' },
];


const HomeScreen = ({ navigation }) => {

	const providerTypes = useStore(gS => gS.app.providerTypes);
	const [prominentProviders, setProminentProviders] = useState([]);

	const imgPath = useStore(gS => gS.user.imgPath);
	const initials = useStore(gS => gS.user.initials);
	const displayName = useStore(gS => gS.user.displayName);
	const userLogged = useIsUserLogged();

	const styles = useThemedStyle(styleCreator);
	const t = useTranslation();

	const onUserPress = useCallback(() => {
		navigation.navigate(userLogged ? MANAGE_ACCOUNT_SCREEN : LOGIN_SCREEN);
	}, [navigation, userLogged])

	useEffect(() => {
		Http.get('/provider/type-list')
			.then(resp => {
				resp.forEach(r => r.iconName = r.imagePath.split('/').pop().split('.')[0]);
				storeDispatch('app.set_providerTypes', resp);
			})
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
								<XText size={18} style={{ flex: 1 }} light oneLine>{t('Hello {:user}', { user: displayName })}</XText>
							</>
							:
							<>
								<XButtonIcon onPress={onUserPress} icon='user' size={50} primary style={{ borderRadius: 100 }} />
								<XText flex={false} icon size={18} light>{t('Sign in')}</XText>
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
								disabled={!item.providerCount}
								style={{
									alignItems: 'center',
									width: 100,
									rowGap: 5,
								}}
								onPress={() => navigation.navigate(MAIN_TAB_FIND, { filter: { pt: { id: item.id, name: item.name } } })}
							>
								<View
									style={styles.categoryCnt}>
									<XImage
										source={PROVIDER_ICON[item.iconName]}
										style={{
											flex: 1,
											opacity: item.providerCount ? 1 : 0.2
										}}
									/>
									<View style={{
										position: 'absolute',
										top: 0,
										right: 0,
										width: 18,
										height: 18,
										alignItems: 'center',
										justifyContent: 'center',
										borderRadius: 3
									}}>
										<XText secondary size={11}>{item.providerCount}</XText>
									</View>
								</View>
								<XText
									size={13}
									adjustsFontSizeToFit
									style={{ textAlign: 'center', flex: 1 }}
								>
									{item.name}
								</XText>
							</Pressable>
						)
					}}
				/>
			</View>

			<View style={{ padding: 10, paddingStart: 20, marginTop: 10  }}>
				<XText size={20}>{t('Popular')}</XText>
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
							address1={null}
							style={{ width: 220 }}
							onPress={(itemData) => navigation.navigate(PROVIDER_SCREEN, { item: itemData })}
						/>
					)
				}}
			/>

			<View style={{ padding: 10, paddingStart: 20, marginTop: 20 }}>
				<XText size={20}>{t('Prominent')}</XText>
			</View>
			<FlatList
				horizontal
				data={prominentProviders.slice().reverse()}
				contentContainerStyle={{ gap: 10, paddingHorizontal: 10 }}
				style={{ marginBottom: 20 }}
				showsHorizontalScrollIndicator={false}
				renderItem={({ item }) => {
					return (
						<ProviderCard
							item={item}
							address1={null}
							style={{ width: 220 }}
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
								style={{ width: '100%', padding: 5 }}
							>
								<ProviderCard
									item={item}
									address1={null}
									style={{ flex: 1 }}
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