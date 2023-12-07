import { memo, useCallback, useEffect, useState } from "react";
import { SectionList, View, StyleSheet, Pressable } from "react-native";
import { Http } from "xapp/src/common/Http";
import { groupServices } from "xapp/src/common/general";
import XScreen from "xapp/src/components/XScreen";
import XCheckBox from "xapp/src/components/basic/XCheckBox";
import XText from "xapp/src/components/basic/XText";
import { useTranslation } from "xapp/src/i18n/I18nContext";
import { useThemedStyle } from "xapp/src/style/ThemeContext";
import { Theme } from "xapp/src/style/themes";

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


	const dur = (durationTo ? duration + ' - ' + durationTo : duration) + ' ' + t('min') + '.'
	return (
		<Pressable
			onPress={onPress}
			style={tStyles.container}
		>
			<View style={{ alignSelf: 'center' }}>
				<XCheckBox checked={isSelected} setChecked={onPress} size={14} />
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

const ServiceManagementScreen = () => {
	const [services, setServices] = useState();
	const [selectedCatIdx, setSelectedCatIdx] = useState(0);
	const [selected, setSelected] = useState([]);
	const styles = useThemedStyle(styleCreator);

	const onItemPress = useCallback((itemId) => {
		console.log("SELECT");
		const selectedIdx = selected.indexOf(itemId);
		if (selectedIdx > -1) {
			setSelected(old => old.filter(oldId => oldId !== itemId));
		}
		else
			setSelected(old => [...old, itemId])

	}, [selected]);
	
	useEffect(() => {
		Http.get('/service-management/list')
			.then(resp => {
				setServices(groupServices(resp));
			})
	}, []);

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


	return (
		<XScreen>
			<SectionList
				sections={services?.categories[services.categoryList[selectedCatIdx].id].groups || []}
				renderItem={renderItem}
				renderSectionHeader={renderSectionHeader}
				contentContainerStyle={styles.sContentContainerStyle}
				showsVerticalScrollIndicator={true}
				scrollEventThrottle={16}
			/>
		</XScreen>
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
		marginTop: 5,
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

export default ServiceManagementScreen;