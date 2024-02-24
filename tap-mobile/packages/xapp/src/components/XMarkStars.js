import { StyleSheet, View, Pressable } from "react-native";
import { useTranslation } from "../i18n/I18nContext";
import { useColor } from "../style/ThemeContext";
import XChip from "./basic/XChip";
import { AntDesign } from "@expo/vector-icons";
import XText from "./basic/XText";
import React from "react";

const XMarkStars = ({
	mark,
	reviewCount,
	style,
	starsGap = 0,
	showChip = true,
	starSize = 18,
	onStarPress,
	starStyle
}) => {

	const starCount = Math.floor(mark);
	const stars = Array.from({ length: 5 }, (_, idx) => idx + 1);
	const cSecondary = useColor('secondary');
	const t = useTranslation();

	return (
		<View style={[styles.cnt, style]}>
			{showChip && <XChip primary text={mark ? mark?.toFixed(1) : ' - '} style={styles.markChip} />}
			<View style={[styles.markCnt, { columnGap: starsGap }]}>
				{stars.map(c => (
					<Pressable
						key={c}
						style={starStyle}
						onPress={() => {
							if (onStarPress instanceof Function)
								onStarPress(c);
						}}>
						<AntDesign name={c <= starCount ? 'star' : 'staro'} size={starSize} color={cSecondary} />
					</Pressable>
				))}
			</View>
			{!!reviewCount && <XText secondary>({reviewCount})</XText>}
		</View>
	)
};

const styles = StyleSheet.create({
	cnt: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	markCnt: {
		marginHorizontal: 6,
		flexDirection: 'row'
	},
	markChip: {
		height: 22,
		paddingHorizontal: 6
	}
});

export default React.memo(XMarkStars);