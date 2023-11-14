import { StyleSheet, View } from "react-native";
import XText from "./basic/XText";

const XTextLabels = ({
	items = [],
	style,
	styleLabels,
	styleValues,
	textSize = 14
}) => {
	return (
		<View style={[styles.container, style]}>
			<View style={[styles.left, styleLabels]}>
				{items.map((i, idx) =>
					<XText
						key={idx.toString() + i.label}
						size={i.size || textSize}
						secondary
					>
						{i.label}{i !== '-' && ':'}
					</XText>
				)}
			</View>
			<View style={[styles.right, styleValues]}>
				{items.map((i, idx) =>
					<XText
						key={idx.toString() + i.value}
						size={i.size || textSize}
					>
						{i.value}
					</XText>
				)}
			</View>
		</View>
	);
};


const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'row',
		columnGap: 10
	},
	left: {
		alignItems: 'flex-end'
	},
	right: {
		flex: 1
	}
});

export default XTextLabels;