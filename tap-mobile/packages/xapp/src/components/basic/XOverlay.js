import { StyleSheet, View } from "react-native";
import { useStore } from "../../store/store";

const XOverlay = () => {
	const isMaksed = useStore(gS => gS.app.isMasked);

	if (!isMaksed)
		return null

	return (
		<View style={styles.mask} />
	)
};

const styles = StyleSheet.create({
	mask: {
		...StyleSheet.absoluteFill,
		backgroundColor: 'green',
		opacity: 0.3
	}
})

export default XOverlay;