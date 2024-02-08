import { Pressable, StyleSheet, View } from "react-native";
import XText from "../basic/XText";
import { useCallback } from "react";
import { useThemedStyle } from "../../style/ThemeContext";
import XToolbarContainer from "../XToolbarContainer";
import { Theme } from "../../style/themes";



export const XTabViewToolbarItem = ({ title, onPress, selected, minItemWidth }) => {

	const styles = useThemedStyle(styleCreator, minItemWidth);

	return (
		<Pressable
			onPress={onPress}
			style={styles.tabItem}
		>
			<View style={styles.tabItemContainer}>
				<View style={styles.tabTextContainer}>
					<XText bold style={styles.tabText}>{title}</XText>
				</View>
				<View style={[styles.tabMarker, selected && styles.tabMarkerSelected]} />
			</View>
		</Pressable>
	);
};

const XTabViewToolbar = ({ items, selectedIdx, onItemPress, style }) => {

	const onItemRender = useCallback((item, index, minItemWidth) => {
		return (
			<XTabViewToolbarItem
				key={(index + 1).toString()}
				title={item.title}
				onPress={() => onItemPress(index)}
				selected={selectedIdx === index}
				minItemWidth={minItemWidth}
			/>
		)
	}, [selectedIdx, onItemPress]);

	return (
		<XToolbarContainer
			items={items}
			onItemRender={onItemRender}
			style={style}
		/>
	);
};

const styleCreator = (theme, minItemWidth) => StyleSheet.create({
	tabItem: {
		flex: 1,
		minWidth: minItemWidth,

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
		backgroundColor: 'transparent',
		width: '70%',
		maxWidth: 70,
		height: 5,
		alignSelf: 'center',
		borderTopEndRadius: Theme.values.borderRadius,
		borderTopStartRadius: Theme.values.borderRadius
	},
	tabMarkerSelected: {
		backgroundColor: theme.colors.primary
	}
});
export default XTabViewToolbar;