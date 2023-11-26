import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { forwardRef, useCallback, useMemo } from "react";
import { View, useWindowDimensions, StyleSheet } from "react-native";
import XText from "./XText";
import XBottomSheetModal from "./XBottomSheetModal";
import XCheckBox from "./XCheckBox";
import XFieldContainer from "./XFieldContainer";
import XButton from "./XButton";
import XButtonIcon from "./XButtonIcon";
import { Theme } from "../../style/themes";
import { useThemedStyle } from "../../style/ThemeContext";

const titleHeight = 40;
const rowHeight = 40
const rowVerticalMargin = 5;


const XBottomSheetSelector = forwardRef(({
	data = [],
	onItemSelect,
	multiselect = false,
	selectedId = [],
	closeOnSelect = true,
	onMultiConfirm,
	onMultiReject,
	onMultiClear,
	...rest
}, sheetRef) => {

	const styles = useThemedStyle(styleCreator);

	const renderItem = useCallback(({ item }) => {
		return (
			<XFieldContainer
				title={item.title}
				style={{ height: rowHeight, marginVertical: rowVerticalMargin }}
				iconLeft={() => <XCheckBox round checked={multiselect && Array.isArray(selectedId) ? !!selectedId.find(i => i === item.id) : item.id === selectedId} />}
				onPress={() => {
					onItemSelect(item);
					if (closeOnSelect)
						sheetRef?.current?.close();
				}}
			>
				<View style={{ flex: 1, justifyContent: 'center' }}>
					<XText>{item.title || item.name}</XText>
				</View>
			</XFieldContainer>
		)
	}, [onItemSelect, selectedId]);

	const keyExtractor = useCallback(i => i.id);

	const snapPoints = useMemo(() => {
		const h = (data.length * rowHeight) + titleHeight + ((data.length * 2) * rowVerticalMargin) + 50;
		return [h]
	}, [data?.length]);

	return (
		<XBottomSheetModal
			{...rest}
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
					<XButton flex title={'Odustani'} onPress={onMultiReject} />
					<XButton flex title={'Potvrdi'} primary onPress={onMultiConfirm} />
				</View>
			}
		</XBottomSheetModal>
	);
});

const styleCreator = (theme) => StyleSheet.create({
	buttons: {
		flexDirection: 'row',
		padding: 10,
		columnGap: 5,
		borderTopColor: theme.colors.borderColor,
		borderTopWidth: Theme.values.borderWidth
	}
})

export default XBottomSheetSelector;