
import XText from "xapp/src/components/basic/XText";
import XButton from "xapp/src/components/basic/XButton";
import { useCallback, useState } from "react";
import { Http, useHTTPGet } from "xapp/src/common/Http";
import { StyleSheet, View } from "react-native"
import { useTranslation } from "xapp/src/i18n/I18nContext";
import XChip from "xapp/src/components/basic/XChip";
import { usePrimaryColor, useThemedStyle } from "xapp/src/style/ThemeContext";
import { Theme } from "xapp/src/style/themes";
import HairSalon from "../../components/svg/HairSalon";
import { storeDispatch, useStore } from "xapp/src/store/store";
import { FREE_APPOINTMENTS_SCREEN, MAP_SCREEN } from "../../navigators/routes";
import { AntDesign } from '@expo/vector-icons';
import Footer from "../../components/Footer";
import { XTabView, XTabScreen } from "xapp/src/components/tabview/XTabView";
import XImage from "xapp/src/components/basic/XImage";
import utils from "../../common/utils";
import TabAbout from "./TabAbout";
import TabServices from "./TabServices";
import XButtonIcon from "xapp/src/components/basic/XButtonIcon";
import { CurrencyUtils } from "xapp/src/common/utils";

const TabReviews = () => {
	return (
		<View flex={1} justifyContent='center' alignItems='center'>
			<XText>Reviews</XText>
		</View>
	)
};

const HEADER_IMAGE_HEIGHT = 230;
const CNT_NEG_TOP_MARGIN = -20;
const CHIP_MARK_TOP_MARGIN = (Theme.values.chipHeight / 2 * -1) - CNT_NEG_TOP_MARGIN;

const ProviderScreen = ({ navigation, route }) => {

	const providerId = route.params.id;
	const [{ mainImg, about }] = useHTTPGet(`/provider/${providerId}`, null, {});

	const t = useTranslation();
	const styles = useThemedStyle(styleCreator)
	const pColor = usePrimaryColor();

	const [selectedIds, setSelectedIdxs] = useState([]);
	const [priceSum, setPriceSum] = useState();
	const [favoriteDisabled, setFavoriteDisabled] = useState(false);

	const userId = useStore(st => st.user.id);
	const fProviders = useStore(st => st.user.state.favoriteProviders);
	const isFavorite = fProviders && fProviders.indexOf(providerId) > -1;

	const bookBtnRightIcon = useCallback((color, size) => <AntDesign color={color} size={size} name="arrowright" />, []);
	const onFooterClear = useCallback(() => setSelectedIdxs([]), []);


	const onFPress = () => {
		const newFavs = isFavorite ? fProviders.filter(pId => pId !== providerId) : [...(fProviders || []), providerId];
		setFavoriteDisabled(true);
		Http.post(`/user/${userId}/state`, { favoriteProviders: newFavs })
			.then(() => storeDispatch(`user.favorite_${!isFavorite ? 'add' : 'remove'}`, providerId))
			.catch(err => {
				console.log("FERR", err)
			})
			.finally(() => setFavoriteDisabled(false));
	};

	return (
		<>
			<View style={{ height: HEADER_IMAGE_HEIGHT }}>
				{
					mainImg ?
						<XImage
							imgPath={mainImg[0]}
							cachePolicy='memory'
							style={{ flex: 1 }}
							contentFit="cover"
						/>
						:
						<View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
							<HairSalon height={150} width={150} />
						</View>
				}

				<XButtonIcon
					icon='arrowleft'
					onPress={navigation.goBack}
					style={{
						position: 'absolute',
						start: 10,
						top: 10
					}}
				/>
				<XButtonIcon
					icon={isFavorite ? 'hearto' : 'heart'}
					disabled={favoriteDisabled}
					color={pColor}
					onPress={onFPress}
					style={{
						position: 'absolute',
						end: 10,
						top: 10
					}}
				/>

				<View style={{
					position: 'absolute',
					bottom: CHIP_MARK_TOP_MARGIN,
					zIndex: 10,
					right: 0,
					left: 0,
					alignItems: 'center'
				}}>
					<XChip primary text={utils.generateMarkString(about?.mark, about?.reviewCount)} />
				</View>
			</View>

			<View style={styles.content}>
				{
					!!about
					&&
					<>
						<View style={{
							height: 45,
							justifyContent: 'center',
							alignItems: 'center',
							paddingTop: CHIP_MARK_TOP_MARGIN
						}}>
							<View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 5 }}>
								<XText bold size={18}>{about.name} - {about.type}</XText>
							</View>
						</View>

						<XTabView
							style={styles.tabView}
							tabBarStyle={styles.tabBar}
						>
							<XTabScreen title={t('About')} style={{ flex: 1 }}>
								<TabAbout data={about} navigation={navigation} />
							</XTabScreen>

							<XTabScreen title={t('Services')} style={{ flex: 1 }}>
								<TabServices
									navigation={navigation}
									providerId={providerId}
									selected={selectedIds}
									setSelected={setSelectedIdxs}
									setPriceSum={setPriceSum}
								/>
							</XTabScreen>

							<XTabScreen title={t('Reviews')}>
								<TabReviews />
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
				<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
					{
						<View style={{ justifyContent: 'center', alignItems: 'center' }}>
							<XText light>{selectedIds?.length > 0 ? selectedIds.length : '-'} servisa</XText>
							<XText size={16} bold light>{priceSum ? CurrencyUtils.convert(priceSum) : '-'}</XText>
						</View>
					}
				</View>

				<XButton
					title={t('Find appointment')}
					primary
					disabled={!selectedIds?.length}
					style={{ margin: 5, flex: 1 }}
					onPress={() => navigation.navigate(FREE_APPOINTMENTS_SCREEN, { services: [...selectedIds], providerId })}
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
		borderColor: theme.colors.textTertiary,
		marginBottom: 8
	}
});


export default ProviderScreen;