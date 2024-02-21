import { memo, useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Http, useHTTPGet } from "xapp/src/common/Http";
import XText from "xapp/src/components/basic/XText";
import XImage from "xapp/src/components/basic/XImage";
import XScreen from "xapp/src/components/XScreen";
import { PROVIDER_SCREEN } from "../navigators/routes";
import XSection from "xapp/src/components/basic/XSection";
import { Theme } from "xapp/src/style/themes";
import XSeparator from "xapp/src/components/basic/XSeparator";
import XMarkStars from "xapp/src/components/XMarkStars";
import { useThemedStyle } from "xapp/src/style/ThemeContext";
import XTextInput from "xapp/src/components/basic/XTextInput";
import XIcon from "xapp/src/components/basic/XIcon";
import { useTranslation } from "xapp/src/i18n/I18nContext";
import { emptyFn } from "xapp/src/common/utils";
import XChip from "xapp/src/components/basic/XChip";
import XTextTermHighlight from "xapp/src/components/basic/XTextTermHighlight";

const isEqual = (oldProps, newProps) => {
	return oldProps.id === newProps.id;
};


const ProviderCard = memo(({ item, onPress, searchTerm }) => {
	const styles = useThemedStyle(styleCreator);

	return (
		<XSection
			onPress={onPress}
			styleContent={styles.sectionContainer}
		>
			<View style={{ height: 150 }}>
				<View style={{ flex: 1 }}>
					<XImage
						imgPath={item?.mainImg?.split(',')[0] || item.providerTypeImage}
						contentFit='cover'
						style={{ flex: 1 }}
					/>
				</View>
			</View>

			<View style={{ flex: 1, padding: 10 }}>

				<View style={{ marginBottom: 5, flex: 1 }}>
					<XTextTermHighlight
						bold
						size={18}
						term={searchTerm}
						searchString={item.searchName}
					>
						{item.name}
					</XTextTermHighlight>
					<XText secondary oneLine>{item.providerType}</XText>
					<XText secondary oneLine>{item.address}</XText>
				</View>

				<XMarkStars mark={item.mark} reviewCount={item.reviewCount} />

				{/* <XSeparator style={{ marginVertical: 10 }} /> */}

				{item.serviceResult &&
					<View>
						<XSeparator style={{ marginVertical: 10 }} />
						<View>
							<View style={{ flex: 1, gap: 5, flexDirection: 'row', flexWrap: 'wrap' }}>
								{item.serviceResult.services.map(s => (
									<XChip color={Theme.vars.purple} outline key={s.id} icon={'tag'}>
										<XTextTermHighlight
											key={s.id}
											term={searchTerm}
											searchString={s.searchName}
											colorName={Theme.vars.purple}
										>
											{s.name}
										</XTextTermHighlight>
									</XChip>
								))}
								{item.serviceResult.services.length < item.serviceResult.count &&
									<XChip color={Theme.vars.purple} text={'+' + (item.serviceResult.count - item.serviceResult.services.length)} />
								}
							</View>
						</View>
					</View>
				}
			</View>
		</XSection>
	)
});

const SearchAndFilterProviders = ({ onSearch = emptyFn }) => {

	const styles = useThemedStyle(styleCreator);
	const [search, setSearch] = useState('');
	const t = useTranslation();

	const setSearchInt = useCallback((value) => {
		const v = typeof value === 'string' ? value : '';
		setSearch(v);
		onSearch(v);
	}, [onSearch, setSearch]);

	return (
		<View style={styles.searchCnt}>
			<XTextInput
				iconLeft='search1'
				outline
				blurIconColor
				value={search}
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
				<XIcon icon='menu-fold' colorName='textLight' />
			</View>
		</View>
	)
}

const ProvidersScreen = ({ navigation, route }) => {

	const [loading, setLoading] = useState(false);
	const [providers, setProviders] = useState();
	const [filter, setFilter] = useState({
		term: '',
		tid: route.params.typeId
	});

	const loadProviders = useCallback((filter) => {

		let finish = true;
		setLoading(true);

		Http.get('/provider/list', { ...filter })
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
		loadProviders(filter);
	}, [filter]);

	useEffect(() => {
		return () => setFilter({});
	}, []);

	const styles = useThemedStyle(styleCreator);

	const renderCompany = useCallback(({ item }) => {

		const it = {
			id: item.id,
			name: item.name,
			providerType: item.providerType,
			mark: item.mark,
			reviewCount: item.reviewCount,
			mainImg: item.mainImg,
			address: item.address1,
			providerTypeImage: item.providerTypeImage,
			serviceResult: item.serviceResult,
			searchName: item.searchName
		};
		return (
			<ProviderCard
				item={it}
				searchTerm={filter.term}
				onPress={() => navigation.navigate(PROVIDER_SCREEN, { item: { ...it } })}
			/>
		)
	}, [navigation, filter.term]);


	const onSearch = (term) => {
		if (term?.length > 1 || term?.length === 0)
			setFilter(old => ({ ...old, term }))
	};

	return (
		<XScreen loading={loading} flat>

			<SearchAndFilterProviders
				onSearch={onSearch}
				disabled={loading}
			/>

			<FlatList
				contentContainerStyle={styles.providerListContent}
				data={providers}
				renderItem={renderCompany}
				refreshing={loading}
				onRefresh={loadProviders}
			/>
		</XScreen>
	);
};

const styleCreator = (theme) => StyleSheet.create({
	providerListContent: {
		paddingHorizontal: Theme.values.mainPaddingHorizontal,
		paddingTop: Theme.values.mainPaddingHorizontal,
		rowGap: Theme.values.mainPaddingHorizontal
	},

	titleType: {
		//fontSize: 18
	},
	title: {
		fontSize: 20
	},
	sectionContainer: {
		padding: 0
	},

	searchCnt: {
		height: 48,
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
		fontSize: 14,
		height: '100%'
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