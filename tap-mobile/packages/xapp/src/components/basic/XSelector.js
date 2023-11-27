import React, { useCallback, useRef, useState } from "react";
import XBottomSheetSelector from "./XBottomSheetSelector";
import { emptyFn } from "../../common/utils";
import XSelectField from "./XSelectField";


const XSelector = ({
	data,
	onItemSelect = emptyFn,
	initSelectedIdx,
	selected,
	multiselect = false,
	closeOnSelect = true,
	selector = {
		title: ''
	},
	...rest
}) => {

	const [visible, setVisible] = useState(false);

	const onPress = useCallback(() => {
		setVisible(true);
	}, [setVisible]);


	return (
		<>
			<XSelectField
				{...rest}
				onPress={onPress}
			/>
			{data &&
				<XBottomSheetSelector
					visible={visible}
					setVisible={setVisible}
					initSelectedIdx
					title={selector.title}
					data={data}
					multiselect={multiselect}
					closeOnSelect={closeOnSelect}
					selected={selected}
					onItemSelect={onItemSelect}
				/>
			}
		</>
	);
};

export default XSelector;