
import XText from "xapp/src/components/basic/XText";
import XButton from "xapp/src/components/basic/XButton";
import { useCallback, useState } from "react";
import { Http, useHTTPGet } from "xapp/src/common/Http";
import { StyleSheet, View } from "react-native"
import { useTranslation } from "xapp/src/i18n/I18nContext";
import XChip from "xapp/src/components/basic/XChip";
import { useColor, usePrimaryColor, useThemedStyle } from "xapp/src/style/ThemeContext";
import { Theme } from "xapp/src/style/themes";
import HairSalon from "../components/svg/HairSalon";
import { storeDispatch, useStore } from "xapp/src/store/store";
import { FREE_APPOINTMENTS_SCREEN } from "../navigators/routes";
import { AntDesign } from '@expo/vector-icons';
import Footer from "../components/Footer";
import { XTabView, XTabScreen } from "xapp/src/components/tabview/XTabView";
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

const HEADER_IMAGE_HEIGHT = 230;
const CNT_NEG_TOP_MARGIN = -20;
const CHIP_MARK_TOP_MARGIN = (Theme.values.chipHeight / 2 * -1) - CNT_NEG_TOP_MARGIN;

const ProviderScreen = ({ navigation, route }) => {

	const providerId = route.params.id;

	const t = useTranslation();
	const styles = useThemedStyle(styleCreator)
	const [pColor, sColor] = useColor(['primary', 'secondary']);

	const [data, setData] = useState({
		about: {
			workPeriods: [],
			employees: []
		},
		services: []
	});
	const [selectedIds, setSelectedIdxs] = useState([]);
	const [priceSum, setPriceSum] = useState();
	const [favoriteDisabled, setFavoriteDisabled] = useState(false);
	const [loadCount, setLoadCount] = useState(1);

	const userLoged = useIsUserLogged();

	const userId = useStore(st => st.user.id);
	const fProviders = useStore(st => st.user.state.favoriteProviders);
	const isFavorite = fProviders && fProviders.indexOf(providerId) > -1;

	const bookBtnRightIcon = useCallback((color, size) => <AntDesign color={color} size={size} name="arrowright" />, []);
	const onFooterClear = useCallback(() => setSelectedIdxs([]), []);

	const loadData = useCallback(() => {
		//setLoadCount(c => c + 1);
		Http.get(`/provider/${providerId}`)
			.then(resp => {
				setData(resp);
			})
			.catch(emptyFn);
	}, [providerId]);

	useFocusEffect(loadData);

	const onFPress = () => {
		const newFavs = isFavorite ? fProviders.filter(pId => pId !== providerId) : [...(fProviders || []), providerId];
		setFavoriteDisabled(true);
		Http.post(`/user/${userId}/state`, { favoriteProviders: newFavs })
			.then(() => storeDispatch(`user.favorite_${!isFavorite ? 'add' : 'remove'}`, providerId))
			.catch(emptyFn)
			.finally(() => setFavoriteDisabled(false));
	};

	return (
		<>
			<View style={{ height: HEADER_IMAGE_HEIGHT }}>
				{
					data.about.mainImg ?
						<XImage
							imgPath={data.about.mainImg}
							style={styles.headerImage}
							contentFit="cover"
						/>
						:
						<View style={styles.headerPlaceHolderImg}>
							<HairSalon height={150} width={150} />
						</View>
				}

				<XButtonIcon
					icon='arrowleft'
					onPress={navigation.goBack}
					backgroundColor={sColor}
					style={styles.headerButtonLeft}
					bgOpacity={0.6}
				/>
				<XButtonIcon
					icon={isFavorite ? 'hearto' : 'heart'}
					disabled={favoriteDisabled}
					color={pColor}
					backgroundColor={sColor}
					onPress={onFPress}
					style={styles.headerButtonRight}
					bgOpacity={0.6}
				/>

				<View style={styles.chipMark}>
					<XChip primary text={utils.generateMarkString(data.about.mark, data.about.reviewCount)} />
				</View>
			</View>

			<View style={styles.content}>
				{
					!!data
					&&
					<>
						<View style={styles.titleCnt}>
							<XText oneLine bold size={18}>{data.about.name} - {data.about.providerType}</XText>
						</View>

						<XTabView style={styles.tabView} tabBarStyle={styles.tabBar}>

							<XTabScreen title={t('About')} flex={1}>
								<TabAbout
									data={data.about}
									navigation={navigation}
								/>
							</XTabScreen>

							<XTabScreen title={t('Services')} flex={1}>
								<TabServices
									navigation={navigation}
									providerId={providerId}
									selected={selectedIds}
									setSelected={setSelectedIdxs}
									setPriceSum={setPriceSum}
								/>
							</XTabScreen>

							<XTabScreen title={t('Review')} flex={1}>
								<TabReviews
									providerId={providerId}
									navigation={navigation}
									reload={data}
								/>
							</XTabScreen>
						</XTabView>
					</>
				}
			</View>

			<Footer>

				<XButtonIcon
					disabled={!selectedIds?.length}
					icon='close'
					backgroundColor='transparent'
					onPress={onFooterClear}
				/>

				<View style={styles.footerServCnt}>
					{
						<View style={{ justifyContent: 'center', alignItems: 'center' }}>
							<XText light>{selectedIds?.length > 0 ? selectedIds.length : '-'} {t('services')}</XText>
							<XText size={16} bold light>{priceSum ? CurrencyUtils.convert(priceSum) : '-'}</XText>
						</View>
					}
				</View>

				<XButton
					title={t('Find appointment')}
					primary
					disabled={!selectedIds?.length}
					style={styles.footerBtnFind}
					onPress={() => {
						if (userLoged)
							navigation.navigate(FREE_APPOINTMENTS_SCREEN, { services: [...selectedIds], providerId });
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
		height: 50,
		justifyContent: 'center',
		alignItems: 'center',
		paddingTop: CHIP_MARK_TOP_MARGIN
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
	headerButtonLeft: {
		position: 'absolute',
		start: 8,
		top: 8
	},
	headerButtonRight: {
		position: 'absolute',
		end: 8,
		top: 8
	}
});


export default ProviderScreen;