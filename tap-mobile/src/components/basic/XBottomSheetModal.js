import { View } from "react-native";
import XText from "./XText";
import { BottomSheetBackdrop, BottomSheetFlatList, BottomSheetModal } from "@gorhom/bottom-sheet";
import { forwardRef, useCallback } from "react";


const XBottomSheetModal = forwardRef(({ title, children, ...rest }, sheetRef) => {
	const renderBackdrop = useCallback((props) => {
		return <BottomSheetBackdrop
			{...props}
			appearsOnIndex={0}
			disappearsOnIndex={-1}
			opacity={0.2}
		/>
	}, []);

	return (
		<BottomSheetModal
			ref={sheetRef}
			index={0}
			backdropComponent={renderBackdrop}
			style={{ paddingHorizontal: 10 }}
			{...rest}
		>
			{
				!!title &&
				<View>
					<XText style={{ fontSize: 22 }}>Odaberi temu</XText>
				</View>
			}
			{children}
		</BottomSheetModal>
	);
});

export default XBottomSheetModal;