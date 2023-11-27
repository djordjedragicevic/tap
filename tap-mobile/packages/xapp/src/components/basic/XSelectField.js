import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import XFieldContainer from "./XFieldContainer";
import XText from "./XText";
import { useColor, useThemedStyle } from "../../style/ThemeContext";


const XSelectField = ({
	title,
	value,
	placeholder,
	pressable = true,
	iconRight = 'down',
	meta,
	vertical = false,
	valueParams = {},
	titleParams = {},
	...rest
}) => {

	const iRC = useColor('textSecondary');
	const styles = useThemedStyle(styleCreator, vertical);

	const T = useMemo(() => {
		if (React.isValidElement(title))
			return <>{title}</>
		if (title != null)
			return <XText oneLine secondary {...titleParams}>{title}</XText>
		else if (placeholder != null)
			return <XText tertiary oneLine {...titleParams}>{placeholder}</XText>
		else
			return null;
	}, [title, placeholder, titleParams]);

	return (
		<XFieldContainer
			pressable={pressable}
			iconRight={iconRight}
			iconRightSize={14}
			iconRightColor={iRC}
			meta={meta}
			{...rest}
		>
			<View style={styles.textContainer}>
				{T}
				{!!value &&
					<XText
						primary
						ellipsizeMode={'tail'}
						numberOfLines={1}
						{...valueParams}
					>
						{value}
					</XText>
				}
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
			}
	})
}

export default XSelectField;