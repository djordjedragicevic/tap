import { Dimensions, Pressable, ScrollView, View } from "react-native";
import XText from "../basic/XText";
import { useCallback, useMemo } from "react";
import { useColor } from "../../style/ThemeContext";

const MIN_TAB_WIDTH = 100;
const TAB_BAR_H_PADDING = 0;
const { width } = Dimensions.get("screen");


const XTabViewToolbarItem = ({ title, onPress, selected, selectedColor }) => {
	return (
		<Pressable
			onPress={onPress}
			style={{
				flex: 1,
				minWidth: MIN_TAB_WIDTH
			}}
		>
			<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
				<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
					<XText bold secondary>{title}</XText>
				</View>
				<View
					style={{
						backgroundColor: selected ? selectedColor : 'transparent',
						width: '30%',
						maxWidth: 20,
						height: 4,
						alignSelf: 'center',
						borderRadius: 7
					}}
				/>
			</View>
		</Pressable>
	);
}

const XTabViewToolbar = ({ items, selectedIdx, onItemPress }) => {

	const sColor = useColor('secondary');

	const onItemRender = useCallback((item, index) => {
		return (
			<XTabViewToolbarItem
				key={(index + 1).toString()}
				title={item.title}
				onPress={() => onItemPress(index)}
				selected={selectedIdx === index}
				selectedColor={sColor}
			/>
		)
	}, [selectedIdx, sColor]);


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
						style={{
							height: 40,
							paddingHorizontal: TAB_BAR_H_PADDING,
							paddingVertical: 3
						}}>
						{items.map(onItemRender)}
					</ScrollView>
					:
					<View
						style={{
							height: 40,
							paddingHorizontal: TAB_BAR_H_PADDING,
							flexDirection: 'row',
							paddingVertical: 3
						}}>
						{items.map(onItemRender)}
					</View>
			}
		</>
	);
}

export default XTabViewToolbar;