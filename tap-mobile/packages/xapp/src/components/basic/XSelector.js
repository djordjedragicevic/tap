import React, { useCallback, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import XBottomSheetSelector from "./XBottomSheetSelector";
import { emptyFn } from "../../common/utils";
import XSelectField from "./XSelectField";


const XSelector = ({
	data,
	onItemSelect = emptyFn,
	initSelectedIdx = 0,
	selector = {
		title: ''
	},
	...rest
}) => {

	const [selected, setSelected] = useState(data[initSelectedIdx]);
	const selectorRef = useRef(null);

	const onItemSelectInt = useCallback((item) => {
		onItemSelect(item);
		setSelected(item);
		selectorRef?.current.close();
	}, [onItemSelect, setSelected, selectorRef]);

	const onPress = useCallback(() => {
		selectorRef?.current.present();
	}, [selectorRef]);


	return (
		<>
			<XSelectField
				{...rest}
				onPress={onPress}
			/>
			{data &&
				<XBottomSheetSelector
					ref={selectorRef}
					title={selector.title}
					data={data}
					selectedId={selected.id}
					onItemSelect={onItemSelectInt}
				/>
			}
		</>
	);
};

const styles = StyleSheet.create({
	textContainer: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	textTitle: {
		paddingEnd: 5,
		flex: 1
	},
	textValue: {
		maxWidth: 150,
		minWidth: 80,
		alignItems: 'flex-end'
	}
})

export default XSelector;