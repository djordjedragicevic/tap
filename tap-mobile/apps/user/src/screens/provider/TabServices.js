import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useHTTPGet } from "xapp/src/common/Http";
import { StyleSheet, Pressable, View, SectionList } from "react-native";
import { Theme } from "xapp/src/style/themes";
import XCheckBox from "xapp/src/components/basic/XCheckBox";
import XText from "xapp/src/components/basic/XText";
import XToolbarContainer from "xapp/src/components/XToolbarContainer";
import { useThemedStyle } from "xapp/src/style/ThemeContext";
import { useTranslation } from "xapp/src/i18n/I18nContext";
import { groupServices } from "xapp/src/common/general";

let lastP = {};

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
		<Pressable onPress={onItemPress} style={tStyles.row}>
			<View style={tStyles.rowChbCnt}>
				<XCheckBox checked={isSelected} setChecked={onItemPress} size={14} />
			</View>

			<View style={tStyles.nameCnt}>
				<View style={tStyles.rowText}>
					<XText>{name}</XText>
					{note && <XText secondary size={12}>{note}</XText>}
				</View>

				<View style={tStyles.rowRightCnt}>
					<XText size={16} style={tStyles.price}>{price} KM</XText>
					<XText size={12} secondary>{dur}</XText>
				</View>
			</View>

		</Pressable>
	)
}, areSIEqual);

const serviceItemSC = (theme) => StyleSheet.create({
	price: {
		color: theme.colors.primary
	},
	nameCnt: {
		flex: 1,
		paddingStart: 5,
		flexDirection: 'row',
		alignItems: 'center'
	},
	row: {
		paddingHorizontal: 8,
		paddingVertical: 3,
		borderRadius: Theme.values.borderRadius,
		backgroundColor: theme.colors.backgroundElement,
		flexDirection: 'row'
	},
	rowText: {
		flex: 1
	},
	rowRightCnt: {
		alignItems: 'flex-end'
	},
	rowChbCnt: {
		alignSelf: 'center'
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
						<XText size={15}>{title}</XText>
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
					tabBarHMargin={5}
					barHeight={38}
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
		paddingVertical: 8,
		backgroundColor: theme.colors.primaryLight,
		borderRadius: Theme.values.borderRadius
	},
	sContentContainerStyle: {
		padding: 10,
		//marginTop: 5,
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