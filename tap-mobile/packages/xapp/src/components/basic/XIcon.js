import { AntDesign } from "@expo/vector-icons";
import React, { memo, useMemo } from "react";
import { useColor } from "../../style/ThemeContext";


const XIcon = ({ icon, children, color, size = 23 }) => {

	const tSC = useColor('textSecondary');
	const iconColor = color || tSC;

	const Icon = useMemo(() => {
		if (typeof icon === 'string')
			return <AntDesign name={icon} size={size} color={iconColor} />
		else if (typeof icon === 'function')
			return icon({ size, color: iconColor })
		else if (React.isValidElement(children))
			return children;
	}, [icon, children, size, color])

	return (
		<>
			{Icon}
		</>
	)
};

export default memo(XIcon);