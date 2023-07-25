import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Theme } from "../style/themes";

const Screen = ({
	children,
	style = {},
	center = false,
	flat = false,
	marginTop = Theme.values.mainPaddingHorizontal
}) => {

	const dynStyle = useMemo(() => {
		const dS = {
			flex: 1
		};
		if (center) {
			dS.alignItems = 'center';
			dS.justifyContent = 'center';
		}
		if (!flat) {
			dS.marginHorizontal = Theme.values.mainPaddingHorizontal;
			dS.marginTop = marginTop
		}
		return dS;
	}, [center, flat, marginTop]);

	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={[style, dynStyle]}>
				{children}
			</View>
			{/* <View style={{ backgroundColor: 'red', position: 'absolute', height: 3, width: '100%' }}></View> */}
		</SafeAreaView>
	);
};


const styles = StyleSheet.create({
	safeArea: {
		flex: 1
	}
});

export default Screen;