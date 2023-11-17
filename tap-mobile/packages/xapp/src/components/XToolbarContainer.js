import { useCallback, useMemo } from "react";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import { useThemedStyle } from "../style/ThemeContext";

const { width } = Dimensions.get("screen");
const TAB_BAR_H_MARGIN = 0;
const TAB_BAR_V_MARGIN = 0;

export const MIN_TAB_WIDTH = 100;

const XToolbarContainer = ({
	onItemRender,
	items = [],
	style,
	minItemWidth = MIN_TAB_WIDTH,
	tabBarHMargin = TAB_BAR_H_MARGIN,
	tabBarVMargin = TAB_BAR_V_MARGIN,
	barHeight = 50
}) => {
	const styles = useThemedStyle(styleCreator, tabBarHMargin, barHeight, minItemWidth, tabBarVMargin);

	const useScroll = useMemo(() => {
		return ((items.length * minItemWidth) + (2 * tabBarHMargin)) > width;
	}, [items.length, minItemWidth]);

	const onItemRenderIntern = useCallback((i, idx) => {
		return onItemRender(i, idx, minItemWidth);
	}, [minItemWidth, onItemRender]);

	const Items = useMemo(() => {
		return items.map((i, idx) => (
			<View
				key={i.id || (idx + 1).toString()}
				style={styles.itemContainer}
			>
				{onItemRenderIntern(i, idx)}
			</View>
		));

	}, [items, onItemRenderIntern]);

	return (
		<View style={[styles.barContainer, style]}>
			{
				useScroll ?
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
					>
						{Items}
					</ScrollView>
					:
					<View style={[styles.barPlain]}>
						{Items}
					</View>
			}
		</View>
	);
};

const styleCreator = (_, tabBarHMargin, barHeight, itemMinW, tabBarVMargin) => StyleSheet.create({
	barContainer: {
		marginVertical: tabBarVMargin,
		marginHorizontal: tabBarHMargin,
		height: barHeight
	},
	scrollBar: {
		maxHeight: barHeight,
		minHeight: barHeight
	},
	barPlain: {
		flex: 1,
		flexDirection: 'row'
	},
	itemContainer: {
		flex: 1,
		minWidth: itemMinW
	}
});

export default XToolbarContainer;