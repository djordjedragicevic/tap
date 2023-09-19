import { StyleSheet, Switch, View } from "react-native";
import XFieldContainer from "./XFieldContainer";
import XText from "./XText";
import { emptyFn } from "../../common/utils";

const XSwitchField = ({ title, onSwitch = emptyFn, on = false, ...rest }) => {
	return (
		<XFieldContainer {...rest}>
			<View style={styles.container}>
				<XText size={18}>{title}</XText>
				<Switch
					thumbColor={on ? "#2196f3" : "#f4f3f4"}
					trackColor={{ true: "#b3cfff", false: "#767577" }}
					ios_backgroundColor="#3e3e3e"
					onValueChange={onSwitch}
					value={on}
				/>
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
