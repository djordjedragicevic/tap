import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { values } from "../style/themes";

const Screen = ({
	children,
	style = {},
	center = false,
	flat = false,
	marginTop = values.mainPaddingHorizontal
}) => {

	const dynStyle = useMemo(() => {
		const dS = {};
		if (center) {
			dS.alignItems = 'center';
			dS.justifyContent = 'center';
		}
		if (!flat) {
			dS.marginHorizontal = values.mainPaddingHorizontal;
			dS.marginTop = marginTop
		}
		return dS;
	}, [center, flat, marginTop]);

	return (
		<SafeAreaView style={style.safeArea}>
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