import React, { useCallback, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { useColor, useThemedStyle } from "../../style/ThemeContext";
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
		editable = true,
		disabled,
		clearable = false,
		value,
		onClear,
		...rest
	},
	ref) => {

	const [focused, setFocused] = useState(false);
	const appFont = useStore(state => state.app.font);
	const styles = useThemedStyle(createStyle, appFont, focused);
	const tSecondary = useColor('textSecondary');

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
			<XFieldContainer
				focused={focused}
				outline={outline}
				style={fieldContainerStyle}
				disabled={disabled}
				iconRight={clearable && !!value && focused ? 'close' : undefined}
				iconRightColor={tSecondary}
				iconRightDisabled={!value}
				onIconRightPress={onClear}
			>
				<TextInput
					ref={ref}
					{...rest}
					value={value}
					style={[styles.field, fieldStyle]}
					editable={editable && !disabled}
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
		paddingHorizontal: 10,
		paddingVertical: 3
	},
	field: {
		fontFamily: font,
		color: theme.colors.textPrimary
	}
});

export default XTextInput;