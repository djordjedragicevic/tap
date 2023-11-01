import { StyleSheet, View } from "react-native";
import XIcon from "./basic/XIcon";
import XText from "./basic/XText";
import { useColor } from "../style/ThemeContext";

const XEmptyListIcon = ({ text }) => {
	const iconColor = useColor('textTertiary');
	return (
		<View style={styles.constainer}>
			<View style={styles.inner}>
				<XIcon color={iconColor} icon='scan1' size={64} />
				<XText secondary size={16}>{text}</XText>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	constainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	inner: {
		alignItems: 'center',
		justifyContent: 'center',
		rowGap: 15
	}
})

export default XEmptyListIcon;