import { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
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
import { useFocusEffect } from "@react-navigation/native";
import XImage from "xapp/src/components/basic/XImage";


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
				fieldContainerStyle={styles.searchInputContainer}
				fieldStyle={styles.searchInputField}
			/>
			<View
				style={styles.searchFilterCnt}>
				<XIcon icon='filter' colorName='textLight' />
			</View>
		</View>
	)
}

const ProvidersScreen = ({ navigation, route }) => {

	const [loading, setLoading] = useState(false);
	const [providers, setProviders] = useState();
	const [filter, setFilter] = useState();
	const searchRef = useRef(null);

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
		if (filter)
			loadProviders(filter);
	}, [filter]);

	// useFocusEffect(useCallback(() => {
	// 	return () => {
	// 		setFilter(null);
	// 	}
	// }, []));


	useEffect(() => {
		if (route.params?.focusSearch) {
			searchRef?.current.focus();
		}
	}, [route.params]);


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

				filter ?
					<FlatList
						contentContainerStyle={styles.providerListContent}
						data={providers}
						renderItem={renderCompany}
						refreshing={loading}
						onRefresh={loadProviders}
					/>
					:
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

	searchCnt: {
		flexDirection: 'row',
		margin: 10,
		borderTopRightRadius: Theme.values.borderRadius,
		borderBottomRightRadius: Theme.values.borderRadius,
		borderColor: theme.colors.borderColor,
		overflow: 'hidden'
	},
	searchInput: {
		flex: 1
	},
	searchInputContainer: {
		borderRightWidth: 0,
		borderTopRightRadius: 0,
		borderBottomRightRadius: 0
	},
	searchInputField: {
		fontSize: 14
	},
	searchFilterCnt: {
		backgroundColor: theme.colors.secondary,
		flex: 1,
		maxWidth: 80,
		alignItems: 'center',
		justifyContent: 'center'
	}
});

export default ProvidersScreen;