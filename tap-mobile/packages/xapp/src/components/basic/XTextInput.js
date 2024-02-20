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
		textarea = false,
		multiline,
		iconLeft,
		iconLeftStyle,
		blurIconColor,
		...rest
	},
	ref) => {

	const [focused, setFocused] = useState(false);
	const appFont = useStore(state => state.app.font);
	const styles = useThemedStyle(createStyle, appFont, focused, blurIconColor);
	const [tSecondary, tTertiary] = useColor(['textSecondary', 'textTertiary']);

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
				iconLeft={iconLeft}
				outline={outline}
				style={[textarea && styles.textAreaCommentFieldCntStyle, fieldContainerStyle]}
				disabled={disabled}
				iconRight={clearable && !!value && focused ? 'close' : undefined}
				iconRightColor={tSecondary}
				iconRightDisabled={!value}
				iconLeftStyle={iconLeftStyle}
				onIconRightPress={onClear}
				blurIconColor={blurIconColor}
			>
				<TextInput
					ref={ref}
					{...rest}
					multiline={textarea || multiline}
					placeholderTextColor={tTertiary}
					value={value}
					style={[styles.field, textarea && styles.textAreaCommentFieldStyle, fieldStyle]}
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
	},
	textAreaCommentFieldStyle: {
		flex: 1,
		textAlignVertical: 'top'
	},
	textAreaCommentFieldCntStyle: {
		height: 100
	}
});

export default XTextInput;