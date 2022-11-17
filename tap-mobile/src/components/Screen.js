import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Screen = (props) => {
	return (
		<SafeAreaView style={[style.screen, props.style]}>
			{props.children}
		</SafeAreaView>
	);
};

Screen.defaultProps = {
	style: {}
};

const style = StyleSheet.create({
	screen: {
		flex: 1
	}
});

export default Screen;