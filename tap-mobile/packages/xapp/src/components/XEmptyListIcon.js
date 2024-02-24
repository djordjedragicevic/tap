import { StyleSheet, View } from "react-native";
import XText from "./basic/XText";
import { useTranslation } from "../i18n/I18nContext";
import XImage from "./basic/XImage";

const XEmptyListIcon = ({ text, iconSize = 120 }) => {
	const t = useTranslation();
	return (
		<View style={styles.constainer}>
			<View style={styles.inner}>
				<XImage source={require('../assets/svg/empty.svg')} style={{ width: iconSize, height: iconSize, opacity: 0.8 }} />
				{text && <XText secondary size={16}>{text === true ? t("No items") : text}</XText>}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	constainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	inner: {
		alignItems: 'center',
		justifyContent: 'center',
		rowGap: 15
	}
})

export default XEmptyListIcon;