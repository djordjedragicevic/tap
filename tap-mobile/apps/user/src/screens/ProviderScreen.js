
import XText from "xapp/src/components/basic/XText";
import XButton from "xapp/src/components/basic/XButton";
import { useCallback, useState } from "react";
import { Http } from "xapp/src/common/Http";
import { StyleSheet, View } from "react-native"
import { useTranslation } from "xapp/src/i18n/I18nContext";
import XChip from "xapp/src/components/basic/XChip";
import { useColor, useThemedStyle } from "xapp/src/style/ThemeContext";
import { Theme } from "xapp/src/style/themes";
import HairSalon from "../components/svg/HairSalon";
import { storeDispatch, useStore } from "xapp/src/store/store";
import { FREE_APPOINTMENTS_SCREEN } from "../navigators/routes";
import { AntDesign } from '@expo/vector-icons';
import Footer from "../components/Footer";
import { XTabView } from "xapp/src/components/tabview/XTabView";
import XImage from "xapp/src/components/basic/XImage";
import utils from "../common/utils";
import TabAbout from "./provider/TabAbout";
import TabServices from "./provider/TabServices";
import TabReviews from "./provider/TabReviews";
import XButtonIcon from "xapp/src/components/basic/XButtonIcon";
import { CurrencyUtils, emptyFn } from "xapp/src/common/utils";
import { useIsUserLogged } from "../store/concreteStores";
import { handleUnauth } from "../common/general";
import { useFocusEffect } from "@react-navigation/native";
import XHeaderButtonBackAbsolute from "xapp/src/components/XHeaderButtonBackAbsolute";

const HEADER_IMAGE_HEIGHT = 230;
const CNT_NEG_TOP_MARGIN = -20;
const CHIP_MARK_TOP_MARGIN = (Theme.values.chipHeight / 2 * -1) - CNT_NEG_TOP_MARGIN;

const getPriceSum = (selected) => {
	return selected?.length ? CurrencyUtils.convert(selected.map(s => s.price).reduce((accumulator, price) => accumulator + price, 0)) : '-';
};


const ProviderScreen = ({ navigation, route }) => {

	const t = useTranslation();
	const styles = useThemedStyle(styleCreator)
	const [pColor, sColor] = useColor(['primary', 'secondary']);

	const providerId = route.params.item.id;
	const [data, setData] = useState({ about: { ...route.params.item } });

	const [favoriteDisabled, setFavoriteDisabled] = useState(false);
	const [selectedServices, setSelectedServices] = useState([]);

	const userLoged = useIsUserLogged();

	const fProviders = useStore(st => st.user.state.favoriteProviders);
	const isFavorite = fProviders && fProviders.indexOf(providerId) > -1;

	const bookBtnRightIcon = useCallback((color, size) => <AntDesign color={color} size={size} name="arrowright" />, []);
	const onFooterClear = useCallback(() => setSelectedServices([]), []);

	const loadData = useCallback(() => {
		Http.get(`/provider/${providerId}`)
			.then(setData)
			.catch(emptyFn);
	}, []);

	useFocusEffect(loadData);

	const onFPress = () => {
		const newFavs = isFavorite ? fProviders.filter(pId => pId !== providerId) : [...(fProviders || []), providerId];
		setFavoriteDisabled(true);
		Http.post(`/user/state`, { favoriteProviders: newFavs })
			.then(() => storeDispatch(`user.favorite_${!isFavorite ? 'add' : 'remove'}`, providerId))
			.catch(emptyFn)
			.finally(() => setFavoriteDisabled(false));
	};

	return (
		<>
			<View style={{ height: HEADER_IMAGE_HEIGHT }}>
				{
					!!data?.about.mainImg &&
					<XImage
						imgPath={data.about.mainImg}
						style={styles.headerImage}
						contentFit="cover"
					/>
				}
				<XHeaderButtonBackAbsolute navigation={navigation} />

				<XButtonIcon
					icon={isFavorite ? 'heart' : 'hearto'}
					disabled={favoriteDisabled}
					color={pColor}
					backgroundColor={sColor}
					onPress={onFPress}
					style={styles.headerButtonRight}
					bgOpacity={0.6}
				/>

				<View style={styles.chipMark}>
					<XChip primary text={utils.generateMarkString(data?.about.mark, data?.about.reviewCount)} />
				</View>
			</View>

			<View style={styles.content}>

				<View style={styles.titleCnt}>
					<XText center bold size={20}>{data?.about.name}</XText>
					<XText secondary size={16}> {data?.about.providerType}</XText>
				</View>

				<XTabView
					routes={[
						{ key: 'about', title: t('About') },
						{ key: 'services', title: t('Services') },
						{ key: 'reviews', title: t('Reviews') }
					]}
					renderScene={({ route }) => {
						switch (route.key) {
							case 'about':
								return <TabAbout
									navigation={navigation}
									data={data}
								/>;
							case 'services':
								return <TabServices
									navigation={navigation}
									setSelected={setSelectedServices}
									selected={selectedServices}
									servicesRaw={data.services}
								/>;
							case 'reviews':
								return <TabReviews
									providerId={providerId}
									navigation={navigation}
									reload={data}
								/>;
						}
					}}
				/>
			</View>

			<Footer>

				<XButtonIcon
					disabled={!selectedServices?.length}
					icon='close'
					backgroundColor='transparent'
					onPress={onFooterClear}
				/>

				<View style={styles.footerServCnt}>
					{
						<View style={{ justifyContent: 'center', alignItems: 'center' }}>
							<XText light>{selectedServices?.length > 0 ? selectedServices.length : '-'} {t('services')}</XText>
							<XText size={16} bold light>{getPriceSum(selectedServices)}</XText>
						</View>
					}
				</View>

				<XButton
					title={t('Find appointment')}
					primary
					disabled={!selectedServices?.length}
					style={styles.footerBtnFind}
					onPress={() => {
						if (userLoged)
							navigation.navigate(FREE_APPOINTMENTS_SCREEN, { services: selectedServices.map(s => s.id), providerId });
						else
							handleUnauth()
					}}
					iconRight={bookBtnRightIcon}
				/>
			</Footer>
		</>
	)
};

const styleCreator = (theme) => StyleSheet.create({
	content: {
		backgroundColor: theme.colors.backgroundElement,
		flex: 1,
		paddingBottom: 5,
		marginTop: CNT_NEG_TOP_MARGIN,
		borderTopEndRadius: 20,
		borderTopStartRadius: 20,
		overflow: 'hidden'
	},
	tabView: {
		flex: 1
	},
	tabBar: {
		borderBottomWidth: Theme.values.borderWidth,
		borderColor: theme.colors.borderColor
	},
	titleCnt: {
		alignItems: 'center',
		justifyContent: 'center',
		//flexDirection: 'row',
		//flexWrap: 'wrap',
		paddingHorizontal: 15,
		//backgroundColor: theme.colors.primaryLight,
		paddingTop: CHIP_MARK_TOP_MARGIN + 10,
		paddingBottom: 5
	},
	footerServCnt: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	footerBtnFind: {
		margin: 5,
		flex: 1
	},
	chipMark: {
		position: 'absolute',
		bottom: CHIP_MARK_TOP_MARGIN,
		zIndex: 10,
		right: 0,
		left: 0,
		alignItems: 'center'
	},
	headerPlaceHolderImg: {
		alignItems: 'center',
		justifyContent: 'center',
		flex: 1
	},
	headerImage: {
		flex: 1
	},
	headerButtonRight: {
		position: 'absolute',
		end: 8,
		top: 8
	}
});


export default ProviderScreen;