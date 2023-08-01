import { StyleSheet, View } from "react-native";
import XText from "./XText";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import { forwardRef, useCallback } from "react";
import { useThemedStyle } from "../../style/ThemeContext";


const XBottomSheetModal = forwardRef(({ title, titleHeight = 40, children, ...rest }, sheetRef) => {

	const renderBackdrop = useCallback((props) => {
		return <BottomSheetBackdrop
			{...props}
			appearsOnIndex={0}
			disappearsOnIndex={-1}
			opacity={0.2}
		/>
	}, []);

	const styles = useThemedStyle(styleCreate);

	return (
		<BottomSheetModal
			ref={sheetRef}
			index={0}
			backdropComponent={renderBackdrop}
			backgroundStyle={styles.modal}
			{...rest}
		>
			{
				!!title &&
				<View height={titleHeight}>
					<XText style={{ fontSize: 22, paddingHorizontal: 12 }}>{title}</XText>
				</View>
			}
			{children}
		</BottomSheetModal>
	);
});

const styleCreate = (theme) => StyleSheet.create({
	modal: {
		backgroundColor: theme.colors.backgroundElement
	}
})

export default XBottomSheetModal;