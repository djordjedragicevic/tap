import React, { useCallback, useState } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import { TabView, TabBar } from 'react-native-tab-view';
import { Theme } from "../../style/themes";
import XText from "../basic/XText";
import { useThemedStyle } from "../../style/ThemeContext";

export const XTabView = ({ routes, renderScene }) => {

	const [index, setIndex] = useState(0);

	const layout = useWindowDimensions();

	const styles = useThemedStyle(styleCreator);

	const renderLabel = useCallback(({ route, focused }) => (
		<XText bold colorPrimary={focused}>{route.title}</XText>
	), []);

	return (
		<TabView
			navigationState={{ index, routes }}
			renderTabBar={props => (
				<TabBar
					{...props}
					style={styles.tabBar}
					pressColor='transparent'
					renderLabel={renderLabel}
					indicatorStyle={styles.indicator}
				/>
			)}
			renderScene={renderScene}
			onIndexChange={setIndex}
			initialLayout={{ width: layout.width }}
		/>
	);
};

const styleCreator = (theme) => StyleSheet.create({
	indicator: {
		backgroundColor: theme.colors.primary,
		height: 5,
		borderTopEndRadius: Theme.values.borderRadius,
		borderTopStartRadius: Theme.values.borderRadius
	},
	tabBar: {
		backgroundColor: theme.colors.backgroundElement,
		elevation: 0
	}
});
