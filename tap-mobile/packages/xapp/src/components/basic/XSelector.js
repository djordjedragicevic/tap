import React, { useCallback, useEffect, useRef, useState } from "react";
import XBottomSheetSelector from "./XBottomSheetSelector";
import { emptyFn } from "../../common/utils";
import XSelectField from "./XSelectField";


const XSelector = ({
	data,
	onItemSelect = emptyFn,
	initSelectedIdx = 0,
	selectedId = [],
	multiselect = false,
	closeOnSelect = true,
	selector = {
		title: ''
	},
	...rest
}) => {

	const selectorRef = useRef(null);
	const [intSelectedId, setIntSelectedId] = useState(selectedId);

	useEffect(() => {
		setIntSelectedId(selectedId)
	}, [selectedId]);

	const onItemSelectInt = useCallback((item) => {
		if (multiselect) {
			const newSel = [...intSelectedId];
			const existIdx = newSel.findIndex(s => s === item.id);
			if (existIdx > -1)
				newSel.splice(existIdx, 1);
			else
				newSel.push(item.id);

			setIntSelectedId(newSel);
		}
		else {
			onItemSelect(item.id);
			setIntSelectedId(item.id);
		}
	}, [onItemSelect, multiselect, setIntSelectedId, intSelectedId]);

	const onMultiConfirm = useCallback(() => {
		onItemSelect(intSelectedId);
		selectorRef?.current.close();
	}, [intSelectedId, onItemSelect]);

	const onMultiReject = useCallback(() => {
		setIntSelectedId(selectedId);
		selectorRef?.current.close();
	}, [selectedId]);

	const onMultiClear = useCallback(() => {
		setIntSelectedId([]);
	}, [setIntSelectedId]);

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
					multiselect={multiselect}
					closeOnSelect={closeOnSelect}
					selectedId={intSelectedId}
					onItemSelect={onItemSelectInt}
					onMultiConfirm={onMultiConfirm}
					onMultiReject={onMultiReject}
					onMultiClear={onMultiClear}
				/>
			}
		</>
	);
};

export default XSelector;