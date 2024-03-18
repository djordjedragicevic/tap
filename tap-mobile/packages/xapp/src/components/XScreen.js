import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { Theme } from "../style/themes";
import XLoadingBar from "./XLoadingBar";
import XText from "./basic/XText";

const XScreen = ({
	children,
	style = {},
	center = false,
	flat = false,
	marginTop = Theme.values.mainPaddingHorizontal,
	loading = false,
	scroll = false,
	bigTitle = null,
	keyboard = false,
	bigSubTitle = null,
	Footer,
	rowGap = 0
}) => {

	const dynStyle = useMemo(() => {
		const dS = {
			flex: 1,
			rowGap: rowGap
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
	}, [center, flat, marginTop, scroll, rowGap]);

	const VCmp = scroll ? ScrollView : View;

	return (
		<SafeAreaView style={styles.safeArea}>
			<VCmp style={[style, dynStyle]}>

				{!!bigTitle &&
					<View style={styles.bigTitle}>
						<XText size={Theme.values.bigTitleSize}>{bigTitle}</XText>
					</View>
				}
				{children}
			</VCmp>
			{loading && <XLoadingBar />}
			{Footer}
		</SafeAreaView>
	);
};


const styles = StyleSheet.create({
	safeArea: {
		flex: 1
	},
	bigTitle: {
		height: 100,
		marginTop: 40,
		//borderWidth: 1,
		justifyContent: 'center',
		alignItems: 'center'
	}
});

export default XScreen;