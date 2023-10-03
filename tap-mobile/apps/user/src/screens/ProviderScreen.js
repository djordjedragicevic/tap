
import XText from "xapp/src/components/basic/XText";
import XButton from "xapp/src/components/basic/XButton";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Http, useHTTPGet } from "xapp/src/common/Http";
import XAvatar from "xapp/src/components/basic/XAvatar";
import { Animated, Pressable, SectionList, StyleSheet, View } from "react-native"
import { DateUtils, emptyFn } from 'xapp/src/common/utils';
import { useTranslation } from "xapp/src/i18n/I18nContext";
import XChip from "xapp/src/components/basic/XChip";
import XCheckBox from "xapp/src/components/basic/XCheckBox";
import { useThemedStyle } from "xapp/src/style/ThemeContext";
import { ScrollView } from "react-native-gesture-handler";
import { Theme } from "xapp/src/style/themes";
import HairSalon from "../components/svg/HairSalon";
import FavoriteButton from "../components/FavoriteButton";
import { storeDispatch, useStore } from "xapp/src/store/store";
import { FREE_APPOINTMENTS_SCREEN } from "../navigators/routes";
import { AntDesign } from '@expo/vector-icons';
import Footer from "../components/Footer";
import { XTabView, XTabScreen } from "xapp/src/components/tabview/XTabView";
import XImage from "xapp/src/components/basic/XImage";
import XToolbarContainer from "xapp/src/components/XToolbarContainer";
import utils from "../common/utils";
import XSection from "xapp/src/components/basic/XSection";

let lastP = {};

const groupServices = (sers) => {

	if (!sers)
		return sers;

	const cats = {};
	const catList = [];
	const sMap = {};

	const gMap = {};

	sers.forEach(ser => {
		sMap[ser.id] = ser;
		const cId = !ser.c_id ? '__default' : ser.c_id;
		if (!cats[cId]) {
			cats[cId] = {
				name: ser.c_name,
				groups: []
			};
			catList.push({
				name: ser.c_name,
				id: cId
			})
		}


		const gId = !ser.g_id ? '__default' : ser.g_id;
		const gMid = gId + cId;
		if (!gMap[gMid]) {
			gMap[gMid] = { data: [] };

			cats[cId].groups.push({
				title: ser.g_name || '__default',
				data: gMap[gMid].data
			});
		}

		gMap[gMid].data.push(ser);

	});

	return {
		categories: cats,
		categoryList: catList,
		sMap
	};
};

const areSIEqual = (oldProps, newProps) => {
	return oldProps.id === newProps.id && oldProps.isSelected === newProps.isSelected;
};

const ServiceItem = memo(({
	onPress = emptyFn,
	isSelected = false,
	name,
	note,
	duration,
	durationTo,
	price,
	id
}) => {

	const tStyles = useThemedStyle(serviceItemSC);
	const t = useTranslation();

	const onItemPress = () => {
		onPress(id);
	};

	const dur = (durationTo ? duration + ' - ' + durationTo : duration) + ' ' + t('min') + '.'
	return (
		<Pressable
			onPress={onItemPress}
			style={tStyles.container}
		>
			<View style={{ alignSelf: 'center' }}>
				<XCheckBox checked={isSelected} setChecked={onItemPress} size={14} />
			</View>

			<View style={{ flex: 1 }}>
				<View style={{ flex: 1, paddingStart: 5, flexDirection: 'row', alignItems: 'center' }}>

					<View style={{ flex: 1 }}>
						<XText>{name}</XText>
						{note && <XText secondary style={{ fontSize: 12 }}>{note}</XText>}
					</View>

					<View style={{ alignItems: 'flex-end' }}>
						<XText size={16} style={tStyles.price}>{price} KM</XText>
						<XText size={12} secondary>{dur}</XText>
					</View>
				</View>
			</View>
		</Pressable>
	)
}, areSIEqual);

const serviceItemSC = (theme) => StyleSheet.create({
	price: {
		color: theme.colors.primary
	},
	container: {
		padding: 8,
		elevation: 0,
		borderRadius: 5,
		backgroundColor: theme.colors.backgroundElement,
		flexDirection: 'row',
		minHeight: 55
	}
});


const TabServices = ({
	providerId,
	selected,
	setSelected,
	setPriceSum
}) => {

	const [provider] = useHTTPGet(`/provider/${providerId}`, undefined, lastP[providerId]);
	lastP[providerId] = provider;

	const [selectedCatIdx, setSelectedCatIdx] = useState(0);

	const services = useMemo(() => groupServices(provider?.services), [provider]);
	const hasCats = services?.categoryList.length > 1;


	const styles = useThemedStyle(styleCreator);


	useEffect(() => {
		const priceSum = selected.map(sId => services.sMap[sId].price).reduce((accumulator, price) => accumulator + price, 0);
		setPriceSum(priceSum)
	}, [selected, services, setPriceSum]);



	const onItemPress = useCallback((itemId) => {
		const selectedIdx = selected.indexOf(itemId);
		if (selectedIdx > -1) {
			setSelected(old => old.filter(oldId => oldId !== itemId));
		}
		else
			setSelected(old => [...old, itemId])

	}, [selected]);

	const renderItem = useCallback(({ item }) => (
		<ServiceItem
			key={item.id}
			onPress={onItemPress}
			isSelected={selected.indexOf(item.id) > -1}
			{...item}
		/>
	), [selected, onItemPress]);

	const renderSectionHeader = useCallback(({ section: { title } }) => {
		return (
			<>
				{
					title !== '__default' &&
					<View style={styles.sHeaderContainer}>
						<XText size={18}>{title}</XText>
					</View>
				}
			</>
		)
	}, [styles]);

	// const offset = useRef(new Animated.Value(0)).current;

	const onCategoryRender = useCallback((item, idx, minItemWidth) => {
		const isSelected = idx === selectedCatIdx;

		return (
			<Pressable
				onPress={() => setSelectedCatIdx(idx)}
				key={item.id}
				style={[styles.category, { minWidth: minItemWidth }, isSelected && styles.categorySelected]}
			>
				<XText light={isSelected}>{item.name}</XText>
			</Pressable>
		)
	}, [setSelectedCatIdx, selectedCatIdx]);

	if (!provider)
		return null;


	return (
		<View style={{ flex: 1 }}>
			{
				hasCats &&
				<XToolbarContainer
					items={services?.categoryList || []}
					onItemRender={onCategoryRender}
					minItemWidth={90}
					tabBarHPadding={5}
					barHeight={42}
				/>
			}

			<SectionList
				sections={services.categories[services.categoryList[selectedCatIdx].id].groups}
				renderItem={renderItem}
				renderSectionHeader={renderSectionHeader}
				contentContainerStyle={styles.sContentContainerStyle}
				showsVerticalScrollIndicator={true}
				scrollEventThrottle={16}
			/>
		</View>
	);

};

