import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { forwardRef, useCallback, useMemo } from "react";
import { View } from "react-native";
import XText from "./XText";
import XBottomSheetModal from "./XBottomSheetModal";


const XBottomSheetSelector = forwardRef(({ data = [], ...rest }, sheetRef) => {
	const renderItem = useCallback(
		({ item }) => (
			<View style={{
				padding: 10,
				marginVertical: 5,
				backgroundColor: "#eee",
			}}>
				<XText>{item}</XText>
			</View>
		),
		[]
	);

	const snapPoints = useMemo(() => [200], []);

	return (
		<XBottomSheetModal
			{...rest}
			snapPoints={snapPoints}
			ref={sheetRef}
		>
			<BottomSheetFlatList
				data={data}
				keyExtractor={(i) => i}
				renderItem={renderItem}
				contentContainerStyle={{ backgroundColor: "white" }}
			/>
		</XBottomSheetModal>
	);
});

export default XBottomSheetSelector;