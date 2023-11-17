import { StyleSheet, View } from "react-native";
import XText from "./XText";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import { forwardRef, useCallback } from "react";
import { useThemedStyle } from "../../style/ThemeContext";
import { Theme } from "../../style/themes";


const XBottomSheetModal = forwardRef(({ title, titleHeight = 40, children, ...rest }, sheetRef) => {

	const renderBackdrop = useCallback((props) => {
		return <BottomSheetBackdrop
			{...props}
			appearsOnIndex={0}
			disappearsOnIndex={-1}
			opacity={0.2}
		/>
	}, []);

	const styles = useThemedStyle(styleCreate, titleHeight);

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
				<View style={styles.title}>
					<XText size={18}>{title}</XText>
				</View>
			}
			{children}
		</BottomSheetModal>
	);
});

const styleCreate = (theme, titleHeight) => StyleSheet.create({
	title: {
		height: titleHeight,
		paddingHorizontal: 22,
		borderBottomColor: theme.colors.borderColor,
		borderBottomWidth: Theme.values.borderWidth
	},
	modal: {
		backgroundColor: theme.colors.backgroundElement
	}
})

export default XBottomSheetModal;