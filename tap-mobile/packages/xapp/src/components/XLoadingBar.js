import { useThemedStyle } from "../style/ThemeContext";
import { StyleSheet, View } from 'react-native';

const XLoadingBar = () => {
	const styles = useThemedStyle(styleCreator);

	return (<View style={styles.bar} />);
};

const styleCreator = (theme) => StyleSheet.create({
	bar: {
		backgroundColor: theme.colors.primary,
		position: 'absolute',
		height: 3,
		width: '100%'
	}
})

export default XLoadingBar;