import { StyleSheet } from "react-native";
import XButtonIcon from "./basic/XButtonIcon";
import { useColor } from "../style/ThemeContext";
import { Theme } from "../style/themes";

const XHeaderButtonBackAbsolute = ({
	navigation,
	bgOpacity = 0.6,
	bgColorName = Theme.vars.secondary,
	iconColorName = Theme.vars.textLight
}) => {

	const sColor = useColor(bgColorName)

	return (
		<XButtonIcon
			icon='arrowleft'
			colorName={iconColorName}
			onPress={navigation.goBack}
			backgroundColor={sColor}
			style={styles.headerButtonLeft}
			bgOpacity={bgOpacity}
		/>
	);
};

const styles = StyleSheet.create({
	headerButtonLeft: {
		position: 'absolute',
		start: 8,
		top: 8
	}
});

export default XHeaderButtonBackAbsolute;