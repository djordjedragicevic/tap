import { memo, useCallback, useEffect, useRef, useState } from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { Http } from "xapp/src/common/Http";
import XScreen from "xapp/src/components/XScreen";
import { PROVIDER_SCREEN } from "../navigators/routes";
import { Theme } from "xapp/src/style/themes";
import { useThemedStyle } from "xapp/src/style/ThemeContext";
import XTextInput from "xapp/src/components/basic/XTextInput";
import XIcon from "xapp/src/components/basic/XIcon";
import { useTranslation } from "xapp/src/i18n/I18nContext";
import { emptyFn } from "xapp/src/common/utils";
import ProviderCard from "../components/ProviderCard";
import XImage from "xapp/src/components/basic/XImage";
import { useFocusEffect } from '@react-navigation/native';
import { useStore } from "xapp/src/store/store";
import XText from "xapp/src/components/basic/XText";


const SearchAndFilterProviders = ({ onSearch = emptyFn, searchRef, searchTerm }) => {

	const styles = useThemedStyle(styleCreator);
	const t = useTranslation();

	const setSearchInt = useCallback((value) => {
		const v = typeof value === 'string' ? value : '';
		onSearch(v);
	}, [onSearch]);

	return (
		<View style={styles.searchCnt}>
			<XTextInput
				ref={searchRef}
				iconLeft='search1'
				outline
				blurIconColor
				value={searchTerm}
				onClear={setSearchInt}
				onChangeText={setSearchInt}
				placeholder={t('Name of provider or service')}
				clearable
				style={styles.searchInput}
				fieldStyle={styles.searchInputField}
			/>
			<View
				style={styles.searchFilterCnt}>
				<XIcon icon='filter' colorName='textLight' />
			</View>
		</View>
	)
};

const pCountText = (t, count) => {
	if (!count)
		return t('Currently no offers')
	else if (count === 1)
		return '1 ' + t('offer');
	else
		return count + ' ' + t('offers');
};

const isProviderTypeEqual = (newV, oldV) => newV.id === oldV.id;

const ProviderTypeThumb = memo(({ item, onPress }) => {

	const styles = useThemedStyle(styleCreator);
	const t = useTranslation();

	return (
		<Pressable
			style={styles.pTypeItem}
			disabled={!item.providerCount}
			onPress={() => onPress(item)}
		>
			<XImage
				style={item.providerCount ? styles.pTImage : styles.pTImageNoOffers}
				imgPath={item.imagePath}
				textOver={item.text}
			/>
			<View style={styles.pTImageTextCnt}>
				<XText style={styles.pTImageText} adjustsFontSizeToFit size={26} bold light>
					{item.name}
				</XText>
				<XText bold size={14} light >
					{pCountText(t, item.providerCount)}
				</XText>
			</View>
		</Pressable>
	)
}, isProviderTypeEqual);


const ProvidersScreen = ({ navigation, route }) => {

	const [loading, setLoading] = useState(false);
	const [providers, setProviders] = useState();
	const [filter, setFilter] = useState();
	const searchRef = useRef(null);
	const providerTypes = useStore(gS => gS.app.providerTypes);

	const loadProviders = useCallback((filter) => {

		let finish = true;
		setLoading(true);

		Http.get('/provider/list', { ...(filter || {}) }, true)
			.then(resp => {
				if (finish)
					setProviders(resp);
			})
			.catch(emptyFn)
			.finally(() => setLoading(false));

		return () => {
			finish = false;
		}

	}, []);

	useEffect(() => {
		loadProviders();
	}, []);
	useEffect(() => {
		if (filter)
			loadProviders(filter);
	}, [filter]);
	useEffect(() => {
		if (route.params?.focusSearch) {
			searchRef?.current.focus();
		}
	}, [route.params]);

	useFocusEffect(useCallback(() => {

		if (route.params?.filter)
			setFilter({ ...route.params.filter })

	}, [route?.params?.filter]));


	const styles = useThemedStyle(styleCreator);

	const renderCompany = useCallback(({ item }) => {
		return (
			<ProviderCard
				mainImg={item.mainImg || item.providerTypeImage}
				id={item.id}
				name={item.name}
				providerType={item.providerType}
				address1={item.address1}
				mark={item.mark}
				reviewCount={item.reviewCount}
				searchName={item.searchName}
				searchTerm={filter?.term}
				serviceResult={item.serviceResult}
				onPress={(itemData) => navigation.navigate(PROVIDER_SCREEN, { item: itemData })}
			/>
		)
	}, [navigation, filter?.term]);

	const renderTypes = useCallback(({ item }) => {
		return <ProviderTypeThumb
			item={item}
			onPress={(item) => setFilter(old => ({ ...old, typeId: item.id }))}
		/>
	}, [providerTypes]);


	const onSearch = (term) => {
		setFilter(old => ({ ...old, term }))
	};

	return (
		<XScreen loading={loading} flat>

			<SearchAndFilterProviders
				onSearch={onSearch}
				searchTerm={filter?.term}
				disabled={loading}
				searchRef={searchRef}
			/>

			{
				providers ?
					<FlatList
						contentContainerStyle={styles.providerListContent}
						data={providers}
						renderItem={renderCompany}
						refreshing={loading}
						onRefresh={loadProviders}
					/>
					:
					// <FlatList
					// 	contentContainerStyle={styles.providerListContent}
					// 	data={providerTypes}
					// 	renderItem={renderTypes}
					// />
					<View style={{ borderWidth: 0, flex: 1, alignItems: 'center', justifyContent: 'center' }}>
						<XImage
							style={{ width: 100, height: 100, opacity: 0.5, alightSelf: 'center' }}
							source={require('../assets/svg/search5.svg')}
						/>
					</View>
			}
		</XScreen>
	);
};

const styleCreator = (theme) => StyleSheet.create({
	providerListContent: {
		paddingHorizontal: Theme.values.mainPaddingHorizontal,
		paddingTop: Theme.values.mainPaddingHorizontal,
		rowGap: Theme.values.mainPaddingHorizontal
	},


	pTypeItem: {
		height: 150,
		flex: 1,
		borderRadius: Theme.values.borderRadius,
		overflow: 'hidden'
	},
	pTImageTextCnt: {
		position: 'absolute',
		flex: 1,
		top: 0,
		bottom: 0,
		start: 0,
		end: 0,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 20,
		backgroundColor: Theme.opacity(theme.colors.black, 0.3)
	},
	pTImage: {
		flex: 1
	},
	pTImageNoOffers: {
		flex: 1,
		opacity: 0.4
	},
	pTImageText: {
		textAlign: 'center'
	},



	searchCnt: {
		flexDirection: 'row',
		gap: 15,
		padding: 15,
		overflow: 'hidden'
	},
	searchInput: {
		flex: 1
	},
	searchInputField: {
		fontSize: 14
	},
	searchFilterCnt: {
		backgroundColor: theme.colors.secondary,
		flex: 1,
		borderRadius: Theme.values.borderRadius,
		maxWidth: 60,
		alignItems: 'center',
		justifyContent: 'center'
	}
});

export default ProvidersScreen;