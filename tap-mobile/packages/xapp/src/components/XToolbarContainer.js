import { useCallback, useMemo } from "react";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import { useThemedStyle } from "../style/ThemeContext";

const { width } = Dimensions.get("screen");
const TAB_BAR_H_PADDING = 0;

export const MIN_TAB_WIDTH = 100;

const XToolbarContainer = ({
	onItemRender,
	items,
	style,
	minItemWidth = MIN_TAB_WIDTH,
	tabBarHPadding = TAB_BAR_H_PADDING,
	barHeight = 50
}) => {
	const styles = useThemedStyle(styleCreator, tabBarHPadding, barHeight);

	const useScroll = useMemo(() => {
		return ((items.length * minItemWidth) + (2 * tabBarHPadding)) > width;
	}, [items.length, minItemWidth]);

	const onItemRenderIntern = useCallback((i, idx) => {
		return onItemRender(i, idx, minItemWidth);
	}, [minItemWidth, onItemRender]);

	return (
		<>
			{
				useScroll ?
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						style={[styles.tabBar, style]}
					>
						{items.map(onItemRenderIntern)}
					</ScrollView>
					:
					<View
						style={[styles.tabBar, style]}
					>
						{items.map(onItemRenderIntern)}
					</View>
			}
		</>
	);
};

const styleCreator = (_, tabBarHPadding, barHeight) => StyleSheet.create({
	tabBar: {
		minHeight: barHeight,
		maxHeight: barHeight,
		paddingHorizontal: tabBarHPadding,
		flexDirection: 'row'
	}
});

export default XToolbarContainer;