import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import XFieldContainer from "./XFieldContainer";
import XText from "./XText";
import { AntDesign } from '@expo/vector-icons';
import { usePrimaryColor } from "../../style/ThemeContext";


const XSelectField = ({
	title,
	value,
	placeholder,
	pressable = true,
	iconRight = (props) => (<AntDesign name="down"  {...props} />),
	meta,
	...rest
}) => {

	const primaryColor = usePrimaryColor();

	const T = useMemo(() => {
		if (title != null)
			return <XText ellipsizeMode={'tail'} numberOfLines={1}>{title}</XText>
		else if (placeholder != null)
			return <XText tertiary ellipsizeMode={'tail'} numberOfLines={1}>{placeholder}</XText>
		else
			return null;
	}, [title, placeholder]);

	return (
		<XFieldContainer
			pressable={pressable}
			iconRight={iconRight}
			iconRightColor={primaryColor}
			meta={meta}
			{...rest}
		>
			<View style={styles.textContainer}>
				<View style={styles.textTitle}>{T}</View>
				<View style={styles.textValue}>
					{!!value && <XText
						secondary
						ellipsizeMode={'tail'}
						numberOfLines={1}
						color={primaryColor}
						style={{ color: primaryColor }}
					>{value}</XText>}
				</View>
			</View>
		</XFieldContainer >
	);
};

const styles = StyleSheet.create({
	textContainer: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	textTitle: {
		paddingEnd: 5,
		flex: 1
	},
	textValue: {
		maxWidth: 150,
		minWidth: 80,
		alignItems: 'flex-end'
	}
})

export default XSelectField;