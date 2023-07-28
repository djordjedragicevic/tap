import { StyleSheet, Switch } from "react-native";
import XFieldContainer from "./XFieldContainer";
import { View } from "react-native";
import XText from "./XText";
import { useState } from "react";
import { emptyFn } from "../../common/utils";
import { usePrimaryColor } from "../../style/ThemeContext";

const XSwitchField = ({ title, onSwitch = emptyFn, on = false, ...rest }) => {
	const pC = usePrimaryColor();
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
