import { useCallback, useState } from 'react';
import XToolbarContainer from './XToolbarContainer';
import { Pressable, StyleSheet, View } from 'react-native';
import { Theme } from '../style/themes';
import { useThemedStyle } from '../style/ThemeContext';
import { emptyFn } from '../common/utils';
import XText from './basic/XText';
import XIcon from './basic/XIcon';

const XToolbar = ({
	items = [],
	barHeight,
	tabBarHMargin,
	tabBarVMargin,
	minItemWidth,
	initialSelectedIdx = 0,
	onChange = emptyFn,
	onItemRender = emptyFn,
	icon,
	itemStyle,
	...rest
}) => {

	const [selectedIdx, setSelectedIdx] = useState(initialSelectedIdx);

	const styles = useThemedStyle(styleCreator);

	const onToolbarItemRender = useCallback((item, idx) => {
		return (
			<Pressable
				style={[styles.tabItem, selectedIdx === idx && styles.tabItemSelected, itemStyle]}
				onPress={() => {
					const old = selectedIdx;
					onChange(idx, old);
					setSelectedIdx(idx);
				}}
			>
				{
					(icon instanceof Function) ?
						<View style={styles.tabIcon}>
							{icon(item)}
						</View>
						:
						(
							icon &&
							<View style={styles.tabIcon}>
								<XIcon icon={icon} />
							</View>
						)
				}

				<View style={styles.tabText}>
					<XText
						light={selectedIdx !== idx}
						colorPrimary={selectedIdx === idx}
						bold
					>
						{item.title || item.name}
					</XText>
				</View>

			</Pressable>
		)
	}, [selectedIdx, setSelectedIdx, onChange, items]);

	return (
		<XToolbarContainer
			barHeight={barHeight}
			tabBarHMargin={tabBarHMargin}
			tabBarVMargin={tabBarVMargin}
			minItemWidth={minItemWidth}
			items={items}
			onItemRender={onToolbarItemRender}
			style={[styles.toolbar]}
			{...rest}

		/>
	);
};

const styleCreator = (theme) => StyleSheet.create({
	toolbar: {
		backgroundColor: theme.colors.secondary
	},
	tabItem: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		//borderRadius: Theme.values.borderRadius,
		flex: 1,
		columnGap: Theme.values.mainPaddingHorizontal
	},
	tabItemSelected: {
		borderBottomWidth: 2,
		borderBottomColor: theme.colors.primary
		//backgroundColor: theme.colors.secondary
	},
	tabText: {
		alignItems: 'center'
	},
	tabIcon: {
	}
});

export default XToolbar;