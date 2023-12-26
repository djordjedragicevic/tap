import { Pressable } from "react-native";
import XIcon from "./basic/XIcon";
import { useColor } from "../style/ThemeContext";

const XHeaderButtonDelete = ({ navigation, ...rest }) => {

	const color = useColor('textLight');

	return (
		<Pressable {...rest} style={{ marginHorizontal: 15 }}>
			<XIcon icon='delete' color={color} />
		</Pressable>
	);
}

export default XHeaderButtonDelete;