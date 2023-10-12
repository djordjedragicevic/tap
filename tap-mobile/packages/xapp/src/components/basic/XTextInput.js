import React, { useCallback, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { useThemedStyle } from "../../style/ThemeContext";
import { useStore } from "../../store/store";
import XFieldContainer from "./XFieldContainer";
import XText from "./XText";

const XTextInput = React.forwardRef((
	{
		title,
		style,
		fieldStyle,
		fieldContainerStyle,
		outline,
		...rest
	},
	ref) => {

	const [focused, setFocused] = useState(false);
	const appFont = useStore(state => state.app.font);
	const styles = useThemedStyle(createStyle, appFont, focused);

	const onFocus = useCallback(() => {
		rest.onFocus?.();
		setFocused(true);
	}, [setFocused]);

	const onBlur = useCallback(() => {
		setFocused(false);
		rest.onBlur?.();
	}, [setFocused]);

	return (
		<View style={style}>
			{!!title &&
				<View style={styles.titleContainer}>
					<XText style={styles.title}>{title}</XText>
				</View>
			}
			<XFieldContainer focused={focused} outline={outline} style={fieldContainerStyle}>
				<TextInput
					ref={ref}
					{...rest}
					style={[styles.field, fieldStyle]}
					editable={!!rest.editable || !rest.disabled}
					onFocus={onFocus}
					onBlur={onBlur}
				/>
			</XFieldContainer>
		</View>
	);
});

const createStyle = (theme, font, focused) => StyleSheet.create({
	title: {
		color: focused ? theme.colors.primary : theme.colors.textSecondary
	},
	titleContainer: {
		paddingHorizontal: 4,
		paddingVertical: 4
	},
	field: {
		fontFamily: font,
		fontSize: 15,
		color: theme.colors.textPrimary
	}
});

export default XTextInput;