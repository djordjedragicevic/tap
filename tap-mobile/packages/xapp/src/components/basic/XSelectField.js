import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import XFieldContainer from "./XFieldContainer";
import XText from "./XText";
import { AntDesign } from '@expo/vector-icons';
import { usePrimaryColor, useThemedStyle } from "../../style/ThemeContext";


const XSelectField = ({
	title,
	value,
	placeholder,
	pressable = true,
	iconRight = (props) => (<AntDesign name="down"  {...props} />),
	meta,
	vertical = false,
	valueParams = {},
	titleParams = {},
	...rest
}) => {

	const primaryColor = usePrimaryColor();
	const styles = useThemedStyle(styleCreator, vertical);

	const T = useMemo(() => {
		if (React.isValidElement(title))
			return <>{title}</>
		if (title != null)
			return <XText ellipsizeMode={'tail'} numberOfLines={1} {...titleParams}>{title}</XText>
		else if (placeholder != null)
			return <XText tertiary ellipsizeMode={'tail'} numberOfLines={1}  {...titleParams}>{placeholder}</XText>
		else
			return null;
	}, [title, placeholder, titleParams]);

	return (
		<XFieldContainer
			pressable={pressable}
			iconRight={iconRight}
			iconRightColor={primaryColor}
			meta={meta}
			{...rest}
		>
			<View style={styles.textContainer}>
				{T}
				{!!value && <XText
					secondary
					ellipsizeMode={'tail'}
					numberOfLines={1}
					color={primaryColor}
					style={{ color: primaryColor }}
					{...valueParams}
				>{value}</XText>}
			</View>
		</XFieldContainer>
	);
};

const styleCreator = (theme, vertical) => {

	return StyleSheet.create({
		textContainer: !vertical ?
			{
				flexDirection: 'row',
				alignItems: 'center',
				justifyContent: 'space-between'
			}
			:
			{
				flexDirection: 'column',
				height: '100%',
				justifyContent: 'space-evenly'
			},
		textTitle: {
			//paddingEnd: 5,
			//flex: 1
		},
		textValue: {
			//maxWidth: 150,
			//minWidth: 80,
			//alignItems: 'flex-end'
		}
	})
}

export default XSelectField;