const TabAbout = ({ data = {} }) => {

	const t = useTranslation();

	const wPs = useMemo(() => {
		const wPMap = {};

		data.workPeriods.forEach(p => {
			if (!wPMap.hasOwnProperty(p.day))
				wPMap[p.day] = [];

			wPMap[p.day].push(`${p.startTime} : ${p.endTime}`);
		});

		return wPMap;

	}, [data?.workPeriods])

	return (
		<ScrollView>

			<XSection title={"Address"}>
				<XText>{data.address}, {data.city}</XText>
				<XText>{data.phone}</XText>
			</XSection>

			<XSection title={"Work time"}>
				{wPs &&
					<View style={{}}>
						{Object.keys(wPs).map(day => (
							<View key={day} style={{ flexDirection: 'row' }}>
								<View style={{ flex: 1 }}>
									<XText>{t(DateUtils.WEEK_DAY[day])}</XText>
								</View>
								<View style={{ flex: 1 }}>
									<XText>{wPs[day].join(', ')}</XText>
								</View>
							</View>
						)
						)}
					</View>
				}
			</XSection >

			<XSection title={"Our team"}>
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={{
						columnGap: 15,
						paddingHorizontal: 5
					}}
				>
					{data.employees?.map(e => {
						return (
							<View key={e.id} style={{ alignItems: 'center', justifyContent: 'center' }}>
								<XAvatar
									size={50}
									imgPath={e.imagePath}
									initials={e.name.substring(0, 1).toUpperCase()}
								/>
								<XText>{e.name}</XText>
							</View>
						)
					})}
				</ScrollView>
			</XSection>
		</ScrollView >
	)
};

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

	const [selectedIds, setSelectedIdxs] = useState([]);
	const [priceSum, setPriceSum] = useState();
	const [favoriteDisabled, setFavoriteDisabled] = useState(false);

	const userId = useStore(st => st.user.id);
	const fProviders = useStore(st => st.user.state.favoriteProviders);
	const isFavorite = fProviders && fProviders.indexOf(providerId) > -1;

	const bookBtnRightIcon = useCallback((color, size) => <AntDesign color={color} size={size} name="arrowright" />, []);

	const onFPress = () => {
		const newFavs = isFavorite ? fProviders.filter(pId => pId !== providerId) : [...(fProviders || []), providerId];
		setFavoriteDisabled(true);
		Http.post(`/user/${userId}/state`, { favoriteProviders: newFavs })
			.then(() => storeDispatch(`user.favorite_${!isFavorite ? 'add' : 'remove'}`, providerId))
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
				<FavoriteButton
					style={{
						position: 'absolute',
						end: 10,
						top: 10,
						backgroundColor: 'hsla(0, 0%, 100%, 0.5)'
					}}
					disabled={favoriteDisabled}
					favorit={isFavorite}
					onPress={onFPress}
				/>
				<View style={{
					position: 'absolute',
					bottom: CHIP_MARK_TOP_MARGIN,
					zIndex: 10,
					right: 0,
					left: 0,
					alignItems: 'center'
				}}>
					<XChip text={utils.generateMarkString(about?.mark, about?.reviewCount)} />
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
							<XText bold size={18}>{about.name} - {about.type}</XText>
						</View>

						<XTabView
							style={styles.tabView}
							tabBarStyle={styles.tabBar}
						>
							<XTabScreen title={t('About')} style={{ flex: 1 }}>
								<TabAbout
									data={about}
								/>
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
				<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
					{
						<View style={{ justifyContent: 'center', alignItems: 'center' }}>
							<XText light>{selectedIds?.length > 0 ? selectedIds.length : '-'} servisa</XText>
							<XText size={16} bold light>{priceSum || '-'}</XText>
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
	},


	sHeaderContainer: {
		justifyContent: 'flex-end',
		padding: 5,
		backgroundColor: theme.colors.backgroundColor,
	},
	sContentContainerStyle: {
		paddingHorizontal: 10,
		backgroundColor: theme.colors.backgroundColor,
	},
	category: {
		borderRadius: Theme.values.borderRadius,
		borderColor: theme.colors.primary,
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	categorySelected: {
		backgroundColor: theme.colors.secondary
	}
});


export default ProviderScreen;