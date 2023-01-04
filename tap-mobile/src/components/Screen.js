import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { values } from "../style/themes";

const Screen = ({ style, center, children, flat }) => {
	const dynStyle = useMemo(() => {
		const dS = {};
		if (center) {
			dS.alignItems = 'center';
			dS.justifyContent = 'center';
		}
		if (!flat) {
			dS.marginHorizontal = values.mainPaddingHorizontal;
			dS.marginTop = values.mainPaddingHorizontal;
		}
		return dS;
	}, [center, flat]);

	return (
		<SafeAreaView style={[styles.screen, style, dynStyle]}>
			{children}
		</SafeAreaView>
	);
};

Screen.defaultProps = {
	style: {},
	center: false,
	flat: false
};

const styles = StyleSheet.create({
	screen: {
		flex: 1
	}
});

export default Screen;