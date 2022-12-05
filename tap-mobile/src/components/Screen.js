import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Screen = ({ style, center, children }) => {
	const dynStyle = useMemo(() => {
		const dS = {};
		if (center) {
			dS.alignItems = 'center';
			dS.justifyContent = 'center';
		}
		return dS;
	}, [center]);

	return (
		<SafeAreaView style={[styles.screen, style, dynStyle]}>
			{children}
		</SafeAreaView>
	);
};

Screen.defaultProps = {
	style: {},
	center: false
};

const styles = StyleSheet.create({
	screen: {
		flex: 1
	}
});

export default Screen;