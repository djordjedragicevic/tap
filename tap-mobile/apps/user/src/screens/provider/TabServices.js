import { memo, useCallback, useMemo, useState } from "react";
import { StyleSheet, Pressable, View, SectionList } from "react-native";
import { Theme } from "xapp/src/style/themes";
import XCheckBox from "xapp/src/components/basic/XCheckBox";
import XText from "xapp/src/components/basic/XText";
import XToolbarContainer from "xapp/src/components/XToolbarContainer";
import { useThemedStyle } from "xapp/src/style/ThemeContext";
import { useTranslation } from "xapp/src/i18n/I18nContext";
import { groupServices } from "xapp/src/common/general";
import { CurrencyUtils } from "xapp/src/common/utils";
import XEmptyListIcon from "xapp/src/components/XEmptyListIcon";

const areSIEqual = (oldProps, newProps) => {
	return oldProps.id === newProps.id && oldProps.isSelected === newProps.isSelected;
};

const ServiceItem = memo(({
	onPress = emptyFn,
	isSelected = false,
	item
}) => {

	const tStyles = useThemedStyle(serviceItemSC);
	const t = useTranslation();

	const onItemPress = () => onPress(item);

	const dur = (item.durationTo ? item.duration + ' - ' + item.durationTo : item.duration) + ' ' + t('min') + '.'
	return (
		<Pressable onPress={onItemPress} style={tStyles.row}>
			<View style={tStyles.rowChbCnt}>
				<XCheckBox checked={isSelected} setChecked={onItemPress} size={14} />
			</View>

			<View style={tStyles.nameCnt}>
				<View style={tStyles.rowText}>
					<XText>{item.name}</XText>
					{item.note && <XText secondary size={12}>{item.note}</XText>}
				</View>

				<View style={tStyles.rowRightCnt}>
					<XText size={16} style={tStyles.price}>{CurrencyUtils.convert(item.price)}</XText>
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
	selected,
	setSelected,
	servicesRaw,
}) => {

	const [selectedCatIdx, setSelectedCatIdx] = useState(0);

	const styles = useThemedStyle(styleCreator);
	const t = useTranslation();

	const services = useMemo(() => {
		if (Array.isArray(servicesRaw) && servicesRaw.length > 0)
			return groupServices(servicesRaw);
	}, [servicesRaw]);

	const onItemPress = useCallback((item) => {
		const selectedIndex = selected.findIndex(s => s.id === item.id);
		if (selectedIndex > -1) {
			setSelected(old => {
				old.splice(selectedIndex, 1);
				return [...old];
			});
		}
		else
			setSelected(old => [...(old || []), item])

	}, [selected]);

	const renderItem = useCallback(({ item }) => (
		<ServiceItem
			key={item.id}
			onPress={onItemPress}
			isSelected={selected.findIndex(s => s.id === item.id) > -1}
			item={item}
		/>
	), [selected, onItemPress]);

	const renderSectionHeader = useCallback(({ section: { title } }) => {
		return (
			<>
				{
					title !== '__default' &&

					<View style={styles.sHeaderContainer}>
						<View style={styles.sHeaderLineBef} />
						<XText bold size={15} secondary>{title}</XText>
						<View style={styles.sHeaderLineAf} />
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


	if (!services)
		return <XEmptyListIcon text={t('No services')} iconSize={40} />

	return (
		<View style={{ flex: 1 }}>
			{
				services?.categoryList.length > 1 &&
				<XToolbarContainer
					items={services?.categoryList || []}
					onItemRender={onCategoryRender}
					minItemWidth={90}
					tabBarHMargin={5}
					barHeight={38}
					tabBarVMargin={10}
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
		flexDirection: 'row',
		alignItems: 'center',
		padding: 5,
		paddingTop: 15,
		paddingBottom: 0,
		borderRadius: Theme.values.borderRadius
	},
	sHeaderLineBef: {
		borderBottomWidth: Theme.values.borderWidth,
		borderColor: theme.colors.borderColor,
		width: 30,
		marginEnd: 15
	},
	sHeaderLineAf: {
		borderBottomWidth: Theme.values.borderWidth,
		borderColor: theme.colors.borderColor,
		flex: 1,
		marginStart: 15
	},
	sContentContainerStyle: {
		padding: 10,
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

export default memo(TabServices);