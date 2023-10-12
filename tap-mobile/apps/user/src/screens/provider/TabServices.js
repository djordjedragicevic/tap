import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useHTTPGet } from "xapp/src/common/Http";
import { StyleSheet, Pressable, View, SectionList } from "react-native";
import { Theme } from "xapp/src/style/themes";
import XCheckBox from "xapp/src/components/basic/XCheckBox";
import XText from "xapp/src/components/basic/XText";
import XToolbarContainer from "xapp/src/components/XToolbarContainer";
import { useThemedStyle } from "xapp/src/style/ThemeContext";
import { useTranslation } from "xapp/src/i18n/I18nContext";


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

	const tStyles = useThemedStyle(serviceItemSC, isSelected);
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

const serviceItemSC = (theme, selected) => StyleSheet.create({
	price: {
		color: theme.colors.primary
	},
	container: {
		padding: 8,
		elevation: 0,
		borderRadius: 5,
		backgroundColor: selected ? theme.colors.primaryLight : theme.colors.backgroundElement,
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

	const [selectedCatIdx, setSelectedCatIdx] = useState(0);
	const styles = useThemedStyle(styleCreator);

	const [provider] = useHTTPGet(`/provider/${providerId}`, undefined, lastP[providerId]);
	lastP[providerId] = provider;

	const services = useMemo(() => groupServices(provider?.services), [provider]);
	const hasCats = services?.categoryList.length > 1;

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

const styleCreator = (theme) => StyleSheet.create({
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

export default TabServices;