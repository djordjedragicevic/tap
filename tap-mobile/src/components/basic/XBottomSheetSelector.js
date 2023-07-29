import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { forwardRef, useCallback, useMemo, useState } from "react";
import { View } from "react-native";
import XText from "./XText";
import XBottomSheetModal from "./XBottomSheetModal";
import XCheckBox from "./XCheckBox";
import XFieldContainer from "./XFieldContainer";

const titleHeight = 40;
const rowHeight = 40
const rowVerticalMargin = 5;

const XBottomSheetSelector = forwardRef(({ data = [], onItemSelect, multiselect = false, selectedId = [], closeOnSelect = true, ...rest }, sheetRef) => {

	const renderItem = useCallback(({ item, index }) => {
		return <XFieldContainer
			title={item.title}
			onPress={() => {
				onItemSelect(item);
				//setSel([item.id]);
				if (closeOnSelect)
					sheetRef?.current?.close();
			}}
			style={{ height: rowHeight, marginVertical: rowVerticalMargin }}
			iconRight={() => <XCheckBox round checked={multiselect ? false : item.id === selectedId} />}
		>
			<View style={{ flex: 1, justifyContent: 'center' }}>
				<XText size={15}>{item.title}</XText>
			</View>
		</XFieldContainer>
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
		</XBottomSheetModal>
	);
});

export default XBottomSheetSelector;