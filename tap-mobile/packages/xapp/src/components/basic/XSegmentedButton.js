import { Pressable, StyleSheet, View } from "react-native";
import XText from "./XText";
import { useThemedStyle } from "../../style/ThemeContext";
import { useState } from "react";
import { emptyFn } from "../../common/utils";
import { Theme } from "../../style/themes";

const XSegment = ({ item, onPress, selected }) => {
	const styles = useThemedStyle(styleCreator, selected);
	return (
		<Pressable style={styles.segment} onPress={onPress}>
			<XText light={selected} bold numberOfLines={1} style={styles.segmentText}>
				{item.text}
			</XText>
		</Pressable>
	);
};

const XSegmentedButton = ({
	options,
	initialIndex,
	style,
	onSelect = emptyFn,
	onDeselect = emptyFn,
	multiselect = false
}) => {

	const [selectedIdxs, setSelectedIdxs] = useState(Array.from({ length: options.length }, (_, idx) => {
		return initialIndex === idx || (Array.isArray(initialIndex) && !!initialIndex.find(i => i === idx));
	}));
	const styles = useThemedStyle(styleCreator);

	const onSegmentPress = (idx) => {

		const isSelected = selectedIdxs[idx];

		let newState;
		if (multiselect) {
			newState = [...selectedIdxs];
			newState[idx] = !newState[idx];
			(isSelected ? onDeselect : onSelect)(options[idx]);
			setSelectedIdxs(newState);
		}
		else if (!isSelected) {
			newState = selectedIdxs.map(() => false);
			newState[idx] = true;
			onSelect(options[idx]);
			setSelectedIdxs(newState);
		}
	};

	return (
		<View style={[styles.container, style]}>
			{options.map((o, idx) => <XSegment
				key={o.id}
				item={o}
				selected={selectedIdxs[idx]}
				isLast={(options.length - 1) === idx}
				onPress={() => onSegmentPress(idx)}
			/>)}
		</View>
	);
};

export default XSegmentedButton;

const styleCreator = (theme, selected) => {
	return StyleSheet.create({
		container: {
			borderColor: theme.colors.borderColor,
			borderWidth: Theme.values.borderWidth,
			flexDirection: 'row',
			height: 40,
			padding: 4,
			borderRadius: Theme.values.borderRadius,
			backgroundColor: theme.colors.backgroundElement,
			overflow: 'hidden'

		},
		segment: {
			flex: 1,
			flexDirection: 'row',
			borderColor: theme.colors.secondary,
			borderRadius: Theme.values.borderRadius,
			paddingHorizontal: 8,
			alignItems: 'center',
			justifyContent: 'center',
			backgroundColor: theme.colors[selected ? 'secondary' : 'backgroundElement']
		},
		segmentText: {
			color: selected ? theme.colors.textLight : theme.colors.textPrimary
		},
		icon: {
			color: theme.colors.secondary,
		}
	})
};