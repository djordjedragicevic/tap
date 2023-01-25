import { StyleSheet, View } from "react-native";
import { useThemedStyle } from "../../store/ThemeContext";

const TimePeriodsPanel = ({ height, children }) => {

	const styles = useThemedStyle(createStyle);

	return (
		<View style={[styles.panel, { height }]}>
			<View style={styles.left} />
			<View style={styles.right}>
				{children}
			</View>


		</View>
	)
};

const createStyle = (theme) => StyleSheet.create({
	panel: {
		flexDirection: 'row',
		borderWidth: 1
	},
	left: {
		backgroundColor: 'purple',
		opacity: 0.5,
		flex: 1,
		maxWidth: 70
	},
	right: {
		backgroundColor: 'gray',
		flex: 1,
		paddingHorizontal: 10,
		alignItems: 'center'
	}
});


export default TimePeriodsPanel;