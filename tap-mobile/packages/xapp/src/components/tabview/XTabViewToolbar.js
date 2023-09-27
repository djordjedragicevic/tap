import { Dimensions, Pressable, ScrollView, StyleSheet, View } from "react-native";
import XText from "../basic/XText";
import { useCallback, useMemo } from "react";
import { useColor, useThemedStyle } from "../../style/ThemeContext";

const MIN_TAB_WIDTH = 100;
const TAB_BAR_H_PADDING = 0;
const { width } = Dimensions.get("screen");


const XTabViewToolbarItem = ({ title, onPress, selected }) => {

	const styles = useThemedStyle(styleCreator, selected);

	return (
		<Pressable
			onPress={onPress}
			style={styles.tabItem}
		>
			<View style={styles.tabItemContainer}>
				<View style={styles.tabTextContainer}>
					<XText bold style={styles.tabText}>{title}</XText>
				</View>
				<View style={styles.tabMarker} />
			</View>
		</Pressable>
	);
}

const XTabViewToolbar = ({ items, selectedIdx, onItemPress, style }) => {

	const styles = useThemedStyle(styleCreator);

	const onItemRender = useCallback((item, index) => {
		return (
			<XTabViewToolbarItem
				key={(index + 1).toString()}
				title={item.title}
				onPress={() => onItemPress(index)}
				selected={selectedIdx === index}
			/>
		)
	}, [selectedIdx]);


	const useScroll = useMemo(() => {
		return ((items.length * MIN_TAB_WIDTH) + (2 * TAB_BAR_H_PADDING)) > width;
	}, [items.length])

	return (
		<>
			{
				useScroll ?
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						style={[styles.tabBar, style]}>
						{items.map(onItemRender)}
					</ScrollView>
					:
					<View
						style={[styles.tabBar, style]}>
						{items.map(onItemRender)}
					</View>
			}
		</>
	);
};

const styleCreator = (theme, selected) => StyleSheet.create({
	tabBar: {
		height: 50,
		paddingHorizontal: TAB_BAR_H_PADDING,
		paddingVertical: 3,
		flexDirection: 'row'
	},
	tabItem: {
		flex: 1,
		minWidth: MIN_TAB_WIDTH
	},
	tabText: {
		color: theme.colors.textPrimary
	},
	tabItemContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	tabTextContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	tabMarker: {
		backgroundColor: selected ? theme.colors.secondary : 'transparent',
		width: '30%',
		maxWidth: 20,
		height: 4,
		alignSelf: 'center',
		borderRadius: 7
	}
})
export default XTabViewToolbar;