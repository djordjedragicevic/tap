import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { Theme } from "../style/themes";
import { emptyFn } from "../common/utils";

const XScreen = ({
	children,
	style = {},
	center = false,
	flat = false,
	marginTop = Theme.values.mainPaddingHorizontal,
	loading = false,
	scroll = false,
	Footer
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
			dS.paddingHorizontal = Theme.values.mainPaddingHorizontal;
			dS.marginTop = marginTop;
			if (!scroll)
				dS.marginBottom = marginTop;
		}
		return dS;
	}, [center, flat, marginTop, scroll]);

	const VCmp = scroll ? ScrollView : View;

	return (
		<SafeAreaView style={styles.safeArea}>
			<VCmp style={[style, dynStyle]}>
				{children}
			</VCmp>
			{loading && <View style={{ backgroundColor: 'red', position: 'absolute', height: 3, width: '100%' }}></View>}
			{Footer}
		</SafeAreaView>
	);
};


const styles = StyleSheet.create({
	safeArea: {
		flex: 1
	}
});

export default XScreen;