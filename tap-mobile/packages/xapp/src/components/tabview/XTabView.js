import React, { Children, useCallback, useMemo, useState } from "react";
import XTabViewToolbar from "./XTabViewToolbar";
import { emptyFn } from "../../common/utils";
import { View } from "react-native";

export const XTabScreen = ({ component = emptyFn }) => null;

export const XTabView = ({ onTabPress = emptyFn, children, tabBarStyle, ...other }) => {

	const [selectedTabIdx, setSelectedTabIdx] = useState(0);

	const onTabPressIntern = useCallback((index) => {
		setSelectedTabIdx(index)
		onTabPress(index);
	}, [setSelectedTabIdx, onTabPress]);

	const tabsData = useMemo(() => {
		let currIdx = 0;

		return Children.map(children, (c) => {
			if (!React.isValidElement(c) || (c.type.name !== XTabScreen.name))
				console.error('Expected type of children is "XTabScreen". Got wrong type at index: ' + currIdx);

			return {
				title: c.props.title,
				id: c.props.id,
				idx: currIdx++
			}
		});
	}, [children, onTabPressIntern]);

	return (
		<View {...other}>
			<XTabViewToolbar
				items={tabsData}
				onItemPress={onTabPressIntern}
				selectedIdx={selectedTabIdx}
				style={tabBarStyle}
			/>
			<View
				{...children[selectedTabIdx].props}
				style={[children[selectedTabIdx].props.style]}
			>
				{children[selectedTabIdx].props.component?.() || children[selectedTabIdx].props.children}
			</View>
		</View>
	);
};

