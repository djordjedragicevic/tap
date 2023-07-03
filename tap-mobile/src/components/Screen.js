import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { values } from "../style/themes";

const Screen = ({
	children,
	style = {},
	center = false,
	flat = false,
	marginTop = values.mainPaddingHorizontal
}) => {

	const insets = useSafeAreaInsets();

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
		<View style={{
			paddingTop: insets.top,
			paddingBottom: insets.bottom,
			paddingLeft: insets.left,
			paddingRight: insets.right,
			flex: 1
		}}>
			<View style={[style, dynStyle]}>
				{children}
			</View>
			{/* <View style={{ backgroundColor: 'red', position: 'absolute', height: 3, width: '100%' }}></View> */}
		</View>
	);
};


// const styles = StyleSheet.create({
// 	screen: {
// 		flex: 1
// 	}
// });

export default Screen;