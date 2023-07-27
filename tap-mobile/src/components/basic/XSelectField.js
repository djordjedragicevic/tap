import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import XFieldContainer from "./XFieldContainer";
import XText from "./XText";

const XSelectField = ({ title, value, placeholder, pressable = true, ...rest }) => {

	const T = useMemo(() => {
		if (title != null)
			return <XText size={18}>{title}</XText>
		else if (placeholder != null)
			return <XText size={18} tertiary>{placeholder}</XText>
		else
			return null;
	}, [title, placeholder]);

	return (
		<XFieldContainer pressable={pressable} {...rest}>
			<View style={styles.textContainer}>
				{T}
				{!!value && <XText secondary size={18}>{value}</XText>}
			</View>
		</XFieldContainer>
	);
};

const styles = StyleSheet.create({
	textContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	}
})

export default XSelectField;