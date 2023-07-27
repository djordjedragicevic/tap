import { StyleSheet, Switch } from "react-native";
import XFieldContainer from "./XFieldContainer";
import { View } from "react-native";
import XText from "./XText";

const XSwitchField = ({ title, ...rest }) => {
	return (
		<XFieldContainer {...rest}>
			<View style={styles.container}>
				<XText size={18}>{title}</XText>
				<Switch />
			</View>
		</XFieldContainer>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	}
})

export default XSwitchField;
