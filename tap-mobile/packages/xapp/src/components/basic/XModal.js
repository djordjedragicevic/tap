import { Modal, Pressable, StyleSheet, View } from "react-native";
import { useThemedStyle } from "../../style/ThemeContext";
import { Theme } from "../../style/themes";
import { useEffect, useState } from "react";
import { emptyFn } from "../../common/utils";

const XModal = ({ children, style, visible = false, onHide = emptyFn, ...other }) => {

	const styles = useThemedStyle(styleCreator);
	const [visInt, setVisInt] = useState(visible);

	useEffect(() => {
		setVisInt(visible);
	}, [visible]);



	return (
		<Modal
			transparent
			visible={visible}
			{...other}
		>
			<Pressable style={[styles.container]} onPress={() => setVisInt(false)}>
				<View style={[styles.modalContainer, style]}>
					{children}
				</View>
			</Pressable>
		</Modal>
	);
};

const styleCreator = (theme) => StyleSheet.create({
	container: {
		flex: 1,
		//backgroundColor: 'red',
		//alignItems: 'center',
		justifyContent: 'center'
		//backgroundColor: theme.colors.backgroundElement
	},
	modalContainer: {
		flex: 1,
		borderRadius: Theme.values.borderRadius,
		marginHorizontal: 20,
		minHeight: 100,
		maxHeight: '80%',
		backgroundColor: theme.colors.backgroundElement
	}
});

export default XModal;