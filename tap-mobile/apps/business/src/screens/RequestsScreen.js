import { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Http } from "xapp/src/common/Http";
import { CurrencyUtils, emptyFn, getInitials } from "xapp/src/common/utils";
import XScreen from "xapp/src/components/XScreen";
import XTextLabels from "xapp/src/components/XTextLabels";
import XEmptyListIcon from "xapp/src/components/XEmptyListIcon";
import XAvatar from "xapp/src/components/basic/XAvatar";
import XButton from "xapp/src/components/basic/XButton";
import XButtonIcon from "xapp/src/components/basic/XButtonIcon";
import XSection from "xapp/src/components/basic/XSection";
import XText from "xapp/src/components/basic/XText";
import { useDateCode, useTranslation } from "xapp/src/i18n/I18nContext";
import { useStore } from "xapp/src/store/store";
import { useThemedStyle } from "xapp/src/style/ThemeContext";
import { Theme } from "xapp/src/style/themes";


const AppointmentItem = ({ item, styles, selected, onPress }) => {
	return (
		<XSection
			style={styles.section}
			title={item.startDate + ' ' + item.startTime + ' - ' + item.endTime}
			styleContent={[styles.sectionContainer, selected && styles.sectionSelected]}
			titleRight={(<XText bold>{CurrencyUtils.convert(item.sPrice)}</XText>)}
			onPress={() => onPress(item.id)}
		>
			<View>
				<XAvatar
					size={40}
					initials={getInitials(null, null, item.eName)}
					imgPath={item.eImagePath}
				/>
			</View>
			<View style={styles.sectionContentMiddle}>
				<XTextLabels items={item.labels} />
			</View>
		</XSection>
	)
};


const RequestsScreen = () => {

	const [loading, setLoading] = useState(false);
	const [reload, setReload] = useState(1);
	const [data, setData] = useState([]);
	const dateCode = useDateCode();
	const t = useTranslation();
	const [selected, setSelected] = useState([]);
	const styles = useThemedStyle(styleCreator);

	useEffect(() => {
		setLoading(true);
		let finish = true;
		Http.get(`/appointments/waiting`)
			.then(resp => {
				if (finish) {
					let tmpD;
					resp.forEach(r => {
						tmpD = new Date(r.start);
						r.startTime = tmpD.toLocaleTimeString(dateCode, { hour: '2-digit', minute: '2-digit', hour12: false });
						r.startDate = tmpD.toLocaleDateString(dateCode, { day: 'numeric', month: 'long', year: 'numeric' });
						tmpD = new Date(r.end);
						r.endTime = tmpD.toLocaleTimeString(dateCode, { hour: '2-digit', minute: '2-digit', hour12: false });
						r.endDate = tmpD.toLocaleDateString(dateCode, { day: 'numeric', month: 'long', year: 'numeric' });
						r.labels = [
							{ label: t('Service'), value: r.sName + (r.sGName ? ' (' + r.sGName + ')' : '') },
							{ label: t('Employee'), value: r.eName },
							{ label: t('User'), value: r.uUsername }
						]
					});

					setData(resp);
				}
			})
			.catch(emptyFn)
			.finally(setLoading);

		return () => {
			finish = false;
			setLoading(false);
		}
	}, [dateCode, reload, t]);

	const acceptSelected = useCallback(() => {
		Http.post('/appointments/accept/multi', selected)
			.then(() => {
				setReload(old => old + 1)
				setSelected([]);
			})
			.catch(emptyFn);
	}, [selected]);

	const onItemPress = useCallback((id) => {
		const selectedIdx = selected.indexOf(id);
		if (selectedIdx > -1) {
			selected.splice(selectedIdx, 1)
			setSelected([...selected])
		}
		else {
			setSelected([...selected, id]);
		}
	}, [selected, setSelected]);

	const renderItem = useCallback(({ item }) => {
		return (
			<AppointmentItem
				item={item}
				styles={styles}
				onPress={onItemPress}
				selected={selected.indexOf(item.id) > -1}
			/>
		)
	}, [t, selected]);

	return (
		<XScreen loading={loading}>
			<FlatList
				data={data}
				renderItem={renderItem}
				contentContainerStyle={styles.list}
				refreshing={!!loading}
				onRefresh={() => setReload(old => old + 1)}
				ListEmptyComponent={<XEmptyListIcon text />}
			/>
			{
				!!data?.length &&
				<View style={styles.controlContainer}>
					<XButtonIcon
						disabled={!selected.length}
						size={Theme.values.buttonHeight}
						icon={'close'}
						onPress={() => setSelected([])}
					/>
					<XButton
						style={styles.acceptBtn}
						primary
						disabled={!selected.length}
						title={(selected.length > 1 ? t('Accept All') : t('Accept')) + (selected.length ? ' ' + selected.length : '')}
						onPress={acceptSelected}
					/>
				</View>
			}
		</XScreen>
	);
};

const styleCreator = (theme) => StyleSheet.create({
	list: {
		rowGap: 10,
		flex: 1
	},
	controlContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		columnGap: Theme.values.mainPaddingHorizontal
	},
	acceptBtn: {
		flex: 1
	},
	section: {
		borderWidth: Theme.values.borderWidth,
		borderColor: theme.colors.borderColor
	},
	sectionSelected: {
		backgroundColor: theme.colors.primaryLight
	},
	sectionContainer: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	sectionContentMiddle: {
		flex: 1,
		paddingStart: 10
	}
});

export default RequestsScreen;