import { Pressable } from "react-native";
import XIcon from "./basic/XIcon";
import { useCallback } from "react";
import { useColor } from "../style/ThemeContext";

const XHeaderButtonBack = ({ navigation, ...rest }) => {

	const color = useColor('textLight');

	return (
		<Pressable {...rest} style={{ marginHorizontal: 15 }}>
			<XIcon icon='arrowleft' color={color} />
		</Pressable>
	);
}

export default XHeaderButtonBack;