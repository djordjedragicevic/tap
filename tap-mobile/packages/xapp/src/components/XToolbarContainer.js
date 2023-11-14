import { useCallback, useMemo } from "react";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import { useThemedStyle } from "../style/ThemeContext";

const { width } = Dimensions.get("screen");
const TAB_BAR_H_PADDING = 0;
const TAB_BAR_V_PADDING = 0;

export const MIN_TAB_WIDTH = 100;

const XToolbarContainer = ({
	onItemRender,
	items = [],
	style,
	minItemWidth = MIN_TAB_WIDTH,
	tabBarHPadding = TAB_BAR_H_PADDING,
	tabBarVPadding = TAB_BAR_V_PADDING,
	barHeight = 50
}) => {
	const styles = useThemedStyle(styleCreator, tabBarHPadding, barHeight, minItemWidth, tabBarVPadding);

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
						contentContainerStyle={[styles.tabBar, style]}
					>
						{items.map((i, idx) => (
							<View
								key={i.id || (idx + 1).toString()}
								style={styles.itemContainer}
							>
								{onItemRenderIntern(i, idx)}
							</View>
						)
						)}
					</ScrollView>
					:
					<View
						style={[styles.tabBar, style]}
					>
						{items.map((i, idx) => (
							<View
								key={i.id || (idx + 1).toString()}
								style={styles.itemContainer}
							>
								{onItemRenderIntern(i, idx)}
							</View>
						)
						)}
					</View>
			}
		</>
	);
};

const styleCreator = (_, tabBarHPadding, barHeight, itemMinW, tabBarVPadding) => StyleSheet.create({
	tabBar: {
		minHeight: barHeight,
		maxHeight: barHeight,
		paddingHorizontal: tabBarHPadding,
		paddingVertical: tabBarVPadding,
		flexDirection: 'row'
	},
	itemContainer: {
		minWidth: itemMinW,
		flex: 1
	}
});

export default XToolbarContainer;