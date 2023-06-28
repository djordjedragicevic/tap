import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { useThemedStyle } from "../../style/ThemeContext";
import XFieldContainer from "./XFieldContainer";
import XText from "./XText";

const XSelectField = ({ value, placeholder, ...rest }) => {

	const styles = useThemedStyle(createStyle);

	const T = useMemo(() => {
		if (value != null)
			return <XText style={styles.textValue}>{value}</XText>
		else if (placeholder != null)
			return <XText style={styles.textPlaceholder}>{placeholder}</XText>
		else
			return null;
	}, [value, placeholder, styles]);

	return (
		<XFieldContainer {...rest} pressable>
			{T}
		</XFieldContainer>
	);
};

const createStyle = (theme) => StyleSheet.create({
	textValue: {
		fontSize: 17,
		color: theme.colors.textPrimary
	},
	textPlaceholder: {
		fontSize: 17,
		color: theme.colors.textTertiary
	}
})

export default XSelectField;