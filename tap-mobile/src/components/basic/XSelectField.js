import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import XFieldContainer from "./XFieldContainer";
import XText from "./XText";
import { AntDesign } from '@expo/vector-icons';


const XSelectField = ({
	title,
	value,
	placeholder,
	pressable = true,
	iconRight = (props) => (<AntDesign name="right" {...props} />),
	meta,
	...rest
}) => {

	const T = useMemo(() => {
		if (title != null)
			return <XText size={18} ellipsizeMode={'tail'} numberOfLines={1}>{title}</XText>
		else if (placeholder != null)
			return <XText size={18} tertiary ellipsizeMode={'tail'} numberOfLines={1}>{placeholder}</XText>
		else
			return null;
	}, [title, placeholder]);

	return (
		<XFieldContainer pressable={pressable} iconRight={iconRight} meta={meta} {...rest}>
			<View style={styles.textContainer}>
				<View style={{ flex: 2, paddingEnd: 5 }}>{T}</View>
				<View style={{ flex: 1, alignItems: 'flex-end' }}>
					{!!value && <XText secondary size={18} ellipsizeMode={'tail'} numberOfLines={1}>{value}</XText>}
				</View>
			</View>
		</XFieldContainer >
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