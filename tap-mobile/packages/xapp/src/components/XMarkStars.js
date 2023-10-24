import { StyleSheet, View } from "react-native";
import { useTranslation } from "../i18n/I18nContext";
import { useColor } from "../style/ThemeContext";
import XChip from "./basic/XChip";
import { AntDesign } from "@expo/vector-icons";
import XText from "./basic/XText";
import React from "react";

const XMarkStars = ({ mark, reviewCound, style }) => {

	const starCount = Math.floor(mark);
	const stars = Array.from({ length: 5 }, (_, idx) => idx + 1);
	const cSecondary = useColor('secondary');
	const t = useTranslation();

	return (
		<View style={[styles.cnt, style]}>
			<XChip primary text={mark?.toFixed(1)} />
			<View style={styles.markCnt}>
				{stars.map(c => (
					<View key={c}>
						<AntDesign name={c <= starCount ? 'star' : 'staro'} size={18} color={cSecondary} />
					</View>
				))}
			</View>
			{reviewCound != null && <XText secondary>({reviewCound + ' ' + t('reviews')})</XText>}
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
	}
});

export default React.memo(XMarkStars);