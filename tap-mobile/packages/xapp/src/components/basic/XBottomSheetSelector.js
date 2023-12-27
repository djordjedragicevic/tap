import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { View, StyleSheet } from "react-native";
import XText from "./XText";
import XBottomSheetModal from "./XBottomSheetModal";
import XCheckBox from "./XCheckBox";
import XFieldContainer from "./XFieldContainer";
import XButton from "./XButton";
import XButtonIcon from "./XButtonIcon";
import { Theme } from "../../style/themes";
import { useThemedStyle } from "../../style/ThemeContext";
import { useTranslation } from "../../i18n/I18nContext";
import { emptyFn } from "../../common/utils";

const titleHeight = 40;
const rowHeight = 40
const rowVerticalMargin = 5;
const multiButtonsHeight = 50;

const XBottomSheetSelector = forwardRef(({
	data = [],
	onItemSelect,
	multiselect = false,
	selected = [],
	initSelectedIdx,
	closeOnSelect = true,
	visible = false,
	setVisible = emptyFn,
	...rest
}, outRef) => {


	const styles = useThemedStyle(styleCreator);
	const [selectedIntern, setSelectedIntern] = useState(selected && !Array.isArray(selected) ? [selected] : selected || []);
	const t = useTranslation();
	const sheetRef = useRef(outRef);

	useEffect(() => {
		if (visible) {
			setSelectedIntern(selected && !Array.isArray(selected) ? [selected] : selected || [])
			sheetRef?.current?.present();
		}
		else
			sheetRef?.current?.close();
	}, [visible, selected]);

	const renderItem = useCallback(({ item }) => {
		const isChecked = Array.isArray(selectedIntern) ? !!selectedIntern?.find(i => i.id === item.id) : selectedIntern?.id === item.id;
		return (
			<XFieldContainer
				title={item.title}
				style={{ height: rowHeight, marginVertical: rowVerticalMargin }}
				iconLeft={() => <XCheckBox round checked={isChecked} />}
				onPress={() => {
					if (multiselect) {
						const newItems = selectedIntern ? [...selectedIntern] : [];
						const existIdx = newItems.findIndex(i => i.id === item.id);
						if (existIdx > -1)
							newItems.splice(existIdx, 1);
						else
							newItems.push(item);
						setSelectedIntern(newItems);
					}
					else {
						if (closeOnSelect)
							setVisible(false);
						onItemSelect(item);
					}
				}}
			>
				<View style={{ flex: 1, justifyContent: 'center' }}>
					<XText>{item.title || item.name}</XText>
				</View>
			</XFieldContainer>
		)
	}, [onItemSelect, selectedIntern, multiselect]);

	const keyExtractor = useCallback(i => i.id);

	const snapPoints = useMemo(() => {
		const h = (data.length * rowHeight) + titleHeight + ((data.length * 2) * rowVerticalMargin) + 50;
		return [h + (multiselect ? multiButtonsHeight : 0)]
	}, [data?.length, multiselect]);

	const onMultiConfirm = useCallback(() => {
		onItemSelect([...selectedIntern]);
		setSelectedIntern([]);
		setVisible(false)
	}, [onItemSelect, selectedIntern, setSelectedIntern, setVisible]);

	const onMultiClear = useCallback(() => {
		setSelectedIntern([]);
	}, [setSelectedIntern]);

	const onDismiss = useCallback(() => {
		setVisible(false);
		setSelectedIntern(selected && !Array.isArray(selected) ? [selected] : selected || []);
	}, [setVisible, setSelectedIntern, selected]);

	return (
		<XBottomSheetModal
			{...rest}
			onDismiss={onDismiss}
			snapPoints={snapPoints}
			ref={sheetRef}
			titleHeight={titleHeight}
		>
			<BottomSheetFlatList
				data={data}
				keyExtractor={keyExtractor}
				renderItem={renderItem}
				contentContainerStyle={{ paddingHorizontal: 8 }}
			/>
			{multiselect &&
				<View style={styles.buttons}>
					<XButtonIcon icon='close' onPress={onMultiClear} />
					<XButton flex title={t('Cancel')} onPress={onDismiss} />
					<XButton flex title={t('OK')} primary onPress={onMultiConfirm} />
				</View>
			}
		</XBottomSheetModal>
	);
});

const styleCreator = (theme) => StyleSheet.create({
	buttons: {
		flexDirection: 'row',
		height: multiButtonsHeight,
		alignItems: 'center',
		paddingHorizontal: 5,
		columnGap: 5,
		borderTopColor: theme.colors.borderColor,
		borderTopWidth: Theme.values.borderWidth
	}
})

export default XBottomSheetSelector;