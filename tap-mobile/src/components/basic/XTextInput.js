import React from "react";
import { StyleSheet, TextInput } from "react-native";
import { useThemedStyle } from "../../style/ThemeContext";
import { useStore } from "../../store/store";
import XFieldContainer from "./XFieldContainer";

const XTextInput = React.forwardRef((props, ref) => {

	const appFont = useStore(state => state.app.font);
	const styles = useThemedStyle(createStyle, appFont);

	return (
		<XFieldContainer {...props}>
			<TextInput ref={ref} {...props} style={styles.field} editable={!!props.editable || !props.disabled} />
		</XFieldContainer>
	);
});

const createStyle = (_, font) => StyleSheet.create({
	field: {
		fontFamily: font,
		fontSize: 15
	}
});

export default XTextInput;